import Redis from "ioredis";

declare global {
  var redis: Redis | undefined;
}

const redisClientSingleton = () => {
  const client = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableOfflineQueue: true,
    connectTimeout: 10000,
    disconnectTimeout: 2000,
    commandTimeout: 5000,
    keepAlive: 10000,
    lazyConnect: false,
    reconnectOnError: function(err) {
      const targetError = "READONLY";
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
  });

  client.on("error", (error) => {
    console.error("Redis connection error:", error);
  });

  client.on("connect", () => {
    console.log("Successfully connected to Redis");
  });

  client.on("ready", () => {
    console.log("Redis client is ready");
  });

  client.on("reconnecting", () => {
    console.log("Redis client is reconnecting");
  });

  return client;
};

let redisClient: Redis | undefined;

if (!redisClient) {
  redisClient = redisClientSingleton();
}

const redis = globalThis.redis ?? redisClient;

if (process.env.NODE_ENV !== "production") {
  globalThis.redis = redis;
}

export async function emailRateLimit(
  email: string,
  ip: string,
  maxEmails = 100,
  timeWindow = 3600
) {
  try {
    const key = `email-rate-limit:${email}`;
    const ipKey = `ip-rate-limit:${ip}`;

    // Get current count
    let count: string | null | number = await redis.get(key);
    let ipCount: string | null | number = await redis.get(ipKey);
    if (!count) {
      // First email in time window
      await redis.setex(key, timeWindow, 1);
      await redis.setex(ipKey, timeWindow, 1);
      return true;
    }

    count = parseInt(count);
    ipCount = parseInt(ipCount ?? "0");
    if (count >= maxEmails || ipCount >= maxEmails) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    // Increment count
    await redis.incr(key);
    await redis.incr(ipKey);
    return true;
  } catch (error) {
    console.error("Redis rate limit error:", error);
    return false;
  }
}

export async function smsRateLimit(
  phone: string,
  ip: string,
  maxSMS = 3,
  timeWindow = 30
) {
  try {
    const key = `sms-rate-limit:${phone}`;
    const ipKey = `ip-rate-limit:${ip}`;

    // Get current count
    let count: string | null | number = await redis.get(key);
    let ipCount: string | null | number = await redis.get(ipKey);
    if (!count) {
      // First SMS in time window
      await redis.setex(key, timeWindow, 1);
      await redis.setex(ipKey, timeWindow, 1);
      return true;
    }

    count = parseInt(count);
    ipCount = parseInt(ipCount ?? "0");
    if (count >= maxSMS || ipCount >= maxSMS) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    // Increment count
    await redis.incr(key);
    await redis.incr(ipKey);
    return true;
  } catch (error) {
    console.error("Redis rate limit error:", error);
    return false;
  }
}

const PENDING_RESERVATION_PREFIX = "pending_reservation:";
const RESERVATION_EXPIRY = 60 * 30; // 30 minutes in seconds

export async function storePendingReservation(orderId: string, details: any) {
  try {
    await redis.setex(
      `${PENDING_RESERVATION_PREFIX}${orderId}`,
      RESERVATION_EXPIRY,
      JSON.stringify(details)
    );
  } catch (error) {
    console.error("Redis store reservation error:", error);
    throw error;
  }
}

export async function getPendingReservation(orderId: string) {
  try {
    const data = await redis.get(`${PENDING_RESERVATION_PREFIX}${orderId}`);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error("Redis get reservation error:", error);
    return null;
  }
}

export async function deletePendingReservation(orderId: string) {
  try {
    await redis.del(`${PENDING_RESERVATION_PREFIX}${orderId}`);
  } catch (error) {
    console.error("Redis delete reservation error:", error);
    throw error;
  }
}

export { redis }; 
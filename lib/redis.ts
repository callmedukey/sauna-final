import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT as string) || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

redis.on("connect", () => {
  console.log("Successfully connected to Redis");
});

export async function emailRateLimit(
  email: string,
  ip: string,
  maxEmails = 100,
  timeWindow = 3600
) {
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
}
export async function smsRateLimit(
  phone: string,
  ip: string,
  maxEmails = 3,
  timeWindow = 30
) {
  const key = `sms-rate-limit:${phone}`;
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
}

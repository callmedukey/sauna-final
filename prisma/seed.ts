import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {}

main()
  .then(async () => {
    const hashedPassword = await bcrypt.hash("admin2024@@", 10);

    await prisma.user.upsert({
      where: {
        email: "admin@sauna.com",
      },
      update: {
        password: hashedPassword,
        role: "ADMIN",
        name: "관리자",
        phone: "010-1234-5678",
        email: "admin@sauna.com",
      },
      create: {
        email: "admin@sauna.com",
        password: hashedPassword,
        name: "관리자",
        phone: "010-1234-5678",
        role: "ADMIN",
      },
    });

    console.log("Seeded");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

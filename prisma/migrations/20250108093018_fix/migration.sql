-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('MEN60', 'MEN60WEEKEND', 'MEN90', 'MEN90WEEKEND', 'WOMEN60', 'WOMEN60WEEKEND', 'WOMEN90', 'WOMEN90WEEKEND', 'MEN_FAMILY', 'MEN_FAMILYWEEKEND', 'WOMEN_FAMILY', 'WOMEN_FAMILYWEEKEND', 'MIX', 'MIXWEEKEND');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('POPUP');

-- CreateEnum
CREATE TYPE "SpecialDateType" AS ENUM ('BLOCKED', 'DISCOUNT');

-- CreateEnum
CREATE TYPE "PointType" AS ENUM ('PAYMENT', 'SIGNUP', 'USED');

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VerificationEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationSMS" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "VerificationSMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "deactivated" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "verificationEmailId" TEXT,
    "verificationSMSId" TEXT,
    "point" INTEGER NOT NULL DEFAULT 3000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "canceled" BOOLEAN NOT NULL DEFAULT false,
    "women" INTEGER NOT NULL DEFAULT 0,
    "men" INTEGER NOT NULL DEFAULT 0,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "roomType" "RoomType" NOT NULL,
    "time" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "message" TEXT,
    "usedPoint" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL,
    "paidPrice" INTEGER NOT NULL,
    "orderId" TEXT,
    "paymentKey" TEXT,
    "paymentStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignedAgreement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "path" TEXT NOT NULL,
    "reservationId" TEXT,
    "naverReservationId" TEXT,

    CONSTRAINT "SignedAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NaverReservation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "reservationNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NaverReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialDate" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" "SpecialDateType" NOT NULL,
    "discount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "answer" TEXT,
    "answeredAt" TIMESTAMP(3),
    "answeredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointPayment" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentKey" TEXT,
    "paymentStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pointType" "PointType" NOT NULL,
    "reservationId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PointPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationEmail_email_key" ON "VerificationEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationEmail_userId_key" ON "VerificationEmail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationSMS_phone_key" ON "VerificationSMS"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationSMS_userId_key" ON "VerificationSMS"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_orderId_key" ON "Reservation"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PointPayment_orderId_key" ON "PointPayment"("orderId");

-- AddForeignKey
ALTER TABLE "VerificationEmail" ADD CONSTRAINT "VerificationEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationSMS" ADD CONSTRAINT "VerificationSMS_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignedAgreement" ADD CONSTRAINT "SignedAgreement_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignedAgreement" ADD CONSTRAINT "SignedAgreement_naverReservationId_fkey" FOREIGN KEY ("naverReservationId") REFERENCES "NaverReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointPayment" ADD CONSTRAINT "PointPayment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointPayment" ADD CONSTRAINT "PointPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

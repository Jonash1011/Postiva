-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpExpiry" TIMESTAMP(3),
ADD COLUMN     "resetOtp" TEXT;

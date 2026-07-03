/*
  Warnings:

  - Made the column `postalCode` on table `UserAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserAddress" ALTER COLUMN "address2" DROP NOT NULL,
ALTER COLUMN "postalCode" SET NOT NULL;

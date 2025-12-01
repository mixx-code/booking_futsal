/*
  Warnings:

  - You are about to drop the column `image` on the `field` table. All the data in the column will be lost.
  - Added the required column `images` to the `field` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "field" DROP COLUMN "image",
ADD COLUMN     "images" JSONB NOT NULL;

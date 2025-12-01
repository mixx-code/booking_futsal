/*
  Warnings:

  - The `images` column on the `field` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "field" DROP COLUMN "images",
ADD COLUMN     "images" JSONB[];

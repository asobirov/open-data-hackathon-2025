/*
  Warnings:

  - A unique constraint covering the columns `[inn,name]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Company_inn_key";

-- CreateIndex
CREATE UNIQUE INDEX "Company_inn_name_key" ON "Company"("inn", "name");

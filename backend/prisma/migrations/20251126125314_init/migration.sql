/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "cpf" TEXT;

-- AlterTable
ALTER TABLE "loans" ALTER COLUMN "status" SET DEFAULT 'open';

-- CreateIndex
CREATE UNIQUE INDEX "clients_cpf_key" ON "clients"("cpf");

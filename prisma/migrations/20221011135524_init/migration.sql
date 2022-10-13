-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Member', 'Visitor', 'Coordinator');

-- CreateEnum
CREATE TYPE "PermissionStatus" AS ENUM ('Approved', 'Deined', 'StandingBy');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "card" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "occupation" TEXT,
    "linkedin" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PermissionStatus" NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relatory" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Relatory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_card_key" ON "User"("card");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

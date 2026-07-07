/**
 * Database seed script.
 * Creates the single Queue Manager account used to log in to the app.
 * Run with: npm run prisma:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_MANAGER_EMAIL ?? "manager@queueflow.com";
  const password = process.env.SEED_MANAGER_PASSWORD ?? "ChangeMe123!";
  const name = process.env.SEED_MANAGER_NAME ?? "Queue Manager";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Manager account already exists: ${email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  console.log("Seeded Queue Manager account:");
  console.log(`  email: ${user.email}`);
  console.log(`  password: ${password} (change this after first login)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

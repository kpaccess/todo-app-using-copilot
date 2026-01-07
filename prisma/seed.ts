import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

const predefinedTopics = [
  { title: 'JavaScript Basics', description: 'Learn the fundamentals of JavaScript.' },
  { title: 'ES6 Features', description: 'Explore new features introduced in ES6.' },
  { title: 'Asynchronous JavaScript', description: 'Understand promises, async/await, and event loops.' },
  { title: 'JavaScript Design Patterns', description: 'Learn common design patterns in JavaScript.' },
  { title: 'JavaScript Testing', description: 'Introduction to testing frameworks like Jest.' },
];

async function main() {
  console.log("Seeding predefined topics...");

  for (const topic of predefinedTopics) {
    await prisma.predefinedTopic.upsert({
      where: { title: topic.title },
      update: {},
      create: topic,
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

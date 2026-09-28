/**
 * Seeds categories and one editorial row per code-defined calculator.
 * Idempotent: safe to run repeatedly; never overwrites admin edits.
 *
 *   npm run db:seed
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { categories } from "../src/calculators/categories";
import { calculatorMetas } from "../src/calculators/registry.generated";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to seed.");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const categoryIds = new Map<string, string>();
  for (const [index, category] of categories.entries()) {
    const row = await db.calculatorCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description, sortOrder: index },
      create: { slug: category.slug, name: category.name, description: category.description, sortOrder: index },
    });
    categoryIds.set(category.slug, row.id);
  }

  for (const meta of calculatorMetas) {
    // Only structural fields; all editorial fields stay null so code defaults apply.
    await db.calculator.upsert({
      where: { slug: meta.slug },
      update: {},
      create: { slug: meta.slug, categoryId: categoryIds.get(meta.category) ?? null },
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail) {
    await db.user.upsert({ where: { email: adminEmail }, update: { role: "ADMIN" }, create: { email: adminEmail, role: "ADMIN", name: "Admin" } });
  }

  console.log(`Seeded ${categories.length} categories and ${calculatorMetas.length} calculators${adminEmail ? ` and admin ${adminEmail}` : ""}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

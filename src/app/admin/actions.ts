"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { categories, getCategory, isCategorySlug } from "@/calculators/categories";
import { calculatorMetas, findCalculator } from "@/calculators/registry";
import { parseFaqText } from "@/lib/admin/faq-text";
import { requireAdmin } from "@/lib/auth/session";
import { CATALOG_CACHE_TAG } from "@/lib/catalog";
import { getDb } from "@/lib/db";

export type AdminFormState = { status: "idle" | "saved" | "error"; message?: string };

const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens.").max(80);

async function categoryId(slug: string): Promise<string> {
  const category = getCategory(slug)!;
  const row = await getDb().calculatorCategory.upsert({
    where: { slug },
    update: {},
    create: { slug, name: category.name, description: category.description, sortOrder: categories.findIndex((c) => c.slug === slug) },
  });
  return row.id;
}

function refreshPublicPages() {
  updateTag(CATALOG_CACHE_TAG);
  revalidatePath("/", "layout");
}

const editSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(3).max(120),
  shortDescription: z.string().trim().min(10).max(300),
  description: z.string().trim().min(10).max(600),
  seoTitle: z.string().trim().min(10).max(70),
  seoDescription: z.string().trim().min(50).max(170),
  keywords: z.string().max(1000),
  category: z.string().refine(isCategorySlug, "Choose a category."),
  related: z.string().max(1000),
  faqs: z.string().max(20_000),
  featured: z.boolean(),
  premium: z.boolean(),
  published: z.boolean(),
});

/**
 * Saves editorial overrides. Values equal to the code default are stored as
 * null so the calculator keeps tracking future code changes for that field.
 */
export async function saveCalculatorOverrides(_prev: AdminFormState, form: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = editSchema.safeParse({
    ...Object.fromEntries(["slug", "name", "shortDescription", "description", "seoTitle", "seoDescription", "keywords", "category", "related", "faqs"].map((k) => [k, String(form.get(k) ?? "")])),
    featured: form.get("featured") === "on",
    premium: form.get("premium") === "on",
    published: form.get("published") === "on",
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { status: "error", message: `${issue?.path.join(".")}: ${issue?.message}` };
  }
  const v = parsed.data;
  const base = findCalculator(calculatorMetas, v.slug);
  const keywords = v.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
  const related = v.related.split(",").map((s) => s.trim()).filter(Boolean);
  const unknown = related.filter((s) => !findCalculator(calculatorMetas, s) || s === v.slug);
  if (unknown.length) return { status: "error", message: `Unknown related calculators: ${unknown.join(", ")}` };
  // Plain objects: Prisma JSON inputs need index-signature-compatible types.
  const faqs = parseFaqText(v.faqs).map((f) => ({ question: f.question, answer: f.answer }));

  const same = <T,>(value: T, def: T | undefined) => (base && JSON.stringify(value) === JSON.stringify(def) ? null : value);
  const data = {
    name: same(v.name, base?.name),
    shortDescription: same(v.shortDescription, base?.shortDescription),
    description: same(v.description, base?.description),
    seoTitle: same(v.seoTitle, base?.seoTitle),
    seoDescription: same(v.seoDescription, base?.seoDescription),
    keywords: base && JSON.stringify(keywords) === JSON.stringify(base.keywords) ? [] : keywords,
    relatedSlugs: base && JSON.stringify(related) === JSON.stringify(base.related) ? [] : related,
    featured: same(v.featured, base?.featured ?? false),
    premium: same(v.premium, base?.premium ?? false),
    status: v.published ? ("PUBLISHED" as const) : ("DRAFT" as const),
    faqs: faqs.length ? faqs : undefined,
    categoryId: await categoryId(v.category),
  };

  await getDb().calculator.upsert({ where: { slug: v.slug }, update: { ...data, faqs: faqs.length ? faqs : [] }, create: { slug: v.slug, ...data } });
  refreshPublicPages();
  return { status: "saved", message: "Saved. Public pages update immediately." };
}

export async function resetCalculatorOverrides(slug: string): Promise<void> {
  await requireAdmin();
  if (!slugSchema.safeParse(slug).success) return;
  await getDb().calculator.deleteMany({ where: { slug } });
  refreshPublicPages();
  redirect(`/admin/calculators/${slug}`);
}

const createSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(3).max(120),
  category: z.string().refine(isCategorySlug, "Choose a category."),
  shortDescription: z.string().trim().max(300),
});

/**
 * Creates a metadata-only draft. It stays unpublished until a developer adds
 * the code definition (see docs/ADDING_A_CALCULATOR.md) — calculation logic is
 * intentionally never created from the admin UI.
 */
export async function createCalculatorDraft(_prev: AdminFormState, form: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = createSchema.safeParse(Object.fromEntries(["slug", "name", "category", "shortDescription"].map((k) => [k, String(form.get(k) ?? "")])));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  const db = getDb();
  if (await db.calculator.findUnique({ where: { slug: parsed.data.slug } })) return { status: "error", message: "That slug already exists." };
  await db.calculator.create({
    data: {
      slug: parsed.data.slug,
      name: parsed.data.name,
      shortDescription: parsed.data.shortDescription || null,
      status: "DRAFT",
      categoryId: await categoryId(parsed.data.category),
    },
  });
  redirect("/admin/calculators");
}

export async function updateSuggestionStatus(id: string, status: "NEW" | "PLANNED" | "BUILT" | "DECLINED"): Promise<void> {
  await requireAdmin();
  if (!z.enum(["NEW", "PLANNED", "BUILT", "DECLINED"]).safeParse(status).success) return;
  await getDb().calculatorSuggestion.update({ where: { id }, data: { status } });
  revalidatePath("/admin/suggestions");
}

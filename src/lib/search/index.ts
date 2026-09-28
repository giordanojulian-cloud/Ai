/**
 * Dependency-free calculator search with typo tolerance, synonyms and
 * natural-language queries ("how much house can i afford").
 * Pure functions: the same code runs on the server (/search) and client (navbar).
 */

export interface SearchDoc {
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  categoryName: string;
  keywords: string[];
  aliases: string[];
  popularity: number;
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
}

const STOPWORDS = new Set([
  "a", "an", "and", "are", "calc", "calculate", "calculation", "calculator", "can", "do", "does", "for", "how", "i",
  "in", "is", "it", "me", "much", "my", "of", "on", "or", "per", "should", "the", "to", "what", "will", "with", "you", "your",
]);

/** Query token -> extra tokens to search for. */
const SYNONYMS: Record<string, string[]> = {
  house: ["home", "mortgage"],
  home: ["house", "mortgage"],
  afford: ["affordability"],
  affordable: ["affordability"],
  wage: ["salary", "hourly"],
  pay: ["salary", "payment"],
  paycheck: ["salary"],
  income: ["salary"],
  hour: ["hourly"],
  return: ["roi"],
  returns: ["roi"],
  invest: ["investment"],
  investing: ["investment"],
  cc: ["credit", "card"],
  breakeven: ["break", "even"],
  saas: ["software", "startup"],
  valuation: ["value", "worth"],
  rent: ["rental"],
  landlord: ["rental"],
  yield: ["apy"],
  percent: ["percentage"],
  gratuity: ["tip"],
  payroll: ["employee"],
  hire: ["employee"],
  concrete: ["cement"],
  cement: ["concrete"],
  sqft: ["square", "footage"],
};

function stem(token: string): string {
  if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9%$]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(stem);
}

/** Bounded Levenshtein distance; returns max+1 as soon as the bound is exceeded. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(previous[j]! + 1, current[j - 1]! + 1, previous[j - 1]! + cost);
      current.push(value);
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > max) return max + 1;
    previous = current;
  }
  return previous[b.length]!;
}

function tokenMatch(query: string, target: string): number {
  if (query === target) return 1;
  if (query.length >= 2 && target.startsWith(query)) return 0.85;
  if (query.length >= 4) {
    const allowed = query.length >= 8 ? 2 : 1;
    if (editDistance(query, target, allowed) <= allowed) return 0.65;
    if (target.includes(query)) return 0.5;
  }
  return 0;
}

interface IndexedDoc {
  doc: SearchDoc;
  fields: { tokens: string[]; weight: number }[];
  phrases: string[];
}

const FIELD_WEIGHTS = { name: 5, aliases: 4, keywords: 3, category: 2, description: 1 } as const;

export function indexDocs(docs: SearchDoc[]): IndexedDoc[] {
  return docs.map((doc) => ({
    doc,
    fields: [
      { tokens: tokenize(doc.name), weight: FIELD_WEIGHTS.name },
      { tokens: doc.aliases.flatMap(tokenize), weight: FIELD_WEIGHTS.aliases },
      { tokens: doc.keywords.flatMap(tokenize), weight: FIELD_WEIGHTS.keywords },
      { tokens: tokenize(doc.categoryName), weight: FIELD_WEIGHTS.category },
      { tokens: tokenize(doc.shortDescription), weight: FIELD_WEIGHTS.description },
    ],
    phrases: [doc.name, ...doc.aliases, ...doc.keywords].map((p) => tokenize(p).join(" ")),
  }));
}

export function searchIndex(index: IndexedDoc[], query: string, limit = 20): SearchHit[] {
  const allTokens = tokenize(query);
  const tokens = allTokens.filter((t) => !STOPWORDS.has(t));
  if (tokens.length === 0) return [];
  const phrase = allTokens.join(" ");

  const hits: SearchHit[] = [];
  for (const entry of index) {
    let score = 0;
    let matched = 0;
    for (const token of tokens) {
      const variants = [token, ...(SYNONYMS[token] ?? [])];
      let best = 0;
      for (const variant of variants) {
        const synonymPenalty = variant === token ? 1 : 0.8;
        for (const field of entry.fields) {
          for (const target of field.tokens) {
            const m = tokenMatch(variant, target) * field.weight * synonymPenalty;
            if (m > best) best = m;
          }
        }
      }
      if (best > 0) matched++;
      score += best;
    }
    const coverage = matched / tokens.length;
    if (coverage < 0.5) continue;
    if (entry.phrases.some((p) => p === phrase)) score += 12;
    else if (phrase.length >= 4 && entry.phrases.some((p) => p.includes(phrase))) score += 6;
    hits.push({ doc: entry.doc, score: score * coverage * coverage });
  }

  return hits.sort((a, b) => b.score - a.score || a.doc.popularity - b.doc.popularity).slice(0, limit);
}

export function searchCalculators(docs: SearchDoc[], query: string, limit = 20): SearchHit[] {
  return searchIndex(indexDocs(docs), query, limit);
}

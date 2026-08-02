import type { MetadataRoute } from "next";
import { marketingPages, resolveProductionOrigin } from "../lib/marketing";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = resolveProductionOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (!origin) return [];
  return ["", ...marketingPages.map(({ slug }) => slug)].map((path) => ({ url: `${origin}/${path}`, changeFrequency: "monthly" as const, priority: path ? 0.6 : 1 }));
}

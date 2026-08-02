import type { MetadataRoute } from "next";
import { resolveProductionOrigin } from "../lib/marketing";

export default function robots(): MetadataRoute.Robots {
  const origin = resolveProductionOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  return { rules: { userAgent: "*", disallow: "/" }, sitemap: origin ? `${origin}/sitemap.xml` : undefined };
}

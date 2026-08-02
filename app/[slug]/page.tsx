import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarketingPage, marketingPages, resolveProductionOrigin } from "../../lib/marketing";
import { product } from "../../lib/product";
import { MarketingInfoPage } from "./marketing-info-page";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return marketingPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getMarketingPage(slug);
  if (!entry) return {};
  const origin = resolveProductionOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  return {
    title: entry.title,
    description: entry.description,
    alternates: origin ? { canonical: `${origin}/${entry.slug}` } : undefined,
    robots: { index: false, follow: false },
    openGraph: { type: "website", siteName: product.name, title: entry.title, description: entry.description, url: origin ? `${origin}/${entry.slug}` : undefined },
  };
}

export default async function MarketingRoute({ params }: PageProps) {
  const { slug } = await params;
  const entry = getMarketingPage(slug);
  if (!entry) notFound();
  return <MarketingInfoPage page={entry} />;
}

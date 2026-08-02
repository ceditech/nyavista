import type { Metadata, Viewport } from "next";
import { product } from "../lib/product";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: product.metadata.title, template: `%s | ${product.name}` },
  description: product.metadata.description,
  applicationName: product.name,
  keywords: [...product.metadata.keywords],
  creator: product.owner,
  publisher: product.owner,
  category: "news",
  robots: {
    index: product.metadata.indexable,
    follow: product.metadata.indexable,
    googleBot: { index: product.metadata.indexable, follow: product.metadata.indexable },
  },
  openGraph: {
    type: "website",
    siteName: product.name,
    title: product.metadata.title,
    description: product.metadata.description,
    locale: product.internationalization.defaultLocale.replace("-", "_"),
    alternateLocale: product.internationalization.supportedLocales.slice(1).map((locale) => locale.replace("-", "_")),
  },
  twitter: { card: "summary", title: product.metadata.title, description: product.metadata.description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: product.themeColors.light },
    { media: "(prefers-color-scheme: dark)", color: product.themeColors.dark },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={product.internationalization.defaultLocale} suppressHydrationWarning><body suppressHydrationWarning>{children}</body></html>;
}

export const supportedLocales = ["en-US", "en-CA", "en-GB", "en-NZ", "en-AU"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const product = {
  name: "NyaVista",
  tagline: "Every story. A clearer view.",
  owner: "E-DEAL EXPRESS LLC",
  foundingCountry: "United States",
  positioning: "Global AI-powered news intelligence and multimedia platform",
  editorialScope: "Global, nonpartisan, and country-neutral",
  demoDisclosure: "Demo content — not live reporting.",
  metadata: {
    title: "NyaVista — Every story. A clearer view.",
    description: "A first-pass demo of NyaVista, the global AI-powered news intelligence and multimedia platform from E-DEAL EXPRESS LLC.",
    keywords: ["global news intelligence", "multi-source context", "news transparency", "multimedia news"],
    indexable: false,
  },
  internationalization: {
    defaultLocale: "en-US" as SupportedLocale,
    supportedLocales,
    canonicalTimeZone: "UTC",
    canonicalTimestampStandard: "ISO 8601 UTC",
  },
  commercialMarkets: [
    { countryCode: "US", locale: "en-US", name: "United States" },
    { countryCode: "CA", locale: "en-CA", name: "Canada" },
    { countryCode: "GB", locale: "en-GB", name: "United Kingdom" },
    { countryCode: "NZ", locale: "en-NZ", name: "New Zealand" },
    { countryCode: "AU", locale: "en-AU", name: "Australia" },
  ],
  editorialPolicy: {
    marketPriorityAffectsEditorialImportance: false,
    geographyStandard: "Apply consistent qualifying standards to every geography.",
  },
  themeColors: {
    light: "#f6f8fb",
    dark: "#031b2d",
  },
} as const;

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.some((locale) => locale.toLowerCase() === value.trim().replaceAll("_", "-").toLowerCase());
}

export function resolveLocale(value?: string | null): SupportedLocale {
  if (!value) return product.internationalization.defaultLocale;
  const normalized = value.trim().replaceAll("_", "-");
  return supportedLocales.find((locale) => locale.toLowerCase() === normalized.toLowerCase()) ?? product.internationalization.defaultLocale;
}

type LocaleOptions = { locale?: string | null };
type DateTimeOptions = LocaleOptions & Intl.DateTimeFormatOptions;

function validDate(value: Date | string | number): Date {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new RangeError("A valid date or timestamp is required");
  return date;
}

export function formatDateTime(value: Date | string | number, options: DateTimeOptions = {}): string {
  const { locale, timeZone = product.internationalization.canonicalTimeZone, ...formatOptions } = options;
  return new Intl.DateTimeFormat(resolveLocale(locale), { dateStyle: "medium", timeStyle: "short", timeZone, ...formatOptions }).format(validDate(value));
}

export function formatNumber(value: number, options: LocaleOptions & Intl.NumberFormatOptions = {}): string {
  if (!Number.isFinite(value)) throw new RangeError("A finite number is required");
  const { locale, ...formatOptions } = options;
  return new Intl.NumberFormat(resolveLocale(locale), formatOptions).format(value);
}

export function formatCurrency(value: number, currency: string, options: LocaleOptions & Omit<Intl.NumberFormatOptions, "style" | "currency"> = {}): string {
  if (!/^[A-Za-z]{3}$/.test(currency)) throw new RangeError("Currency must be a three-letter ISO 4217 code");
  const { locale, ...formatOptions } = options;
  return formatNumber(value, { ...formatOptions, locale, style: "currency", currency: currency.toUpperCase() });
}

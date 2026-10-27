import es from "./es.json";
import en from "./en.json";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export type Dictionary = typeof es;

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function isLocale(value?: string): value is Locale {
  return (locales as readonly string[]).includes(value ?? "");
}

export function getLocale(url: URL): Locale {
  const [, first] = url.pathname.split("/");
  return isLocale(first) ? first : defaultLocale;
}

export function getDict(locale?: string): Dictionary {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}

export function withLocale(path: string, locale: Locale): string {
  const [pathname, hash] = path.split("#");
  const clean = pathname.replace(/^\/(?:en|es)(?=\/|$)/, "") || "/";
  const target =
    locale === defaultLocale
      ? clean
      : clean === "/"
        ? `/${locale}`
        : `/${locale}${clean}`;
  return hash !== undefined ? `${target}#${hash}` : target;
}

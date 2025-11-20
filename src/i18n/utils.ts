import esTranslations from './locales/es.json'
import enTranslations from './locales/en.json'

export const defaultLang = 'es'
export const languages = {
  es: 'Español',
  en: 'English',
}

const translations = {
  es: esTranslations,
  en: enTranslations,
}

export type Language = keyof typeof translations

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/')
  if (lang in translations) return lang as Language
  return defaultLang
}

export function useTranslations(lang: Language) {
  return function t(key: string): any {
    const keys = key.split('.')
    let value: any = translations[lang]

    for (const k of keys) {
      value = value?.[k]
    }

    return value ?? translations[defaultLang]
  }
}

export function getLocalizedPath(path: string, lang: Language): string {
  if (lang === defaultLang) {
    return path
  }
  return `/${lang}${path}`
}

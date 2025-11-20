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

export async function getTranslatedBlogPath(currentSlug: string, currentLang: Language, targetLang: Language): Promise<string | null> {
  try {
    const { getCollection } = await import('astro:content');
    const posts = await getCollection('blog');

    // Find the current post
    const currentPost = posts.find(post => {
      const slug = post.id.replace(/^(en|es)\//, '');
      return slug === currentSlug && post.id.startsWith(`${currentLang}/`);
    });

    if (!currentPost) {
      return null;
    }

    // Get the translation slug from the post data
    const translatedSlug = currentPost.data.relatedSlug;

    if (!translatedSlug) {
      return null;
    }

    // Verify the translated post exists
    const translatedPost = posts.find(post => {
      const slug = post.id.replace(/^(en|es)\//, '');
      return slug === translatedSlug && post.id.startsWith(`${targetLang}/`);
    });

    if (!translatedPost) {
      return null;
    }

    // Build the final path with correct language prefix
    // Spanish (default): /blog/{slug}
    // English: /en/blog/{slug}
    const finalPath = targetLang === defaultLang
      ? `/blog/${translatedSlug}`
      : `/${targetLang}/blog/${translatedSlug}`;

    return finalPath;
  } catch (error) {
    console.error('[getTranslatedBlogPath] Error:', error);
    return null;
  }
}

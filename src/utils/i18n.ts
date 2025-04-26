import { defaultLocale } from '@/config';

/**
 * Load messages for the given locale
 */
export async function getMessages(locale: string = defaultLocale) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to default locale if the requested locale doesn't exist
    return (await import(`../messages/${defaultLocale}.json`)).default;
  }
} 
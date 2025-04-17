import {getRequestConfig} from 'next-intl/server';

// Set default locale
const defaultLocale = 'en';

export default getRequestConfig(async () => {
  return {
    messages: (await import(`../messages/${defaultLocale}.json`)).default
  };
}); 
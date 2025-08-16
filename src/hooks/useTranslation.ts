import { useLanguage } from '../contexts/LanguageContext';

export const useTranslation = <T extends Record<string, any>>(translations: T): T[keyof T] => {
  const { language } = useLanguage();
  return translations[language] || translations.de;
};
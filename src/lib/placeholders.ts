// Dictionary texts carry contact facts as placeholders, so the number and the address live only in
// src/config/site.ts. {phone} and {email} are replaced with their display form; the phone number takes
// the international form on English pages.
import { phoneDisplay, studio } from '../config/site';
import type { Locale } from '../i18n/routes';

export function fillStudio(text: string, locale: Locale): string {
  return text.replaceAll('{phone}', phoneDisplay(locale)).replaceAll('{email}', studio.email.display);
}

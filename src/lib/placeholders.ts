// Dictionary texts carry contact facts as placeholders, so the number and the address live only in
// src/config/site.ts. {phone} and {email} are replaced with their display form.
import { studio } from '../config/site';

export function fillStudio(text: string): string {
  return text.replaceAll('{phone}', studio.phone.display).replaceAll('{email}', studio.email.display);
}

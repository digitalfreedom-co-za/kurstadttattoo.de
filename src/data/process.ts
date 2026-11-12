// From the first call to aftercare: the real sequence of a tattoo at KurstadtTattoo, shared by the
// landing page and the consultation page (#6). Texts live in the dictionaries under process.steps.
import type { Step } from '../components/ui/Steps.astro';
import { t, type Locale } from '../i18n';

export function processSteps(locale: Locale): Step[] {
  return t(locale).process.steps;
}

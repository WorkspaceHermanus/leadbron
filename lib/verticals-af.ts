/**
 * Afrikaans campaign pages.
 *
 * English insurance keywords in South Africa are fought over by every bank
 * and insurer. The Afrikaans equivalents carry the same buying intent at a
 * fraction of the competition, and nobody serves that audience in their own
 * language. These pages exist to convert that traffic.
 */

export type VerticalAf = {
  slug: string;          // Afrikaans URL slug
  englishSlug: string;   // maps back to the vertical in lib/verticals.ts
  name: string;
  headline: string;
  sub: string;
  metaTitle: string;
  metaDescription: string;
};

export const VERTICALS_AF: VerticalAf[] = [
  {
    slug: "lewensdekking",
    englishSlug: "long-term",
    name: "Lewensdekking",
    headline: "Lewensdekking kwotasies, sonder die gesukkel",
    sub: "Vertel ons 'n bietjie van jouself en 'n geakkrediteerde finansiële adviseur bel jou terug met opsies wat by jou begroting pas.",
    metaTitle: "Lewensdekking Kwotasie — Gratis, Vinnig | LeadBron",
    metaDescription:
      "Kry 'n gratis lewensdekking kwotasie in Suid-Afrika. 'n Geakkrediteerde adviseur bel jou terug met opsies wat by jou begroting pas. Geen verpligting nie.",
  },
  {
    slug: "voertuigversekering",
    englishSlug: "short-term",
    name: "Voertuig- en huisversekering",
    headline: "Betaal minder vir jou motor- en huisversekering",
    sub: "Laat 'n gekwalifiseerde adviseur korttermyn dekking vir jou vergelyk — die meeste mense bespaar binne die eerste oproep.",
    metaTitle: "Voertuigversekering Kwotasie — Vergelyk & Bespaar | LeadBron",
    metaDescription:
      "Vergelyk voertuig- en huisversekering kwotasies in Suid-Afrika. 'n Geakkrediteerde adviseur bel jou met beter pryse. Gratis en sonder verpligting.",
  },
  {
    slug: "mediese-fonds",
    englishSlug: "medical-aid",
    name: "Mediese fonds en gapingsdekking",
    headline: "Kry 'n mediese fonds wat werklik by jou pas",
    sub: "'n Geakkrediteerde adviseur stap deur die planne en gapingsdekking opsies langs mekaar saam met jou.",
    metaTitle: "Mediese Fonds Vergelyk — Gratis Kwotasie | LeadBron",
    metaDescription:
      "Vergelyk mediese fondse en gapingsdekking in Suid-Afrika. 'n Geakkrediteerde adviseur verduidelik die planne en help jou kies. Gratis.",
  },
  {
    slug: "begrafnisdekking",
    englishSlug: "long-term",
    name: "Begrafnisdekking",
    headline: "Begrafnisdekking wat jou familie regtig beskerm",
    sub: "Een oproep van 'n geakkrediteerde adviseur wys jou wat 'n begrafnis werklik kos en watter dekking sin maak.",
    metaTitle: "Begrafnisdekking Kwotasie — Gratis Advies | LeadBron",
    metaDescription:
      "Kry 'n gratis begrafnisdekking kwotasie. 'n Geakkrediteerde adviseur help jou kies wat by jou familie en begroting pas. Sonder verpligting.",
  },
  {
    slug: "testament-en-boedel",
    englishSlug: "wills-trusts",
    name: "Testament en boedel",
    headline: "Kry jou testament reg opgestel",
    sub: "'n Gekwalifiseerde adviseur help jou met 'n testament of trust wat jou familie beskerm.",
    metaTitle: "Testament Opstel — Gratis Advies | LeadBron",
    metaDescription:
      "Laat jou testament of trust behoorlik opstel. 'n Geakkrediteerde adviseur in Suid-Afrika bel jou terug. Gratis konsultasie.",
  },
  {
    slug: "besigheidsversekering",
    englishSlug: "business",
    name: "Besigheidsversekering",
    headline: "Beskerm jou besigheid en sy mense",
    sub: "Sleutelpersoon dekking, koop-en-verkoop ooreenkomste en groepvoordele — verduidelik deur 'n geakkrediteerde adviseur.",
    metaTitle: "Besigheidsversekering Kwotasie | LeadBron",
    metaDescription:
      "Kry 'n kwotasie vir besigheidsversekering in Suid-Afrika — sleutelpersoon dekking, groepvoordele en meer. Gratis advies.",
  },
];

export const PROVINSIES_AF: Record<string, string> = {
  "wes-kaap": "Western Cape",
  gauteng: "Gauteng",
  "kwazulu-natal": "KwaZulu-Natal",
  "oos-kaap": "Eastern Cape",
  "vrystaat": "Free State",
  limpopo: "Limpopo",
  mpumalanga: "Mpumalanga",
  "noordwes": "North West",
  "noord-kaap": "Northern Cape",
};

/** Afrikaans label for a province, for display on the page. */
export const PROVINSIE_NAAM: Record<string, string> = {
  "Western Cape": "Wes-Kaap",
  Gauteng: "Gauteng",
  "KwaZulu-Natal": "KwaZulu-Natal",
  "Eastern Cape": "Oos-Kaap",
  "Free State": "Vrystaat",
  Limpopo: "Limpopo",
  Mpumalanga: "Mpumalanga",
  "North West": "Noordwes",
  "Northern Cape": "Noord-Kaap",
};

export function getVerticalAf(slug: string): VerticalAf | undefined {
  return VERTICALS_AF.find((v) => v.slug === slug);
}

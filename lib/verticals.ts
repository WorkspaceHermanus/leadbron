export type Vertical = {
  slug: string;
  name: string;
  consumerHeadline: string;
  consumerSub: string;
  unitPriceCents: number; // price per lead, in cents (ZAR)
};

export const VERTICALS: Vertical[] = [
  {
    slug: "long-term",
    name: "Life cover & long term",
    consumerHeadline: "Life cover quotes, without the runaround",
    consumerSub:
      "Tell us a little about yourself and an accredited financial adviser will call you with options that fit your budget.",
    unitPriceCents: 15000,
  },
  {
    slug: "short-term",
    name: "Short term insurance",
    consumerHeadline: "Pay less for car & home insurance",
    consumerSub:
      "Get a qualified adviser to compare short term cover for you — most people save within the first call.",
    unitPriceCents: 9000,
  },
  {
    slug: "medical-aid",
    name: "Medical aid & gap cover",
    consumerHeadline: "Find a medical aid plan that actually fits",
    consumerSub:
      "An accredited adviser will walk you through plans and gap cover options side by side.",
    unitPriceCents: 11000,
  },
  {
    slug: "wills-trusts",
    name: "Wills & trusts",
    consumerHeadline: "Get your will done properly",
    consumerSub:
      "A qualified adviser will help you set up a will or trust that protects your family.",
    unitPriceCents: 12000,
  },
  {
    slug: "business",
    name: "Business cover",
    consumerHeadline: "Protect your business and its people",
    consumerSub:
      "Key person cover, buy-and-sell agreements and group benefits — explained by an accredited adviser.",
    unitPriceCents: 25000,
  },
];

export const PROVINCES = [
  "Western Cape",
  "Gauteng",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

export function getVertical(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}

export function rand(cents: number): string {
  return "R" + (cents / 100).toFixed(0);
}

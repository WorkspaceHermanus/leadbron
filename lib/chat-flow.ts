// Guided chat flow — a scripted, conversational decision tree.
// Runs fully client-side (zero API cost); the server re-scores answers
// on submit using the same definitions, so the client can't inflate a lead.

export type LeadCategory =
  | "LIFE_INSURANCE"
  | "SHORT_TERM"
  | "MEDICAL_AID"
  | "WILLS_TRUSTS"
  | "BUSINESS"
  | "INVESTMENT"
  | "RETIREMENT"
  | "GENERAL";

export type ChatOption = {
  label: string;
  points?: number; // intent points this answer contributes
  next?: string; // step id to jump to (defaults to the step's `next`)
  category?: LeadCategory; // selecting this option sets/overrides the category
};

export type ChatStep =
  | { id: string; kind: "options"; bot: string; options: ChatOption[]; next?: string }
  | {
      id: string;
      kind: "input";
      bot: string;
      field: "firstName" | "lastName" | "email" | "phone";
      placeholder: string;
      next: string;
    }
  | { id: string; kind: "province"; bot: string; next: string }
  | { id: string; kind: "consent"; bot: string }
  | { id: string; kind: "end"; bot: string };

export type BranchMeta = {
  category: LeadCategory;
  vertical: string; // must match a slug in lib/verticals.ts
  productInterest: string;
};

export const BRANCHES: Record<string, BranchMeta> = {
  life: {
    category: "LIFE_INSURANCE",
    vertical: "long-term",
    productInterest: "Life cover & income protection",
  },
  short: {
    category: "SHORT_TERM",
    vertical: "short-term",
    productInterest: "Car & home insurance",
  },
  medical: {
    category: "MEDICAL_AID",
    vertical: "medical-aid",
    productInterest: "Medical aid & gap cover",
  },
  wills: {
    category: "WILLS_TRUSTS",
    vertical: "wills-trusts",
    productInterest: "Wills, trusts & estate planning",
  },
  business: {
    category: "BUSINESS",
    vertical: "business",
    productInterest: "Business cover & employee benefits",
  },
  invest: {
    category: "INVESTMENT",
    vertical: "long-term",
    productInterest: "Investment & retirement products",
  },
};

// RETIREMENT shares the long-term vertical.
export const CATEGORY_VERTICAL: Record<LeadCategory, string> = {
  LIFE_INSURANCE: "long-term",
  SHORT_TERM: "short-term",
  MEDICAL_AID: "medical-aid",
  WILLS_TRUSTS: "wills-trusts",
  BUSINESS: "business",
  INVESTMENT: "long-term",
  RETIREMENT: "long-term",
  GENERAL: "long-term",
};

export const FLOW: Record<string, ChatStep> = {
  greeting: {
    id: "greeting",
    kind: "options",
    bot: "Hi! 👋 I can arrange for an accredited financial adviser to call you with a quote — no obligation. What can I help you with today?",
    options: [
      { label: "Life cover", next: "life-q1", category: "LIFE_INSURANCE" },
      { label: "Car or home insurance", next: "short-q1", category: "SHORT_TERM" },
      { label: "Medical aid or gap cover", next: "medical-q1", category: "MEDICAL_AID" },
      { label: "A will or estate planning", next: "wills-q1", category: "WILLS_TRUSTS" },
      { label: "Business cover", next: "business-q1", category: "BUSINESS" },
      { label: "Investments or retirement", next: "invest-q1", category: "INVESTMENT" },
      { label: "Just looking around", next: "browsing" },
    ],
  },

  // --- Life cover ---
  "life-q1": {
    id: "life-q1",
    kind: "options",
    bot: "Good choice — life cover is one of the most important policies you can hold. Who are you looking to protect?",
    options: [
      { label: "My spouse & children", points: 20 },
      { label: "Just myself (debts, funeral costs)", points: 10 },
      { label: "Parents or extended family", points: 15 },
    ],
    next: "life-q2",
  },
  "life-q2": {
    id: "life-q2",
    kind: "options",
    bot: "And do you have any life cover at the moment?",
    options: [
      { label: "No, nothing yet", points: 20 },
      { label: "Yes, but I want better value", points: 15 },
      { label: "Not sure what I have", points: 10 },
    ],
    next: "timing",
  },

  // --- Short term ---
  "short-q1": {
    id: "short-q1",
    kind: "options",
    bot: "Let's find you a better premium. What would you like covered?",
    options: [
      { label: "My car", points: 15 },
      { label: "Home & contents", points: 15 },
      { label: "Both", points: 20 },
    ],
    next: "short-q2",
  },
  "short-q2": {
    id: "short-q2",
    kind: "options",
    bot: "Are you insured at the moment?",
    options: [
      { label: "Yes — I want a cheaper quote", points: 20 },
      { label: "No — I need new cover", points: 15 },
    ],
    next: "timing",
  },

  // --- Medical aid ---
  "medical-q1": {
    id: "medical-q1",
    kind: "options",
    bot: "Medical cover is worth getting right. Who needs cover?",
    options: [
      { label: "Just me", points: 15 },
      { label: "Me + my family", points: 20 },
    ],
    next: "medical-q2",
  },
  "medical-q2": {
    id: "medical-q2",
    kind: "options",
    bot: "Do you have medical aid right now?",
    options: [
      { label: "No — I need a plan", points: 20 },
      { label: "Yes — comparing options", points: 15 },
      { label: "Yes — but I need gap cover", points: 20 },
    ],
    next: "timing",
  },

  // --- Wills & trusts ---
  "wills-q1": {
    id: "wills-q1",
    kind: "options",
    bot: "Smart move — most South Africans don't have a valid will. What do you need?",
    options: [
      { label: "A new will", points: 20 },
      { label: "Update an existing will", points: 15 },
      { label: "Set up a trust", points: 20 },
    ],
    next: "wills-q2",
  },
  "wills-q2": {
    id: "wills-q2",
    kind: "options",
    bot: "Do you own property or a business? (It affects how your estate should be structured.)",
    options: [
      { label: "Yes", points: 15 },
      { label: "No", points: 5 },
    ],
    next: "timing",
  },

  // --- Business ---
  "business-q1": {
    id: "business-q1",
    kind: "options",
    bot: "Protecting a business properly takes specialist advice. What are you looking at?",
    options: [
      { label: "Key person cover", points: 20 },
      { label: "Buy-and-sell agreement", points: 20 },
      { label: "Employee benefits / group cover", points: 15 },
      { label: "Not sure — I need advice", points: 10 },
    ],
    next: "business-q2",
  },
  "business-q2": {
    id: "business-q2",
    kind: "options",
    bot: "How many people work in the business?",
    options: [
      { label: "Just me", points: 5 },
      { label: "2–10", points: 15 },
      { label: "11–50", points: 20 },
      { label: "More than 50", points: 20 },
    ],
    next: "timing",
  },

  // --- Investments / retirement ---
  "invest-q1": {
    id: "invest-q1",
    kind: "options",
    bot: "Building wealth starts with a plan. What's the main goal?",
    options: [
      { label: "Saving for retirement", points: 15, category: "RETIREMENT" },
      { label: "Growing long-term wealth", points: 15, category: "INVESTMENT" },
      { label: "Saving for something big (house, education)", points: 10, category: "INVESTMENT" },
    ],
    next: "invest-q2",
  },
  "invest-q2": {
    id: "invest-q2",
    kind: "options",
    bot: "Are you investing already, or starting fresh?",
    options: [
      { label: "Starting fresh", points: 15 },
      { label: "I have investments — want a review", points: 20 },
    ],
    next: "timing",
  },

  // --- Common intent question ---
  timing: {
    id: "timing",
    kind: "options",
    bot: "How soon would you like to get this sorted?",
    options: [
      { label: "As soon as possible", points: 25 },
      { label: "In the next month or two", points: 15 },
      { label: "Just comparing for now", points: 5 },
    ],
    next: "ask-first-name",
  },

  // --- Contact details ---
  "ask-first-name": {
    id: "ask-first-name",
    kind: "input",
    bot: "Great — an accredited adviser can call you with options that fit your budget. What's your first name?",
    field: "firstName",
    placeholder: "First name",
    next: "ask-last-name",
  },
  "ask-last-name": {
    id: "ask-last-name",
    kind: "input",
    bot: "Thanks! And your surname?",
    field: "lastName",
    placeholder: "Surname",
    next: "ask-phone",
  },
  "ask-phone": {
    id: "ask-phone",
    kind: "input",
    bot: "What's the best number for the adviser to call you on?",
    field: "phone",
    placeholder: "e.g. 082 123 4567",
    next: "ask-email",
  },
  "ask-email": {
    id: "ask-email",
    kind: "input",
    bot: "And your email address? (For the adviser to send you the quote.)",
    field: "email",
    placeholder: "you@example.com",
    next: "ask-province",
  },
  "ask-province": {
    id: "ask-province",
    kind: "province",
    bot: "Which province are you in?",
    next: "consent",
  },

  // --- POPIA consent ---
  consent: {
    id: "consent",
    kind: "consent",
    bot: "Last step! Do you agree that your details may be shared with one accredited financial adviser who will contact you about this request? (POPIA consent — we never resell your details.)",
  },

  // --- Terminal steps ---
  done: {
    id: "done",
    kind: "end",
    bot: "You're all set ✓ An accredited adviser will call you shortly — keep your phone nearby!",
  },

  // --- Browsing branch (quality over quantity: no lead is created here) ---
  browsing: {
    id: "browsing",
    kind: "options",
    bot: "No problem at all — browse away! If you'd like, I can still arrange a free, no-obligation call from an adviser. Otherwise I'll be right here if you need me.",
    options: [
      { label: "OK — arrange a call", next: "greeting" },
      { label: "No thanks, just browsing", next: "goodbye" },
    ],
  },
  goodbye: {
    id: "goodbye",
    kind: "end",
    bot: "Enjoy the site! Tap the chat button anytime if you change your mind. 👋",
  },
};

export type Answer = { stepId: string; question: string; answer: string };

/** Look up the points an answer earns. Unknown answers earn 0 — the server
 *  uses this so a tampered payload can't inflate the score. */
export function pointsFor(stepId: string, answerLabel: string): number {
  const step = FLOW[stepId];
  if (!step || step.kind !== "options") return 0;
  return step.options.find((o) => o.label === answerLabel)?.points ?? 0;
}

export function scoreAnswers(answers: Answer[]): {
  points: number;
  intent: "HIGH" | "MEDIUM" | "LOW";
  confidenceScore: number;
} {
  const points = answers.reduce((sum, a) => sum + pointsFor(a.stepId, a.answer), 0);
  const intent = points >= 55 ? "HIGH" : points >= 30 ? "MEDIUM" : "LOW";
  const confidenceScore = Math.max(10, Math.min(95, 30 + points));
  return { points, intent, confidenceScore };
}

/** Adviser-facing one-liner built from the visitor's answers. */
export function buildGoalsSummary(category: LeadCategory, answers: Answer[]): string {
  const qa = answers
    .filter((a) => FLOW[a.stepId]?.kind === "options" && a.stepId !== "greeting")
    .map((a) => {
      // Keep only the actual question (last "...?" sentence), dropping
      // conversational preamble and parentheticals.
      const cleaned = a.question.replace(/\s*\(.*?\)\s*/g, " ").trim();
      const questions = cleaned.match(/[^.!?]+\?/g);
      const q = (questions ? questions[questions.length - 1] : cleaned).trim();
      return `${q} → ${a.answer}`;
    })
    .join("; ");
  const label = category.replace(/_/g, " ").toLowerCase();
  return qa ? `Interested in ${label}. ${qa}.` : `Interested in ${label}.`;
}

export function isValidEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export function isValidSaPhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 9;
}

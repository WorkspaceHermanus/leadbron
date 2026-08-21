/**
 * Generates Google Ads Editor import files.
 *
 * Strategy: never bid on head terms like "life insurance" — those are fought
 * over by every bank and insurer in SA and cost a fortune per click. We bid
 * on long-tail intent phrases, and on Afrikaans, where the same buyer costs
 * a fraction as much because almost nobody competes there.
 *
 * Edit the CAMPAIGNS array below, then: node ads/generate.js
 */
const fs = require("fs");
const path = require("path");

const SITE = "https://leadbron.co.za";
const OUT = path.join(__dirname, "out");

const CAMPAIGNS = [
  {
    name: "LB | AF | Lewensdekking",
    dailyBudget: 60,
    landing: SITE + "/kwotasie/lewensdekking",
    adGroups: [
      {
        name: "Lewensdekking kwotasie",
        keywords: [
          "lewensdekking kwotasie", "lewensdekking kwotasies", "lewensversekering kwotasie",
          "lewensdekking pryse", "lewensversekering suid afrika", "goedkoop lewensdekking",
          "lewensdekking vergelyk", "beste lewensdekking", "lewensdekking aanlyn",
          "hoeveel kos lewensdekking",
        ],
        headlines: [
          "Lewensdekking Kwotasie", "Gratis Kwotasie in Minute", "Beskerm Jou Gesin",
          "Geakkrediteerde Adviseurs", "Geen Verpligting Nie", "Ons Bel Jou Terug",
          "Vergelyk Lewensdekking", "Bekostigbare Dekking", "Kwotasie Vandag Nog",
        ],
        descriptions: [
          "Kry 'n gratis lewensdekking kwotasie. 'n Adviseur bel jou terug met opsies wat pas.",
          "Geen verpligting nie. Vul die vorm in en 'n adviseur kontak jou met pryse vir jou sak.",
          "Ons deel jou besonderhede met slegs een adviseur. Nooit herverkoop nie. POPIA nagekom.",
          "Beskerm jou gesin se toekoms. Praat gratis met 'n gekwalifiseerde adviseur.",
        ],
      },
    ],
  },
  {
    name: "LB | AF | Begrafnisdekking",
    dailyBudget: 50,
    landing: SITE + "/kwotasie/begrafnisdekking",
    adGroups: [
      {
        name: "Begrafnisdekking",
        keywords: [
          "begrafnisdekking", "begrafnisdekking kwotasie", "begrafnispolis",
          "begrafnisversekering", "goedkoop begrafnisdekking", "begrafnisdekking pryse",
          "begrafnisdekking vir ouers", "beste begrafnisdekking", "begrafnisdekking vergelyk",
          "familie begrafnisdekking",
        ],
        headlines: [
          "Begrafnisdekking Kwotasie", "Beskerm Jou Familie", "Gratis Kwotasie",
          "Dekking Vir Die Hele Gesin", "Geen Verpligting Nie", "Ons Bel Jou",
          "Bekostigbare Dekking", "Praat Met 'n Adviseur", "Kwotasie in Minute",
        ],
        descriptions: [
          "Kry 'n gratis begrafnisdekking kwotasie. Ons help jou kies wat by jou familie pas.",
          "Wat kos 'n begrafnis regtig? 'n Adviseur wys jou en help met die regte dekking.",
          "Dek jou ouers en kinders. Gratis advies, geen verpligting, ons bel jou terug.",
          "Een adviseur, nooit herverkoop nie. Jou inligting is beskerm onder POPIA.",
        ],
      },
    ],
  },
  {
    name: "LB | AF | Mediese Fonds",
    dailyBudget: 50,
    landing: SITE + "/kwotasie/mediese-fonds",
    adGroups: [
      {
        name: "Mediese fonds vergelyk",
        keywords: [
          "mediese fonds vergelyk", "mediese fonds kwotasie", "mediese fonds pryse",
          "goedkoop mediese fonds", "beste mediese fonds", "gapingsdekking",
          "gapingsdekking kwotasie", "mediese fonds suid afrika", "mediese fonds opsies",
          "watter mediese fonds is beste",
        ],
        headlines: [
          "Vergelyk Mediese Fondse", "Gratis Kwotasie", "Gapingsdekking Ook",
          "Praat Met 'n Kenner", "Geen Verpligting Nie", "Ons Bel Jou Terug",
          "Kry Die Regte Plan", "Bekostigbare Opsies", "Planne Langs Mekaar",
        ],
        descriptions: [
          "Vergelyk mediese fondse en gapingsdekking. 'n Adviseur verduidelik die verskille.",
          "Te veel planne, te min tyd? Laat 'n adviseur dit uitwerk. Gratis, geen verpligting.",
          "Kry 'n plan wat by jou gesin en begroting pas. Ons bel jou terug wanneer dit pas.",
          "Ons deel jou besonderhede met een adviseur alleen. POPIA nagekom.",
        ],
      },
    ],
  },
  {
    name: "LB | AF | Voertuigversekering",
    dailyBudget: 40,
    landing: SITE + "/kwotasie/voertuigversekering",
    adGroups: [
      {
        name: "Voertuigversekering",
        keywords: [
          "voertuigversekering kwotasie", "motorversekering kwotasie", "goedkoop motorversekering",
          "voertuigversekering vergelyk", "huisversekering kwotasie", "motor en huis versekering",
          "korttermyn versekering kwotasie", "bakkie versekering", "voertuigversekering pryse",
        ],
        headlines: [
          "Voertuigversekering Kwotasie", "Betaal Minder Per Maand", "Gratis Vergelyking",
          "Motor en Huis Saam", "Geen Verpligting Nie", "Ons Bel Jou Terug",
          "Bespaar Op Premies", "Kwotasie in Minute", "Praat Met 'n Adviseur",
        ],
        descriptions: [
          "Betaal jy te veel? Laat 'n adviseur jou motor- en huisversekering gratis vergelyk.",
          "Die meeste mense bespaar binne die eerste oproep. Gratis, geen verpligting.",
          "Een adviseur bel jou terug met beter pryse vir dieselfde of beter dekking.",
          "Jou besonderhede gaan na een adviseur alleen. Nooit herverkoop nie.",
        ],
      },
    ],
  },
  {
    name: "LB | EN | Long-tail Life Cover",
    dailyBudget: 60,
    landing: SITE + "/life-cover-calculator",
    adGroups: [
      {
        name: "How much cover",
        keywords: [
          "how much life cover do i need", "how much life insurance do i need south africa",
          "life cover calculator south africa", "life insurance calculator sa",
          "how much life cover should i have", "calculate life cover needed",
          "life cover amount calculator", "how much cover for my family",
        ],
        headlines: [
          "How Much Cover Do You Need?", "Free Life Cover Calculator", "Get Your Number Fast",
          "See Your Cover Shortfall", "No Signup Required", "Free Adviser Call",
          "Built For South Africans", "Know Your Real Number", "Accredited SA Advisers",
        ],
        descriptions: [
          "Free calculator shows how much life cover you need: income, debts and children.",
          "Most South Africans are underinsured. See your shortfall in 30 seconds. No signup.",
          "Get your number, then a free call with an accredited adviser. No obligation.",
          "Your details go to one adviser only, never resold. POPIA compliant.",
        ],
      },
    ],
  },
  {
    name: "LB | EN | Medical Aid",
    dailyBudget: 40,
    landing: SITE + "/quote/medical-aid",
    adGroups: [
      {
        name: "Medical aid comparison",
        keywords: [
          "compare medical aid south africa", "medical aid quotes south africa",
          "cheapest medical aid south africa", "gap cover quotes", "medical aid comparison",
          "which medical aid is best", "affordable medical aid sa", "medical aid broker near me",
        ],
        headlines: [
          "Compare Medical Aid Plans", "Free Quote, No Obligation", "Gap Cover Too",
          "Accredited SA Advisers", "Plans Side By Side", "We Call You Back",
          "Find A Plan That Fits", "Free Expert Advice", "Save On Premiums",
        ],
        descriptions: [
          "Compare medical aid and gap cover with an accredited adviser. Free, no obligation.",
          "Too many plans, too little time? An adviser walks you through the options.",
          "Your details go to one adviser only, never resold. POPIA compliant consent.",
          "Get a plan that actually fits your family. We call you back when it suits you.",
        ],
      },
    ],
  },
];

/**
 * Insurance search is full of people who will never buy: job seekers,
 * students, and existing customers chasing claims. Every term blocked
 * here is budget kept.
 */
const NEGATIVES = [
  // jobs and careers
  "job", "jobs", "vacancy", "vacancies", "career", "careers", "salary", "hiring",
  "learnership", "internship", "recruitment", "werk", "werksgeleenthede", "poste",
  // studying / becoming a broker
  "course", "courses", "study", "qualification", "become a broker", "how to become",
  "training", "diploma", "degree", "exam", "kursus", "studeer",
  // existing customers wanting service, not cover
  "claim", "claims", "cancel", "cancellation", "complaint", "complaints", "login",
  "log in", "contact number", "call centre", "ombudsman", "eis", "kanselleer", "klagte",
  // pure research intent
  "template", "pdf", "meaning", "definition", "wikipedia",
  "what is", "wat is", "difference between", "verskil tussen",
  // products we do not sell
  "pet insurance", "travel insurance", "cellphone insurance", "phone insurance",
  "warranty", "extended warranty", "crypto", "loan", "lening", "personal loan",
  // outside South Africa
  "usa", "uk", "australia", "canada", "india", "nigeria", "kenya", "zimbabwe",
  // competitor self-service
  "discovery login", "momentum login", "sanlam login", "old mutual login",
];

const esc = (v) => {
  const s = String(v == null ? "" : v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const toCsv = (rows) => rows.map((r) => r.map(esc).join(",")).join("\r\n");

/** ValueTrack params so the keyword and ad that produced a lead reach our DB. */
function trackedUrl(base) {
  return (
    base +
    "?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}" +
    "&utm_term={keyword}&utm_content={creative}"
  );
}

fs.mkdirSync(OUT, { recursive: true });

// 1. Campaigns — start Paused so nothing spends before you have checked it.
const campaignRows = [
  ["Campaign", "Campaign Daily Budget", "Campaign Type", "Networks", "Languages",
   "Location", "Bid Strategy Type", "Campaign Status"],
];
for (const c of CAMPAIGNS) {
  campaignRows.push([c.name, c.dailyBudget, "Search", "Google search",
    "English;Afrikaans", "South Africa", "Maximize conversions", "Paused"]);
}
fs.writeFileSync(path.join(OUT, "1-campaigns.csv"), toCsv(campaignRows));

// 2. Ad groups
const adGroupRows = [["Campaign", "Ad Group", "Max CPC", "Ad Group Status"]];
for (const c of CAMPAIGNS) {
  for (const g of c.adGroups) adGroupRows.push([c.name, g.name, 12, "Enabled"]);
}
fs.writeFileSync(path.join(OUT, "2-ad-groups.csv"), toCsv(adGroupRows));

// 3. Keywords — phrase and exact only. Broad match drains budget on rubbish.
const kwRows = [["Campaign", "Ad Group", "Keyword", "Match Type", "Status"]];
let kwCount = 0;
for (const c of CAMPAIGNS) {
  for (const g of c.adGroups) {
    for (const k of g.keywords) {
      kwRows.push([c.name, g.name, k, "Phrase", "Enabled"]);
      kwRows.push([c.name, g.name, k, "Exact", "Enabled"]);
      kwCount += 2;
    }
  }
}
fs.writeFileSync(path.join(OUT, "3-keywords.csv"), toCsv(kwRows));

// 4. Responsive search ads
const adHeader = ["Campaign", "Ad Group", "Ad Type", "Final URL", "Path 1", "Path 2"];
for (let i = 1; i <= 9; i++) adHeader.push("Headline " + i);
for (let i = 1; i <= 4; i++) adHeader.push("Description " + i);
adHeader.push("Status");
const adRows = [adHeader];
for (const c of CAMPAIGNS) {
  for (const g of c.adGroups) {
    const row = [c.name, g.name, "Responsive search ad", trackedUrl(c.landing), "kwotasie", "gratis"];
    for (let i = 0; i < 9; i++) row.push(g.headlines[i] || "");
    for (let i = 0; i < 4; i++) row.push(g.descriptions[i] || "");
    row.push("Enabled");
    adRows.push(row);
  }
}
fs.writeFileSync(path.join(OUT, "4-ads.csv"), toCsv(adRows));

// 5. Negative keywords
const negRows = [["Campaign", "Keyword", "Match Type", "Status"]];
for (const c of CAMPAIGNS) {
  for (const n of NEGATIVES) negRows.push([c.name, n, "Phrase", "Enabled"]);
}
fs.writeFileSync(path.join(OUT, "5-negative-keywords.csv"), toCsv(negRows));

// 6. Sitelinks — free extra space on the results page, lifts click-through.
const sitelinks = [
  ["Gratis Kwotasie", "Geen verpligting nie", "Ons bel jou terug", SITE + "/kwotasie/lewensdekking"],
  ["Dekking Sakrekenaar", "Hoeveel dekking is genoeg?", "Kry jou syfer gratis", SITE + "/life-cover-calculator"],
  ["Mediese Fonds", "Vergelyk planne langs mekaar", "Gratis advies", SITE + "/kwotasie/mediese-fonds"],
  ["Begrafnisdekking", "Beskerm jou hele gesin", "Bekostigbare opsies", SITE + "/kwotasie/begrafnisdekking"],
];
const slRows = [["Campaign", "Link Text", "Description Line 1", "Description Line 2", "Final URL"]];
for (const c of CAMPAIGNS) {
  for (const s of sitelinks) slRows.push([c.name, s[0], s[1], s[2], s[3]]);
}
fs.writeFileSync(path.join(OUT, "6-sitelinks.csv"), toCsv(slRows));

console.log("Google Ads import files written to ads/out/");
console.log("  campaigns: " + CAMPAIGNS.length);
console.log("  ad groups: " + CAMPAIGNS.reduce((n, c) => n + c.adGroups.length, 0));
console.log("  keywords:  " + kwCount + " (phrase + exact)");
console.log("  negatives: " + NEGATIVES.length + " per campaign");
console.log("  daily budget if ALL enabled: R" + CAMPAIGNS.reduce((n, c) => n + c.dailyBudget, 0));

// Google rejects over-length ad copy on import, so fail loudly here instead.
let problems = 0;
for (const c of CAMPAIGNS) {
  for (const g of c.adGroups) {
    g.headlines.forEach((h) => {
      if (h.length > 30) { console.error("  HEADLINE " + h.length + "/30: " + h); problems++; }
    });
    g.descriptions.forEach((d) => {
      if (d.length > 90) { console.error("  DESCRIPTION " + d.length + "/90: " + d); problems++; }
    });
  }
}
console.log(problems === 0
  ? "  ad copy: all within Google's character limits"
  : "  ad copy: " + problems + " item(s) OVER LIMIT — fix before importing");

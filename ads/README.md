# Google Ads — setup runbook

Everything technical is built. This is the part only you can do, in order.
Budget for the first test: **R2,500 over 14 days.**

---

## Step 1 — Create the Google Ads account (15 min)

1. Go to [ads.google.com](https://ads.google.com) and sign in with your Google account.
2. When it pushes you into the "Smart campaign" wizard, look for
   **"Switch to Expert Mode"** — a small link near the bottom. Click it.
   Smart campaigns hide the controls we need.
3. Choose **Create a campaign without a goal's guidance** if prompted.
4. Set: Country **South Africa**, Currency **ZAR**, Timezone **Africa/Johannesburg**.
   **Currency and timezone can never be changed afterwards.** Get them right.
5. Add billing. Check for a spend-matching promo first (often "spend R400,
   get R1,200") — it is applied at signup, not retroactively.

---

## Step 2 — Create the conversion action (10 min)

This is the most important step. Without it Google optimises for clicks
instead of leads, and the budget is wasted.

1. **Goals → Conversions → New conversion action → Website**
2. Enter `leadbron.co.za`, then choose **Add manually**.
3. Configure:
   - Goal category: **Submit lead form**
   - Conversion name: `Lead Form Submit`
   - Value: **Use the same value for each** → `150` ZAR
   - Count: **One** (a person requesting two quotes is still one lead)
   - Click-through window: 30 days
4. Choose **Use Google tag** → it shows a **Conversion ID** (`AW-XXXXXXXXX`)
   and a **Conversion label** (a short random string).
5. Put both into Vercel (Project → Settings → Environment Variables):

```bash
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=your_label_here
```

6. **Redeploy** — `NEXT_PUBLIC_` variables are baked in at build time, so the
   tag will not appear until you do.
7. Verify: open the site, submit a test lead, then check
   **Goals → Conversions** — status should move to "Recording conversions"
   within a few hours.

---

## Step 3 — Import the campaigns (20 min)

1. Download **Google Ads Editor** (free desktop app) and sign in.
2. **Account → Import → From file**, and import these in order:

| Order | File | What it creates |
|---|---|---|
| 1 | `out/1-campaigns.csv` | 6 campaigns, all **Paused** |
| 2 | `out/2-ad-groups.csv` | 6 ad groups |
| 3 | `out/3-keywords.csv` | 110 keywords (phrase + exact) |
| 4 | `out/4-ads.csv` | 6 responsive search ads |
| 5 | `out/5-negative-keywords.csv` | 71 negatives per campaign |
| 6 | `out/6-sitelinks.csv` | Sitelink extensions |

3. Review, then **Post** to push it live.
4. Campaigns import **paused on purpose**. Nothing spends until you enable them.

To change keywords or ad copy: edit `generate.js`, run `node ads/generate.js`,
re-import.

---

## Step 4 — Start small (the actual test)

**Do not enable all six campaigns.** R300/day would burn R2,500 in eight days
before you have learned anything.

Week 1 — enable **two only**:

- `LB | AF | Lewensdekking` — set daily budget to **R80**
- `LB | AF | Begrafnisdekking` — set daily budget to **R80**

That is R160/day ≈ R1,120 for the week. Afrikaans first because the clicks
are far cheaper, so the same money buys more data.

Week 2 — based on results, either scale the winner or switch on
`LB | EN | Long-tail Life Cover`.

---

## Step 5 — What to check, and when

**Do not touch anything for the first 3 days.** The algorithm needs data, and
early numbers are noise. Changing bids daily is the most common way people
waste money.

**Day 4 and day 8**, check two reports:

1. **Search terms report** (Keywords → Search terms) — the actual phrases
   people typed. Anything irrelevant, add as a negative. This is where most
   of the savings are.
2. **`/admin?token=...`** on your own site → *"Paid keywords producing leads"* —
   which keywords produced real leads, not just clicks.

Rules of thumb:
- Keyword spent > R300 with 0 leads → pause it.
- Keyword produced 2+ leads → raise its bid.
- Search term irrelevant → add as negative immediately.

---

## Step 6 — Feed sales back to Google (the compounding step)

Form fills are a weak target — Google will happily find a thousand people who
fill in forms and never buy. Telling it which leads became **real business**
is what drives cost per acquisition down over time. Most small advertisers
never do this; it is the single biggest edge available to you.

When Divan closes a lead:

```bash
curl -X POST "https://leadbron.co.za/api/admin/offline-conversions?token=ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"leadId":"THE_LEAD_ID","saleValueRands":4500}'
```

Then once a week:

1. Download the file:
   `https://leadbron.co.za/api/admin/offline-conversions?token=ADMIN_TOKEN`
2. Google Ads → **Goals → Conversions → Import → Upload a file**
3. Mark them as sent so they are not uploaded twice:

```bash
curl -X POST "https://leadbron.co.za/api/admin/offline-conversions?token=ADMIN_TOKEN" \
  -H "Content-Type: application/json" -d '{"markUploaded":true}'
```

---

## Kill criteria — agree these with Divan **before** spending

Write the numbers down now, while you are unemotional about it.

- **Stop** if after R2,500 the cost per lead is more than a lead is worth to you.
- **Stop** if leads arrive but none are contactable — that is a lead-quality
  problem, and more budget makes it worse, not better.
- **Continue** only if cost per lead is comfortably below what Divan earns
  from closing one.

The trap is "just two more weeks". Decide the number in advance and hold to it.

---

## Honest expectations

- **Weeks 1–2:** performance is poor while the algorithm learns. This is
  normal and not a reason to panic or to change everything daily.
- **Realistic:** R2,500 buys roughly 150–350 clicks on these long-tail and
  Afrikaans terms. At a 10–15% landing page conversion rate, that is
  **15–50 leads**.
- **The point of this spend is not profit — it is the answer to "does this
  business work?"** Cost per lead, lead quality, and whether Divan can close
  them. That answer is worth far more than the R2,500.

I cannot promise these numbers. Real CPCs and conversion rates vary, and the
only way to know yours is to run it.

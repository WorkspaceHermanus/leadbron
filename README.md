# LeadBron — automated lead marketplace (South Africa)

A two-sided lead platform built for Vercel:

- **Consumers** land on `/quote/<vertical>` campaign pages (from your ads) and
  submit their details with explicit, timestamped **POPIA consent**.
- **Advisers** order leads on `/buy`, pay with **PayFast**, and the platform
  **automatically** emails them their leads as a CSV the moment payment is
  confirmed. If stock runs short, the balance is delivered automatically as new
  leads arrive (oldest order first). No manual work in the loop.
- **You** watch everything at `/admin?token=...`.

Verticals and per-lead prices live in `lib/verticals.ts` — edit one file to
change the catalogue. To rename the brand, search-and-replace "LeadBron".

---

## 1. Local setup

```bash
npm install
cp .env.example .env        # fill in the values (see below)
npm run db:push             # creates the tables
npm run dev
```

## 2. Services you need (all have free tiers)

| Service | Why | Env vars |
|---|---|---|
| **Neon** (or Vercel Postgres) | Database | `DATABASE_URL` |
| **PayFast** | Payments (sandbox works out of the box) | `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`, `PAYFAST_MODE` |
| **Resend** | Emails the CSVs to advisers | `RESEND_API_KEY`, `MAIL_FROM` |

Also set `APP_URL` (your deployed URL) and `ADMIN_TOKEN` (any long random string).

The `.env.example` ships with PayFast's public **sandbox** merchant details, so
you can test the full flow — order, pay with a sandbox card, receive leads —
without a real PayFast account.

## 3. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Then in the Vercel dashboard:

1. Add all env vars from `.env` (Project → Settings → Environment Variables).
2. Set `APP_URL` to your real Vercel URL — PayFast needs it for the webhook.
3. Redeploy. Run `npx prisma db push` once against your production
   `DATABASE_URL` to create the tables.

## 4. Going live with PayFast

1. Register at payfast.co.za, complete their verification.
2. Swap in your live `merchant_id`, `merchant_key`, set a **passphrase** in
   your PayFast dashboard and in `PAYFAST_PASSPHRASE`.
3. Set `PAYFAST_MODE="live"`.
4. Place a real R-something test order and confirm the CSV arrives.

## 5. How the automation works

```
Consumer submits /quote form
        │  stored with consentAt + consentIp, status AVAILABLE
        ▼
   [drip-fill check] ──── oldest PAID/PARTIAL order in that vertical gets it instantly
        
Adviser pays on /buy ──► PayFast ──► /api/payfast/itn (signature + server validation + amount check)
        │ order marked PAID
        ▼
   fulfilOrder(): allocate AVAILABLE leads → mark SOLD → email CSV → order FULFILLED/PARTIAL
```

Leads are sold **once** (exclusive) and a duplicate phone number in the same
vertical within 30 days is silently ignored.

## 6. What the code does NOT do for you (read this)

- **Traffic.** The `/quote` pages convert visitors into leads, but you must
  send visitors there: Meta/Google ads or SEO. This is the actual business and
  the actual cost.
- **Buyers.** Advisers won't find `/buy` on their own at first — outreach is on you.
- **Discovery vetting.** That's an application process with Discovery, not a
  feature. The consent timestamps + IPs stored here are exactly the kind of
  audit trail they'll want to see.
- **POPIA beyond consent capture.** You're the "responsible party" in POPIA
  terms. Keep a privacy policy, honour deletion requests, and don't import
  bought/scraped data into this database — that defeats the whole model.
- **Refund handling.** Disputes ("this number doesn't answer") are manual by design.

## 7. Useful URLs

- `/` — adviser-facing home with live lead ticker
- `/quote` and `/quote/long-term` etc. — consumer capture pages (point your ads here, add `?utm_source=meta` to track)
- `/buy` — order + PayFast checkout
- `/buy/thanks` — return page
- `/admin?token=ADMIN_TOKEN` — operations dashboard
- `POST /api/payfast/itn` — PayFast webhook (configured automatically per order)

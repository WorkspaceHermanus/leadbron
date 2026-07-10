# LeadBron Guided Chat — Lead Qualification Widget

A **zero-cost** conversational lead-qualification widget. No AI API keys, no
per-message fees, no rate limits — the "conversation" is a carefully scripted
decision tree that runs in the visitor's browser and feels like chat.

## How it works

1. A visitor lands on any page. After 20 seconds (or once they scroll), a 💬
   button appears bottom-right.
2. Opening it starts a guided conversation: the assistant asks what they need
   (life cover, car/home, medical aid, wills, business, investments) with
   tap-to-answer buttons, then 2–3 qualifying questions for that product, then
   a timing question that measures intent.
3. It collects name, phone, email and province with validated inputs, then
   asks for explicit **POPIA consent**.
4. On consent, the browser posts everything to `POST /api/chat/qualify`, which:
   - **Re-scores the answers server-side** against the same flow definition
     (a tampered payload can't inflate a lead's score)
   - Validates contact details with the same rules as the quote form
   - Applies the same 30-day phone+vertical duplicate guard
   - Creates a `Conversation` (full transcript), a `QualifiedLead`
     (category, intent, confidence, goals summary) and a marketplace `Lead`
   - Triggers `dripFill()` so a waiting adviser gets the lead immediately
5. The adviser's CSV email now includes a `conversation` column with the full
   transcript — rich context for the follow-up call.

**Quality over quantity**: visitors who choose "Just looking around" and
decline a call create **no lead at all**. Intent is scored from answers
(HIGH / MEDIUM / LOW) and stored on every qualified lead.

## Where things live

| What | File |
|---|---|
| Flow definition, scoring, category mapping | `lib/chat-flow.ts` |
| Chat UI (bubbles, buttons, inputs, consent) | `app/components/ChatInterface.tsx` |
| Floating button + open/close + visitor id | `app/components/ChatWidget.tsx` |
| Lead creation endpoint | `app/api/chat/qualify/route.ts` |
| CSV email (incl. transcript column) | `lib/fulfil.ts` |
| DB models (`Conversation`, `QualifiedLead`) | `prisma/schema.prisma` |
| Admin table ("AI Qualified Leads") | `app/admin/page.tsx` |

## Editing the conversation

Everything is data in `lib/chat-flow.ts`:

- **Add/change questions**: edit the `FLOW` map. Each option can carry
  `points` (intent), `next` (which step follows) and `category`.
- **Change scoring**: `scoreAnswers()` — currently ≥55 points = HIGH,
  ≥30 = MEDIUM, else LOW; confidence = 30 + points (capped 10–95).
- **Add a product branch**: add a branch's steps, wire it from `greeting`,
  and map its category in `CATEGORY_VERTICAL`.

No deploy-time config needed — the widget ships with the site.

## Lead categories → marketplace verticals

| Chat category | Marketplace vertical |
|---|---|
| LIFE_INSURANCE, INVESTMENT, RETIREMENT, GENERAL | `long-term` |
| SHORT_TERM | `short-term` |
| MEDICAL_AID | `medical-aid` |
| WILLS_TRUSTS | `wills-trusts` |
| BUSINESS | `business` |

## Monitoring

- `/admin?token=...` → **AI Qualified Leads** table: category, confidence,
  intent, qualified/disqualified.
- Prisma Studio (`npx prisma studio`): browse `Conversation`,
  `QualifiedLead`, `Lead`.

## Running costs

R0. The widget is static code; the only infrastructure is what the site
already uses (Vercel free tier, Neon free tier, Gmail SMTP).

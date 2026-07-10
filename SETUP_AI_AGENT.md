# LeadBron AI Agent Setup Guide

## Phase 1: Foundation ✅ COMPLETE

You now have a fully functional AI-powered lead qualification system integrated into LeadBron!

### What's Been Built

**Backend**
- ✅ Extended Prisma database schema with `Conversation` and `QualifiedLead` models
- ✅ Extended `Lead` model to store AI-collected data
- ✅ Claude API integration (`lib/claude.ts`)
- ✅ AI system prompts and templates (`lib/ai-prompts.ts`)
- ✅ `/api/chat/message` endpoint for conversation
- ✅ `/api/chat/qualify` endpoint for lead qualification
- ✅ Automatic lead creation when AI-qualified leads opt in
- ✅ Automatic drip-fill integration with existing lead delivery system

**Frontend**
- ✅ `ChatWidget` component (floating chat button, appears after 30s or scroll)
- ✅ `ChatInterface` component (chat messages, input, qualification prompt)
- ✅ Global chat widget embedded in layout (visible on all pages)
- ✅ Styled to match LeadBron design system (brass colors, typography)

**Admin Dashboard**
- ✅ New "AI Qualified Leads" table in `/admin?token=...`
- ✅ Shows lead source, confidence score, category, intent level

### How It Works (User Flow)

1. **Visitor lands on any page** (homepage, quote pages, etc.)
2. **After 30 seconds or scroll**, a 💬 chat button appears (bottom-right)
3. **Visitor clicks → Chat opens** with initial greeting from AI advisor
4. **Natural conversation** about financial needs (insurance, investments, etc.)
5. **AI continuously assesses**:
   - Intent level (HIGH/MEDIUM/LOW)
   - Product category (Life Insurance, Medical Aid, etc.)
   - Lead quality (confidence score 0-100)
   - Contact information (name, email, phone, province)
6. **After 4+ messages**, a qualification prompt appears:
   - "Would you like an accredited adviser to contact you?"
   - Two buttons: "Yes, contact me" / "Not now"
7. **If YES → Automatic lead creation**:
   - QualifiedLead entry created with full conversation transcript
   - Lead entry created in marketplace
   - Auto-linked to adviser waiting in that vertical (existing dripFill automation)
   - Adviser receives CSV email with lead details + conversation

### Environment Setup

Before testing, configure your `.env` file:

```bash
# Existing settings (from README)
DATABASE_URL="your-postgres-url"
PAYFAST_MERCHANT_ID="..."
PAYFAST_MERCHANT_KEY="..."
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
APP_URL="http://localhost:3000"
ADMIN_TOKEN="your-long-random-token"

# NEW: AI Agent Configuration
ANTHROPIC_API_KEY="sk-ant-YOUR_KEY_HERE"  # Get from https://console.anthropic.com
CLAUDE_MODEL="claude-3-5-sonnet-20241022"
```

### Getting Your Anthropic API Key

1. Visit https://console.anthropic.com
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the key and paste into `.env` as `ANTHROPIC_API_KEY`
6. Save

### Testing Locally

```bash
# Install dependencies (if not done)
npm install

# Ensure database is set up
npx prisma db push

# Start dev server
npm run dev
```

Then:
1. Open http://localhost:3000
2. Wait 30 seconds or scroll down
3. Click the 💬 button
4. Test the conversation:
   - "I want to protect my family with life insurance"
   - "I'm 35 years old with 2 kids"
   - "My income is around R500k/year"
   - "Yes, I'd like an adviser to contact me"

### Checking Your Leads

**In Admin Dashboard**:
```
http://localhost:3000/admin?token=YOUR_ADMIN_TOKEN
```
You'll see a new "AI Qualified Leads" table showing:
- When the lead was qualified
- Name, phone
- Category (LIFE_INSURANCE, SHORT_TERM, etc.)
- Confidence score
- Intent (HIGH/MEDIUM/LOW)
- Status (Qualified or Disqualified)

**In Database** (via Prisma Studio):
```bash
npx prisma studio
```
Browse:
- `Conversation` — full chat histories
- `QualifiedLead` — extracted lead data + transcript
- `Lead` — auto-created leads ready for advisers

### What Makes a Good Lead?

The AI qualifies based on:
- ✅ Provided contact info (name, email, phone)
- ✅ Clear financial need expressed
- ✅ Engaged meaningfully (not one-word answers)
- ✅ Showed interest in Discovery products
- ✅ Gave explicit consent (POPIA compliance)

### What Disqualifies a Lead?

- "Just browsing" / "Not interested"
- Already has comprehensive coverage
- Vague after 5+ exchanges
- Spam/bot-like behavior
- Incomplete contact info after conversation

### Conversation Transcript in Adviser CSV

When an adviser purchases a qualified lead, the CSV email now includes:
- Standard fields: name, email, phone, province, consent timestamp
- NEW: Full conversation transcript showing:
  - What the lead asked
  - What the AI advisor said
  - Financial goals discussed
  - Products of interest
  - Confidence score and intent level

This gives advisers rich context for follow-up.

---

## Phase 2: Qualification Logic 🚀 NEXT

Once you've tested Phase 1, Phase 2 will enhance:
- [ ] Refine disqualification triggers based on real conversations
- [ ] Add category detection confidence scoring
- [ ] Build conversation analytics dashboard
- [ ] A/B test different opening messages
- [ ] Optimize timing (30s trigger, qualification prompt timing)
- [ ] Add conversation quality metrics

### What to Monitor

1. **Conversation completion rate**: % of chats that reach qualification
2. **Lead quality**: % of AI-qualified leads that advisers call
3. **Category accuracy**: How often AI picks correct product category
4. **Confidence distribution**: Are scores realistic?
5. **Abandonment points**: Where do visitors drop off?

### Tuning the System

Edit `lib/ai-prompts.ts` to:
- Change greeting message
- Adjust qualification criteria
- Modify category definitions
- Add new Discovery products

---

## Phase 3: UI & Integration 🎨

- [ ] Mobile UI refinements (chat on small screens)
- [ ] Animation polish
- [ ] Conversation history persistence (option to resume)
- [ ] Multi-language support (Afrikaans?)
- [ ] Pre-filled form suggestions
- [ ] Integration with existing quote forms (auto-detect vertical)

---

## Phase 4: Admin & Monitoring 📊

- [ ] Advanced filtering (date range, category, confidence threshold)
- [ ] Adviser feedback loop (did they call? convert?)
- [ ] Conversation export (for analysis/training)
- [ ] Lead quality scoring over time
- [ ] Spam detection improvements
- [ ] Conversation quality audit trail

---

## Phase 5: Optimization 🔧

- [ ] Machine learning on conversation success rates
- [ ] Dynamic prompt adjustment
- [ ] Intent prediction from first message
- [ ] Category pre-detection before chat
- [ ] Sentiment analysis
- [ ] Lead scoring model

---

## Troubleshooting

### Chat Widget Doesn't Appear
- Check browser console (F12) for errors
- Verify ChatWidget is imported in `app/layout.tsx`
- Clear browser cache
- Check sessionStorage: should see `leadbron_visitor_id`

### Messages Not Sending
- Check `.env` — `ANTHROPIC_API_KEY` must be set
- Check browser console for fetch errors
- Verify `/api/chat/message` endpoint is working (POST request)
- Check Anthropic API status (https://status.anthropic.com)

### No Qualified Leads Appearing
- Check conversation has 4+ exchanges
- Verify lead has name, email, phone provided
- Check `Conversation` table in Prisma Studio
- Look for errors in server logs (`npm run dev` output)

### Database Errors
- Run `npx prisma db push` to sync schema
- Check `DATABASE_URL` in `.env`
- Verify Neon/Vercel Postgres connection

---

## Architecture Reference

```
┌─────────────────────────────┐
│  Website (HTML + React)     │
│  ┌─────────────────────┐    │
│  │  ChatWidget         │    │
│  │  (visible after 30s)│    │
│  └──────────┬──────────┘    │
└─────────────┼────────────────┘
              │ POST /api/chat/message
              ▼
       ┌──────────────┐
       │  Claude API  │
       │  (via Node)  │
       └──────┬───────┘
              │ Extract structure
              ▼
       ┌──────────────────┐
       │ POST /api/chat/  │
       │ qualify endpoint │
       └────────┬─────────┘
                │ Creates:
        ┌───────┴───────┐
        ▼               ▼
    QualifiedLead    Lead (auto-created)
        │               │
        └───────┬───────┘
                │ Triggers dripFill
                ▼
           Adviser receives CSV
           (includes transcript)
```

---

## Cost Considerations

**Claude API Pricing** (per message):
- Input: $0.003 per 1K tokens
- Output: $0.015 per 1K tokens

**Estimate for 500 monthly visitors**:
- ~60% engage with chat (300 chats)
- ~5 messages per conversation (1,500 messages total)
- ~150 tokens average per message
- **Monthly cost: ~$5-10**

This is incredibly affordable for lead generation.

---

## Next Steps

1. **Test Phase 1** locally or on Vercel
2. **Set ANTHROPIC_API_KEY** in production
3. **Monitor** real conversations via admin dashboard
4. **Iterate** on system prompt based on conversation quality
5. **Measure** lead quality, adviser feedback
6. **Plan Phase 2** based on initial metrics

---

## Support

- Anthropic Claude API docs: https://docs.anthropic.com
- LeadBron README: See main repo README.md
- Issues or questions: Check app/api/chat logs for API errors

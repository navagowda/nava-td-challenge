# NAVA — Local Setup & Project Status

## 1. Run it locally to check everything yourself

```bash
git clone https://github.com/<you>/<your-repo>.git
cd <your-repo>
npm install
```

Create a file named `.env.local` in the project root (never commit this) with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
MT5_WEBHOOK_SECRET=any-long-random-string
```

These are the **only 4 env vars the app actually reads** — confirmed by grepping the whole codebase, not guessed.

```bash
npm run dev
```

Open `http://localhost:3000`. If the Supabase URL/keys are wrong or missing, the app will still start, but `/login` and any page hitting `/api/trades` will error — that's expected and tells you the env vars need fixing, not a code bug.

### Manual test checklist
- [ ] `/` loads (landing page — no login needed)
- [ ] `/login` — log in with the user you created in Supabase Auth
- [ ] `/dashboard` — loads without redirecting you back to `/login`
- [ ] `/journal` — add a trade, check the checklist animates and % updates, confetti fires, trade appears in the list below
- [ ] `/challenge` — the trade you just added shows as a colored tile
- [ ] `/risk` — pip/lot calculators compute without errors
- [ ] `/chart` — TradingView widget loads (needs real internet, won't work fully offline)
- [ ] Resize the browser to phone width — hamburger menu appears, no horizontal scroll
- [ ] Log out, confirm `/dashboard` redirects you to `/login`

If all of those pass locally, `npm run build` will pass on Vercel too — I already ran that exact build command against this codebase before sending you anything, so this is a second, independent check on your end.

---

## 2. Full analysis — what's real vs what's still placeholder

| Page | Data source | Status |
|---|---|---|
| Landing (`/`) | Static | ✅ Complete |
| Login (`/login`) | Supabase Auth | ✅ Real |
| Dashboard (`/dashboard`) | `lib/mockData.ts` | ⚠️ **Mock data** — balance/P&L/win-rate numbers are fake |
| Trade Journal (`/journal`) | Supabase `trades` table | ✅ Real — add/edit/delete all persist |
| 50-Trade Challenge (`/challenge`) | Supabase `trades` table | ✅ Real — derived live from your first 50 trades |
| Risk tools (`/risk`) | Calculators only, no stored data | ✅ Real (nothing to fake — they're pure calculators) |
| Analytics (`/analytics`) | `lib/mockData.ts` | ⚠️ **Mock data** — pair/session/strategy performance charts are fake |
| Strategy Vault (`/vault`) | `lib/mockData.ts` | ⚠️ **Mock data** — static list, not editable yet |
| Reports (`/reports`) | `lib/mockData.ts` | ⚠️ **Mock data** — export buttons are UI-only, don't export yet |
| Settings (`/settings`) | `localStorage` | ✅ Real, but device-local only (not synced via Supabase yet) |

**Why Dashboard/Analytics/Reports/Vault are still mock:** we deliberately migrated the Trade Journal to Supabase first since that's the highest-value, write-heavy data. Wiring the remaining pages to read real trades from Supabase instead of `mockData.ts` is a well-scoped next step — say the word and I'll do it.

## 3. Integrations status

| Integration | Status |
|---|---|
| Supabase Auth (login) | ✅ Live, server-verified via middleware |
| Supabase `trades` table | ✅ Live |
| MT5 → webhook → Supabase | ✅ Code complete — depends on you having attached `NavaSync.mq5` in your terminal and set matching secrets |
| GitHub-as-database | ❌ Removed/replaced by Supabase (delete `src/lib/githubDb.ts` and `src/lib/auth.ts` from your repo if you haven't already) |
| AI Trading Coach | ❌ Not built yet |
| Screenshot Gallery | ❌ Not built yet — screenshots currently only save a filename, not the image |
| PDF/Excel/JSON export | ❌ Not built yet — buttons exist but are non-functional |
| Trading Rules page | ❌ Not built yet |
| Lessons/Emotion journal | ❌ Not built yet |

## 4. Known limitations worth remembering
- Session tagging (London/NY/Asia) from MT5 syncs is an approximate UTC-hour guess, not broker-timezone-exact.
- Risk % isn't auto-calculated from MT5 syncs — MT5 has no concept of your intended risk.
- Pip value assumptions in the lot-size calculator assume a USD account currency.

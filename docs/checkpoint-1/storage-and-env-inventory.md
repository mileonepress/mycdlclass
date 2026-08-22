# Checkpoint 1 — Storage & Environment Inventory

**Method:** Inspection of application code and the project environment-variable names (names only — no secret values were read, printed, or logged). No changes applied.

---

## 1. eBook storage (current)

| Asset | Provider | Location | Access | Served via |
|---|---|---|---|---|
| eBook **PDFs** | Vercel Blob | `ebooks/<slug>.pdf` | **private** | `/api/ebooks/download` → streamed after token check (blob URL never exposed) |
| eBook **covers** | Static files | `public/ebooks/covers/*.png` | public | Direct static path |
| eBook **catalog metadata** | Hardcoded JS | `lib/ebookProducts.js` (18 entries) | n/a | Imported at build/runtime |

- No AWS S3, no external IPs, no legacy API endpoints are referenced in application code.
- The private-PDF + streamed-download model is sound and should be retained. Recommended go-forward hardening: move the download gate from token-only to **entitlement-based** (`ebook_entitlements`, proposed migration `0002`).

**Owner decision still required:** keep Vercel Blob (private) for go-forward PDFs, or migrate to Supabase Storage private buckets. Covers can stay public either way.

---

## 2. Supabase projects — TWO distinct projects detected

This is an important finding for the content dashboard work.

| Project | Env var prefix | Role in app |
|---|---|---|
| **Primary (courses)** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | The connected project `aibndllvunylmxborsad`; holds the 9-course normalized catalog. All Checkpoint 1 introspection targeted this project. |
| **Secondary (`ebooksformileonepress`)** | `ebooksformileonepress_SUPABASE_URL`, `ebooksformileonepress_SUPABASE_ANON_KEY`, `ebooksformileonepress_SUPABASE_SERVICE_ROLE_KEY`, `ebooksformileonepress_POSTGRES_*`, `NEXT_PUBLIC_ebooksformileonepress_SUPABASE_URL` | A **separate** Supabase/Postgres project. Not referenced by the course catalog code inspected. Its exact purpose vs. the eBook catalog plan needs owner confirmation. |

> **Open question for the owner:** Should the new eBook catalog tables live in the **primary** project (alongside courses, enabling `ebook_entitlements` ↔ `course_entitlements` joins) or in the **`ebooksformileonepress`** project? This decision blocks proposed migration `0002`. The migration is currently written against the **primary** project for join locality; confirm before applying.

---

## 3. Environment variables present (names only)

**Core:** `ADMIN_EMAILS`, `NEXT_PUBLIC_SITE_URL`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`
**Supabase (primary):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `SUPABASE_JWKS_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (+ `_2`/`_3` variants)
**Supabase (ebooksformileonepress):** full `ebooksformileonepress_*` + `NEXT_PUBLIC_ebooksformileonepress_*` set, including `POSTGRES_*`
**Stripe:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, multiple price IDs (`STRIPE_GENERAL_KNOWLEDGE_PRICE_ID`, `STRIPE_PRE_TRIP_INSPECTION_PRICE_ID`, `STRIPE_PRO_PRICE_ID`, `STRIPE_FLEET_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PRICE_PRO`, `NEXT_PUBLIC_STRIPE_PRICE_FLEET`)
**PayPal:** `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV`
**Other:** `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`, assorted `API_KEY*` slots

**No new environment variables are required for Checkpoint 1.** Later checkpoints depend on the two owner decisions above (storage target, eBook project target), not on new secrets.

> Secret values were never read or emitted. Only variable **names** were inventoried.

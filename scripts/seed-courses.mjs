// Seeds the interactive courses dataset from the parsed workbook JSON into Supabase.
// Run: set -a && source /vercel/share/.env.project && set +a && node scripts/seed-courses.mjs
import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
})

const d = JSON.parse(fs.readFileSync('data/courses-parsed.json', 'utf8'))

// Per-course pricing in cents (one-time purchase). Sensible CDL defaults.
const PRICE_BY_CATEGORY = {
  general_knowledge: 2999,
  air_brakes: 1999,
  combination: 2499,
  hazmat: 2999,
  tanker: 1999,
  doubles_triples: 1999,
  passenger: 2499,
  school_bus: 2499,
  pre_trip: 2999,
}

const bool = (v) => v === true || v === 'true' || v === 'TRUE' || v === 1 || v === '1'
const jsonb = (v) => {
  if (v == null) return null
  if (typeof v === 'object') return v
  try {
    return JSON.parse(v)
  } catch {
    return { text: String(v) }
  }
}
const num = (v) => (v == null || v === '' ? null : Number(v))

async function upsert(table, rows) {
  if (!rows.length) return
  const chunkSize = 500
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)
    const { error } = await supabase.from(table).upsert(chunk, { onConflict: 'id' })
    if (error) {
      console.error(`Error upserting ${table} (rows ${i}-${i + chunk.length}):`, error.message)
      process.exit(1)
    }
  }
  console.log(`  ${table}: ${rows.length} rows`)
}

async function main() {
  console.log('Seeding courses...')

  await upsert(
    'courses',
    d.courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      category: c.category,
      course_type: c.course_type,
      thumbnail_path: c.thumbnail_path,
      is_free: bool(c.is_free),
      status: c.status || 'published',
      version: c.version,
      sort_order: num(c.sort_order) ?? 0,
      estimated_minutes: num(c.estimated_minutes),
      passing_score: num(c.passing_score) ?? 80,
      price_cents: PRICE_BY_CATEGORY[c.category] ?? 2999,
    })),
  )

  await upsert('course_translations', d.course_translations)
  await upsert('sections', d.sections.map((s) => ({ ...s, sort_order: num(s.sort_order) ?? 0 })))
  await upsert('section_translations', d.section_translations)
  await upsert(
    'lessons',
    d.lessons.map((l) => ({
      ...l,
      sort_order: num(l.sort_order) ?? 0,
      estimated_minutes: num(l.estimated_minutes),
      is_preview: bool(l.is_preview),
    })),
  )
  await upsert('lesson_translations', d.lesson_translations)
  await upsert(
    'lesson_blocks',
    d.lesson_blocks.map((b) => ({
      id: b.id,
      lesson_id: b.lesson_id,
      block_key: b.block_key,
      block_type: b.block_type,
      content_json: jsonb(b.content_json),
      sort_order: num(b.sort_order) ?? 0,
      status: b.status || 'published',
      media_asset_id: b.media_asset_id || null,
    })),
  )
  await upsert(
    'block_translations',
    d.block_translations.map((b) => ({ ...b, content_json: jsonb(b.content_json) })),
  )
  await upsert('media_assets', d.media_assets.map((m) => ({ ...m, downloadable: bool(m.downloadable), offline_allowed: bool(m.offline_allowed) })))
  await upsert(
    'practice_tests',
    d.practice_tests.map((t) => ({
      ...t,
      question_count: num(t.question_count),
      passing_score: num(t.passing_score) ?? 80,
      time_limit_minutes: num(t.time_limit_minutes),
    })),
  )
  await upsert(
    'questions',
    d.questions.map((q) => ({ ...q, sort_order: num(q.sort_order) ?? 0 })),
  )
  await upsert('question_translations', d.question_translations)
  await upsert(
    'answer_choices',
    d.answer_choices.map((a) => ({ ...a, sort_order: num(a.sort_order) ?? 0 })),
  )
  await upsert('choice_translations', d.choice_translations)
  await upsert(
    'practice_test_questions',
    d.practice_test_questions.map((p) => ({ ...p, sort_order: num(p.sort_order) ?? 0, weight: num(p.weight) ?? 1 })),
  )

  console.log('Seed complete.')
}

main()

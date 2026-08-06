import { read, utils } from 'xlsx'
import { readFileSync, writeFileSync } from 'node:fs'

const buf = readFileSync('data/MyCDLClass_Supabase_Interactive_Courses_Master_Repaired-d0b31c.xlsx')
const wb = read(buf, { cellDates: true })

const DATA_SHEETS = [
  'courses', 'course_translations', 'sections', 'section_translations',
  'lessons', 'lesson_translations', 'lesson_blocks', 'block_translations',
  'questions', 'question_translations', 'answer_choices', 'choice_translations',
  'practice_tests', 'practice_test_questions', 'media_assets',
]

const out = {}
for (const name of DATA_SHEETS) {
  const sheet = wb.Sheets[name]
  if (!sheet) { out[name] = []; continue }
  const rows = utils.sheet_to_json(sheet, { header: 1, defval: null, blankrows: false })
  // find header row: the one whose first cell is exactly 'id'
  let headerIdx = rows.findIndex((r) => Array.isArray(r) && r[0] === 'id')
  if (headerIdx === -1) headerIdx = 1
  const header = rows[headerIdx]
  const records = []
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i]
    if (!r || r.every((c) => c === null || c === '')) continue
    const obj = {}
    header.forEach((h, idx) => { if (h) obj[h] = r[idx] ?? null })
    records.push(obj)
  }
  out[name] = records
}

writeFileSync('data/courses-parsed.json', JSON.stringify(out, null, 2))

// Print summary
for (const name of DATA_SHEETS) {
  console.log(name, '->', out[name].length, 'rows | cols:', out[name][0] ? Object.keys(out[name][0]).join(',') : '(none)')
}

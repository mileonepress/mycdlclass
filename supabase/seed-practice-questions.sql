-- Seed interactive practice-test questions for the 8 courses that are missing them.
-- Targets the EXISTING public.questions table (same one General Knowledge already uses),
-- so every course works identically to General Knowledge with no duplicate tables/routes.
--
-- Notes:
--   * correct_answer is the LETTER (A/B/C/D) matching the option, as the quiz expects.
--   * course_id is looked up from public.courses by slug.
--   * Each insert is guarded with NOT EXISTS, so running this file multiple times is safe
--     and it will never duplicate a question.
--   * General Knowledge is intentionally omitted because it already has questions.

-- ===== AIR BRAKES =====
insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Air brakes use?', 'Hydraulic fluid', 'Compressed air', 'Gasoline', 'Water', 'B', 1, true
from public.courses c where c.slug = 'air-brakes'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Air brakes use?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Low air warning activates around?', '60 PSI', '120 PSI', '150 PSI', '200 PSI', 'A', 2, true
from public.courses c where c.slug = 'air-brakes'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Low air warning activates around?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Air tanks should be?', 'Ignored', 'Drained regularly', 'Painted', 'Removed', 'B', 3, true
from public.courses c where c.slug = 'air-brakes'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Air tanks should be?');

-- ===== COMBINATION VEHICLES =====
insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Before coupling you should check?', 'Trailer height', 'Radio', 'GPS', 'Mirrors only', 'A', 1, true
from public.courses c where c.slug = 'combination-vehicles'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Before coupling you should check?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Glad hands connect?', 'Fuel lines', 'Electrical cables', 'Air lines', 'Battery cables', 'C', 2, true
from public.courses c where c.slug = 'combination-vehicles'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Glad hands connect?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Fifth wheel should be?', 'Cracked', 'Secure', 'Loose', 'Missing', 'B', 3, true
from public.courses c where c.slug = 'combination-vehicles'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Fifth wheel should be?');

-- ===== DOUBLES & TRIPLES =====
insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'The heaviest trailer should be?', 'Last', 'Middle', 'First behind tractor', 'Anywhere', 'C', 1, true
from public.courses c where c.slug = 'doubles-triples'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'The heaviest trailer should be?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Doubles are more likely to?', 'Jackknife', 'Float', 'Overheat', 'Accelerate', 'A', 2, true
from public.courses c where c.slug = 'doubles-triples'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Doubles are more likely to?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Converter dolly connects?', 'Trailers', 'Engine', 'Brakes', 'Tires', 'A', 3, true
from public.courses c where c.slug = 'doubles-triples'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Converter dolly connects?');

-- ===== TANKER =====
insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Liquid surge is?', 'Cargo movement', 'Engine vibration', 'Fuel leak', 'Tire wear', 'A', 1, true
from public.courses c where c.slug = 'tanker'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Liquid surge is?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Surge is strongest in?', 'Smooth bore tanks', 'Baffled tanks', 'Empty tanks', 'Small tanks', 'A', 2, true
from public.courses c where c.slug = 'tanker'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Surge is strongest in?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Drivers should?', 'Brake smoothly', 'Brake suddenly', 'Accelerate hard', 'Ignore surge', 'A', 3, true
from public.courses c where c.slug = 'tanker'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Drivers should?');

-- ===== HAZMAT =====
insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Placards identify?', 'Company', 'Hazards', 'Driver', 'Fuel type', 'B', 1, true
from public.courses c where c.slug = 'hazmat'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Placards identify?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'HazMat requires?', 'Endorsement', 'Nothing', 'Permit only', 'Passport', 'A', 2, true
from public.courses c where c.slug = 'hazmat'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'HazMat requires?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Shipping papers should be?', 'Accessible', 'Hidden', 'Locked away', 'Discarded', 'A', 3, true
from public.courses c where c.slug = 'hazmat'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Shipping papers should be?');

-- ===== PASSENGER =====
insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Aisles must remain?', 'Blocked', 'Clear', 'Wet', 'Dark', 'B', 1, true
from public.courses c where c.slug = 'passenger'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Aisles must remain?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Passengers should board?', 'Safely', 'Quickly', 'Running', 'Through rear window', 'A', 2, true
from public.courses c where c.slug = 'passenger'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Passengers should board?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Emergency exits should be?', 'Accessible', 'Locked', 'Covered', 'Removed', 'A', 3, true
from public.courses c where c.slug = 'passenger'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Emergency exits should be?');

-- ===== SCHOOL BUS =====
insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'At railroad crossings?', 'Stop look listen', 'Speed up', 'Shift gears', 'Ignore', 'A', 1, true
from public.courses c where c.slug = 'school-bus'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'At railroad crossings?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Student safety is?', 'Priority', 'Optional', 'Secondary', 'Driver choice', 'A', 2, true
from public.courses c where c.slug = 'school-bus'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Student safety is?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Red warning lights mean?', 'Students loading/unloading', 'Fuel low', 'Engine hot', 'Weather alert', 'A', 3, true
from public.courses c where c.slug = 'school-bus'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Red warning lights mean?');

-- ===== PRE-TRIP INSPECTION =====
insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Pre-trip inspection occurs?', 'Before driving', 'After driving', 'Weekly', 'Monthly', 'A', 1, true
from public.courses c where c.slug = 'pre-trip-inspection'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Pre-trip inspection occurs?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Tires should be checked for?', 'Damage', 'Color', 'Brand', 'Age only', 'A', 2, true
from public.courses c where c.slug = 'pre-trip-inspection'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Tires should be checked for?');

insert into public.questions (course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order, is_published)
select c.id, 'Leaks should be?', 'Reported', 'Ignored', 'Painted', 'Covered', 'A', 3, true
from public.courses c where c.slug = 'pre-trip-inspection'
and not exists (select 1 from public.questions q where q.course_id = c.id and q.question_text = 'Leaks should be?');

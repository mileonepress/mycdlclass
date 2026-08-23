-- 0004_localized_ebook_covers
-- Adds a language-aware, format-aware localized cover catalog so all 18
-- localized cover designs (9 slugs x en/es) and both WebP + JPG objects
-- (36 storage objects total) are referenced by the database. Localization is
-- taken from covers/cover_manifest.json (authoritative), NOT inferred from
-- filenames in application code. Additive & non-destructive: the existing
-- public.ebook_covers canonical rows are untouched.
--
-- Public read is gated on the parent eBook being published (mirrors
-- ebook_covers_read); writes are service-role only. Seed is idempotent.


create table if not exists public.ebook_localized_covers (
  id              uuid primary key default gen_random_uuid(),
  ebook_id        uuid not null references public.ebooks(id) on delete cascade,
  language_code   text not null check (language_code in ('en','es')),
  image_format    text not null check (image_format in ('webp','jpg')),
  storage_bucket  text not null default 'public-assets',
  storage_path    text not null,
  mime_type       text not null,
  width_px        integer,
  height_px       integer,
  checksum_sha256 text not null,
  source_file     text,
  alt_text        text,
  status          text not null default 'ready_for_review'
                  check (status in ('draft','ready_for_review','approved','published','archived')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint ebook_localized_covers_variant_uniq unique (ebook_id, language_code, image_format),
  constraint ebook_localized_covers_object_uniq  unique (storage_bucket, storage_path)
);
create index if not exists ebook_localized_covers_ebook_idx on public.ebook_localized_covers (ebook_id, language_code);

-- RLS: public may read a localized cover only when its parent eBook is published.
alter table public.ebook_localized_covers enable row level security;
drop policy if exists ebook_localized_covers_read on public.ebook_localized_covers;
create policy ebook_localized_covers_read on public.ebook_localized_covers for select using (
  exists (select 1 from public.ebooks e where e.id = ebook_localized_covers.ebook_id and e.status = 'published'));
drop policy if exists ebook_localized_covers_service_all on public.ebook_localized_covers;
create policy ebook_localized_covers_service_all on public.ebook_localized_covers for all
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

revoke insert, update, delete, truncate on public.ebook_localized_covers from anon, authenticated;
grant select on public.ebook_localized_covers to anon, authenticated;

-- Idempotent seed of the 36 localized cover objects from the staging manifest.

with src (slug, language_code, image_format, storage_path, mime_type, width_px, height_px, checksum_sha256, source_file, alt_text) as (
  values
  ('general-knowledge', 'en', 'webp', 'ebook-covers/general-knowledge-en.webp', 'image/webp', 1329, 1800, '54600c528e34a1494611203377d8ca972866450631f841182878a41f3847986f', 'General Knowledge Book cover no logo pdf.pdf', 'General Knowledge CDL prep eBook cover'),
  ('general-knowledge', 'en', 'jpg', 'ebook-covers/general-knowledge-en.jpg', 'image/jpeg', 1329, 1800, '5cad41e206eee228002f5be2e2b8fd86391a57bdb894d7c93554c70f72e2b8f7', 'General Knowledge Book cover no logo pdf.pdf', 'General Knowledge CDL prep eBook cover'),
  ('air-brakes', 'en', 'webp', 'ebook-covers/air-brakes-en.webp', 'image/webp', 1329, 1800, 'ebc017797f9166d1c1541f5cdf8de5df16fd465f27cbf1de48c6c1f67dc3bc73', 'Air Brakes Book cover no logo pdf.pdf', 'Air Brakes CDL prep eBook cover'),
  ('air-brakes', 'en', 'jpg', 'ebook-covers/air-brakes-en.jpg', 'image/jpeg', 1329, 1800, 'c644c55c35d6e82cca11686a51d10c67ca6d0ded4950f034c6babe35eb4d4343', 'Air Brakes Book cover no logo pdf.pdf', 'Air Brakes CDL prep eBook cover'),
  ('combination-vehicles', 'en', 'webp', 'ebook-covers/combination-vehicles-en.webp', 'image/webp', 1329, 1800, '73b4e564675a2bb6e9ac657443038e23b634ef513ae399917f46b73955ea49e6', 'Combination Vehicle Book cover no logo pdf.pdf', 'Combination Vehicles CDL prep eBook cover'),
  ('combination-vehicles', 'en', 'jpg', 'ebook-covers/combination-vehicles-en.jpg', 'image/jpeg', 1329, 1800, '97c733a983235d38e03420e0a5257b43988b0d4338c2a11d5aeb5d945f6bf13c', 'Combination Vehicle Book cover no logo pdf.pdf', 'Combination Vehicles CDL prep eBook cover'),
  ('doubles-triples', 'en', 'webp', 'ebook-covers/doubles-triples-en.webp', 'image/webp', 1329, 1800, '47a886a4a16a9680e6e6b2c8ef878f9080bfc193220509cab1abf17ceee9b4af', 'Double Triple Trailer Vehicle Book cover no logo pdf.pdf', 'Doubles and Triples CDL prep eBook cover'),
  ('doubles-triples', 'en', 'jpg', 'ebook-covers/doubles-triples-en.jpg', 'image/jpeg', 1329, 1800, '5bf7796cc2326086b3efae27af25e3d1c5e3e3853538f87cda64b3fb0d365de1', 'Double Triple Trailer Vehicle Book cover no logo pdf.pdf', 'Doubles and Triples CDL prep eBook cover'),
  ('hazmat', 'en', 'webp', 'ebook-covers/hazmat-en.webp', 'image/webp', 1329, 1800, '645f035c8943deedb4ffeeb9f0f88f99ae9f27640cb65171920ca485ae0e45e5', 'Haz Mat Book cover no logo pdf.pdf', 'Hazardous Materials CDL prep eBook cover'),
  ('hazmat', 'en', 'jpg', 'ebook-covers/hazmat-en.jpg', 'image/jpeg', 1329, 1800, '99915254154e8a4388e582b3e3fb95b0657f2c3280b0d2be4f3ab057831f92e6', 'Haz Mat Book cover no logo pdf.pdf', 'Hazardous Materials CDL prep eBook cover'),
  ('passenger', 'en', 'webp', 'ebook-covers/passenger-en.webp', 'image/webp', 1520, 1800, 'a42d83233311cc92ca5febe4692589ce776518ef2d017d76bc258b8b659db3b0', 'Passenger Book cover no logo official size pdf.pdf', 'Passenger Endorsement CDL prep eBook cover'),
  ('passenger', 'en', 'jpg', 'ebook-covers/passenger-en.jpg', 'image/jpeg', 1520, 1800, '261560c20a917cac48ce604d65eeb2f3d2371f9c61b2f44128199d71c79b14f9', 'Passenger Book cover no logo official size pdf.pdf', 'Passenger Endorsement CDL prep eBook cover'),
  ('pre-trip-inspection', 'en', 'webp', 'ebook-covers/pre-trip-inspection-en.webp', 'image/webp', 1329, 1800, '27a01fa03136561a30861c8c596a6a8818660c9e184859bba1c7ca96fa080fc5', 'Pre Trip Inspection Book cover no logo pdf.pdf', 'Pre-Trip Inspection CDL prep eBook cover'),
  ('pre-trip-inspection', 'en', 'jpg', 'ebook-covers/pre-trip-inspection-en.jpg', 'image/jpeg', 1329, 1800, 'e840611901f4f2ea58310e107817379a87e1ed86d81f8abdb0776256d60a2476', 'Pre Trip Inspection Book cover no logo pdf.pdf', 'Pre-Trip Inspection CDL prep eBook cover'),
  ('school-bus', 'en', 'webp', 'ebook-covers/school-bus-en.webp', 'image/webp', 1520, 1800, '50920ba6a0a665ec2113a9f82d259edaff0bf36b30373916103ff687e9400b3e', 'School Bus Book cover no logo official size pdf.pdf', 'School Bus Endorsement CDL prep eBook cover'),
  ('school-bus', 'en', 'jpg', 'ebook-covers/school-bus-en.jpg', 'image/jpeg', 1520, 1800, '0059bb9011fee79279a9e9b26775e96e4031766325d886a0a252eb721ed6b4da', 'School Bus Book cover no logo official size pdf.pdf', 'School Bus Endorsement CDL prep eBook cover'),
  ('tanker', 'en', 'webp', 'ebook-covers/tanker-en.webp', 'image/webp', 1329, 1800, 'c03f2a092cc9f76cfb1163201f871fea3e73d5b9ae87a532d20d68d7063872d8', 'Tanker endorement Book cover no logo pdf.pdf', 'Tanker Endorsement CDL prep eBook cover'),
  ('tanker', 'en', 'jpg', 'ebook-covers/tanker-en.jpg', 'image/jpeg', 1329, 1800, '85a6f9be5d1b93c062bcef26723da6c456b78c08e7987e8ceefc557b80bf11ae', 'Tanker endorement Book cover no logo pdf.pdf', 'Tanker Endorsement CDL prep eBook cover'),
  ('general-knowledge', 'es', 'webp', 'ebook-covers/general-knowledge-es.webp', 'image/webp', 1311, 1800, '6cb14dc090a332340ccd131f6c70717a487956e4de1323270a5366ddfd511fa1', 'Official Spanish Book cover- General Knowledge.png', 'Portada del libro CDL Conocimientos Generales'),
  ('general-knowledge', 'es', 'jpg', 'ebook-covers/general-knowledge-es.jpg', 'image/jpeg', 1311, 1800, '3e1b08f6c783222a30826690f713c4cd8c393702c59c5b2ba26a4b33c3e45156', 'Official Spanish Book cover- General Knowledge.png', 'Portada del libro CDL Conocimientos Generales'),
  ('air-brakes', 'es', 'webp', 'ebook-covers/air-brakes-es.webp', 'image/webp', 1311, 1800, 'cf82f7bcac4ae964a5095f1adead316ac7fd70349732a9c3aa3854197d955a12', 'Official Spanish Book cover- Air Brakes.png', 'Portada del libro CDL Frenos de Aire'),
  ('air-brakes', 'es', 'jpg', 'ebook-covers/air-brakes-es.jpg', 'image/jpeg', 1311, 1800, 'bb33a7ba1ed8e4af724ef3a09da1b6518cc47a6ca0a298605807989feac04b69', 'Official Spanish Book cover- Air Brakes.png', 'Portada del libro CDL Frenos de Aire'),
  ('combination-vehicles', 'es', 'webp', 'ebook-covers/combination-vehicles-es.webp', 'image/webp', 1311, 1800, '28d790ce6e516ed9da290c443a66665feac66fcf400226f0fd5b1e3f03920638', 'Official Spanish Book cover- Combination Vehicle.png', 'Portada del libro CDL Vehículos Combinados'),
  ('combination-vehicles', 'es', 'jpg', 'ebook-covers/combination-vehicles-es.jpg', 'image/jpeg', 1311, 1800, 'ca6d7a7a6b7b2a0d97cdd0739a602cdaf5d41752fde6e211d5a50fdb1a6b0c49', 'Official Spanish Book cover- Combination Vehicle.png', 'Portada del libro CDL Vehículos Combinados'),
  ('doubles-triples', 'es', 'webp', 'ebook-covers/doubles-triples-es.webp', 'image/webp', 1311, 1800, '104016266ffae09ee7273947d0d04133e47b298842e04eeddd8a88e659593e7f', 'Official Spanish Book cover- Double Triple Trailer.png', 'Portada del libro CDL Dobles y Triples'),
  ('doubles-triples', 'es', 'jpg', 'ebook-covers/doubles-triples-es.jpg', 'image/jpeg', 1311, 1800, '513add2dd909adc2ce0e7440f5f59f44242d464fbd6dd11b08221cb8a278bd7c', 'Official Spanish Book cover- Double Triple Trailer.png', 'Portada del libro CDL Dobles y Triples'),
  ('hazmat', 'es', 'webp', 'ebook-covers/hazmat-es.webp', 'image/webp', 1311, 1800, 'be92357e11b053daa9546d6c426577d04bf35103544b1542705612d05758b884', 'Official Spanish Book cover- Hazardous Materials.png', 'Portada del libro CDL Materiales Peligrosos'),
  ('hazmat', 'es', 'jpg', 'ebook-covers/hazmat-es.jpg', 'image/jpeg', 1311, 1800, '4393b8934a5e59a3ca86174b35862815ca5408c1d56b3908386cf7884fd0bac8', 'Official Spanish Book cover- Hazardous Materials.png', 'Portada del libro CDL Materiales Peligrosos'),
  ('passenger', 'es', 'webp', 'ebook-covers/passenger-es.webp', 'image/webp', 1390, 1800, '92d6874e3e5521a76d809cae69f955485bb8339e5e81d98435dad879a2ee3665', 'Official Spanish Book cover- Passenger Endorsement.png', 'Portada del libro CDL Endoso de Pasajeros'),
  ('passenger', 'es', 'jpg', 'ebook-covers/passenger-es.jpg', 'image/jpeg', 1390, 1800, '0903660938aee9f814007840a8324722f4b0fff29ca8695062b294d445c7cad2', 'Official Spanish Book cover- Passenger Endorsement.png', 'Portada del libro CDL Endoso de Pasajeros'),
  ('pre-trip-inspection', 'es', 'webp', 'ebook-covers/pre-trip-inspection-es.webp', 'image/webp', 1311, 1800, 'ba8252555eb249ddf4172d0a5a0b9109b58fe2fdbfd634640e4f2c136e6dace3', 'Official Spanish Book cover- Pre Trip Inspection.png', 'Portada del libro CDL Inspección Antes del Viaje'),
  ('pre-trip-inspection', 'es', 'jpg', 'ebook-covers/pre-trip-inspection-es.jpg', 'image/jpeg', 1311, 1800, '58a244dda20136b5ec5d3ba1ae23f5c07d4865dfbe4fad88fa0893915b4df64f', 'Official Spanish Book cover- Pre Trip Inspection.png', 'Portada del libro CDL Inspección Antes del Viaje'),
  ('school-bus', 'es', 'webp', 'ebook-covers/school-bus-es.webp', 'image/webp', 1390, 1800, 'a6a454ccb181b269dda20c2a53ce6201de4adc661642a75f7f253ca73820d697', 'Official Spanish Book cover- School Bus.png', 'Portada del libro CDL Endoso de Autobús Escolar'),
  ('school-bus', 'es', 'jpg', 'ebook-covers/school-bus-es.jpg', 'image/jpeg', 1390, 1800, '393cc9ea5e2662fa6a48929c1c99e5001ffdd15aef6ac0900362f4c0c4b92d5f', 'Official Spanish Book cover- School Bus.png', 'Portada del libro CDL Endoso de Autobús Escolar'),
  ('tanker', 'es', 'webp', 'ebook-covers/tanker-es.webp', 'image/webp', 1311, 1800, 'f1c9c67939f4e5067fe468894c4f01ee4bac4d44be91f7ef704cb4e4f0a5151b', 'Official Spanish Book cover- Tanker.png', 'Portada del libro CDL Endoso de Tanques'),
  ('tanker', 'es', 'jpg', 'ebook-covers/tanker-es.jpg', 'image/jpeg', 1311, 1800, 'a325b3b3f5c8d223ed3f7e5545102c1f9bbe18cb4384cc46897ddbaa8893e4b3', 'Official Spanish Book cover- Tanker.png', 'Portada del libro CDL Endoso de Tanques')
)
insert into public.ebook_localized_covers
  (ebook_id, language_code, image_format, storage_bucket, storage_path, mime_type, width_px, height_px, checksum_sha256, source_file, alt_text, status)
select e.id, s.language_code, s.image_format, 'public-assets', s.storage_path, s.mime_type,
       s.width_px, s.height_px, s.checksum_sha256, s.source_file, s.alt_text, 'ready_for_review'
from src s
join public.ebooks e on e.slug = s.slug
on conflict (ebook_id, language_code, image_format) do nothing;

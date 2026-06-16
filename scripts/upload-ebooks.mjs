import { put } from "@vercel/blob";
import { readFile } from "node:fs/promises";

const BASE_EN = "/tmp/ebooks2/Mile One books pdf with logos";
const BASE_ES = "/tmp/ebooks1/PDF and ebooks";

const MAP = {
  "general-knowledge": {
    en: `${BASE_EN}/General Knowledge Prep Exam Booklet.pdf`,
    es: `${BASE_ES}/General Knowledge - Spanish Version.pdf`,
  },
  "air-brakes": {
    en: `${BASE_EN}/Air Brakes Prep Exam Booklet.pdf`,
    es: `${BASE_ES}/Air Brakes - Spanish Version.pdf`,
  },
  "combination-vehicles": {
    en: `${BASE_EN}/Combination Vehicle Prep Exam Booklet.pdf`,
    es: `${BASE_ES}/Combination Vehicle - Spanish Version.pdf`,
  },
  "doubles-triples": {
    en: `${BASE_EN}/Double Triple Trailer Endorsement Prep Exam Booklet.pdf`,
    es: `${BASE_ES}/Double Triple - Spanish Version.pdf`,
  },
  tanker: {
    en: `${BASE_EN}/Tanker Endorsement Prep Exam Booklet.pdf`,
    es: `${BASE_ES}/Tanker - Spanish Version.pdf`,
  },
  hazmat: {
    en: `${BASE_EN}/HazMat Prep Exam Booklet.pdf`,
    es: `${BASE_ES}/Haz Mat - Spanish Version.pdf`,
  },
  passenger: {
    en: `${BASE_EN}/Passenger Vehicle Endorsement Pre Exam Booklet.pdf`,
    es: `${BASE_ES}/Passenger - Spanish Version.pdf`,
  },
  "school-bus": {
    en: `${BASE_EN}/School Bus Endorsement Prep Exam Booklet.pdf`,
    es: `${BASE_ES}/School Bus - Spanish Version.pdf`,
  },
  "pre-trip-inspection": {
    en: `${BASE_EN}/Pre Trip Inspection Prep Exam Booklet.pdf`,
    es: `${BASE_ES}/Pre Trip - Spanish Version.pdf`,
  },
};

const results = {};

for (const [slug, langs] of Object.entries(MAP)) {
  results[slug] = {};
  for (const [lang, filepath] of Object.entries(langs)) {
    const buf = await readFile(filepath);
    const pathname = `ebooks/${slug}-${lang}.pdf`;
    const blob = await put(pathname, buf, {
      access: "private",
      contentType: "application/pdf",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    results[slug][lang] = blob.pathname;
    console.log(`Uploaded ${slug} (${lang}) -> ${blob.pathname}`);
  }
}

console.log("\n=== RESULT JSON ===");
console.log(JSON.stringify(results, null, 2));

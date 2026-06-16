// Ebook product catalog. Each CDL booklet is sold separately as a PDF.
// English and Spanish are SEPARATE products (18 total listings), each $9.99.
// PDFs live in PRIVATE Vercel Blob storage and are delivered via a secure,
// purchase-verified download link emailed after Stripe checkout completes.

export const EBOOK_PRICE = "9.99";

// Base booklets. Each has an English and a Spanish edition.
const EBOOK_BASE = [
  {
    base: "general-knowledge",
    name: { en: "General Knowledge", es: "Conocimientos Generales" },
  },
  {
    base: "air-brakes",
    name: { en: "Air Brakes", es: "Frenos de Aire" },
  },
  {
    base: "combination-vehicles",
    name: { en: "Combination Vehicles", es: "Vehículos Combinados" },
  },
  {
    base: "doubles-triples",
    name: { en: "Doubles/Triples", es: "Remolques Dobles/Triples" },
  },
  {
    base: "tanker",
    name: { en: "Tanker Vehicles", es: "Vehículos Cisterna" },
  },
  {
    base: "hazmat",
    name: { en: "HazMat", es: "Materiales Peligrosos" },
  },
  {
    base: "passenger",
    name: { en: "Passenger", es: "Vehículos de Pasajeros" },
  },
  {
    base: "school-bus",
    name: { en: "School Bus", es: "Autobús Escolar" },
  },
  {
    base: "pre-trip-inspection",
    name: { en: "Pre-Trip Inspection", es: "Inspección Previa al Viaje" },
  },
];

const LANG_LABEL = { en: "English", es: "Spanish" };

// Build the flat catalog of 18 separate products keyed by `${base}-${lang}`.
export const EBOOK_PRODUCTS = EBOOK_BASE.reduce((acc, item) => {
  for (const lang of ["en", "es"]) {
    const slug = `${item.base}-${lang}`;
    acc[slug] = {
      slug,
      base: item.base,
      language: lang,
      price: EBOOK_PRICE,
      title: item.name[lang],
      // Display the localized title plus a language badge.
      languageLabel: LANG_LABEL[lang],
      // Private blob pathname for the PDF (served via /api/ebooks/download).
      blobPathname: `ebooks/${slug}.pdf`,
      // Public cover image in /public/ebooks/covers.
      cover: `/ebooks/covers/${slug}.png`,
    };
  }
  return acc;
}, {});

export function getEbookProduct(slug) {
  return EBOOK_PRODUCTS[slug] || null;
}

// Ordered list for display (English first, then Spanish for each booklet).
export function listEbookProducts() {
  const list = [];
  for (const item of EBOOK_BASE) {
    list.push(EBOOK_PRODUCTS[`${item.base}-en`]);
    list.push(EBOOK_PRODUCTS[`${item.base}-es`]);
  }
  return list;
}

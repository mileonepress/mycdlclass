// Course product catalog for PayPal one-time purchases.
// Each course is sold separately. Prices are in USD.
// Slugs MUST match the course slugs in the database / course routes.
// hostedButtonId holds language-specific PayPal hosted button IDs.

export const COURSE_PRODUCTS = {
  "general-knowledge": {
    slug: "general-knowledge",
    price: "9.99",
    name: { en: "General Knowledge", es: "Conocimientos Generales" },
    hostedButtonId: { en: "44SHMNGR9NZYU", es: "JCA74BPV2CPZY" },
  },
  "air-brakes": {
    slug: "air-brakes",
    price: "9.99",
    name: { en: "Air Brakes", es: "Frenos de Aire" },
    hostedButtonId: { en: "QHWSSH65KDZLS", es: "BFV7E57VAB3FU" },
  },
  "combination-vehicles": {
    slug: "combination-vehicles",
    price: "9.99",
    name: { en: "Combination Vehicles", es: "Vehículos Combinados" },
    hostedButtonId: { en: "BH6DN4N5HACLL", es: "76DBAXLV4VR86" },
  },
  "doubles-triples": {
    slug: "doubles-triples",
    price: "9.99",
    name: { en: "Doubles/Triples", es: "Remolques Dobles/Triples" },
    hostedButtonId: { en: "8V6XZN5ZYXZFN", es: "YPM6XQTTH4SML" },
  },
  tanker: {
    slug: "tanker",
    price: "9.99",
    name: { en: "Tanker Vehicles", es: "Vehículos Cisterna" },
    hostedButtonId: { en: "LKCRBAP2M5VF6", es: "EBKBM2928L8JG" },
  },
  hazmat: {
    slug: "hazmat",
    price: "9.99",
    name: { en: "HazMat", es: "Materiales Peligrosos" },
    hostedButtonId: { en: "GHVXQDSPHCZWW", es: "HG4EJB4KBUPCL" },
  },
  passenger: {
    slug: "passenger",
    price: "9.99",
    name: { en: "Passenger", es: "Vehículos de Pasajeros" },
    hostedButtonId: { en: "JEAYTMR9395MQ", es: "7PPNFA3NERHFE" },
  },
  "school-bus": {
    slug: "school-bus",
    price: "9.99",
    name: { en: "School Bus", es: "Autobús Escolar" },
    hostedButtonId: { en: "QFCDWWV98KTC6", es: "UYB7GMHBVS9LL" },
  },
  "pre-trip-inspection": {
    slug: "pre-trip-inspection",
    price: "9.99",
    name: { en: "Pre-Trip Inspection", es: "Inspección Previa al Viaje" },
    hostedButtonId: { en: "PXBQCMTRQ7QZA", es: "274XPPT876WUJ" },
  },
};

export function getCourseProduct(slug) {
  return COURSE_PRODUCTS[slug] || null;
}

// Returns the hosted button ID for a course in the requested language.
// Falls back to English when a language-specific ID is not available.
export function getHostedButtonId(product, lang = "en") {
  if (!product?.hostedButtonId) return null;
  const ids = product.hostedButtonId;
  if (typeof ids === "string") return ids;
  return ids[lang] || ids.en || null;
}

import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";

const sampleTests = [
  {
    course: "General Knowledge",
    slug: "general-knowledge",
    spanish: "Conocimientos Generales",
    question: "What should you check during a trip inspection?",
    options: ["Radio volume", "Tires, brakes, and cargo securement", "Seat color", "Fuel brand"],
    answer: "Tires, brakes, and cargo securement",
  },
  {
    course: "Air Brakes",
    slug: "air-brakes",
    spanish: "Frenos de Aire",
    question: "Air brakes use what to make the brakes work?",
    options: ["Hydraulic fluid", "Compressed air", "Gasoline", "Electric motors"],
    answer: "Compressed air",
  },
  {
    course: "Combination Vehicles",
    slug: "combination-vehicles",
    spanish: "Vehículos Combinados",
    question: "What should you do before backing under a trailer?",
    options: ["Speed up", "Check trailer height", "Turn off all lights", "Release all brakes"],
    answer: "Check trailer height",
  },
  {
    course: "Doubles/Triples Trailers",
    slug: "doubles-triples",
    spanish: "Remolques Dobles/Triples",
    question: "Which trailer should be first behind the tractor?",
    options: ["Lightest trailer", "Heaviest trailer", "Shortest trailer", "Empty trailer"],
    answer: "Heaviest trailer",
  },
  {
    course: "Tanker Vehicles",
    slug: "tanker",
    spanish: "Vehículos Cisterna",
    question: "What is liquid surge?",
    options: ["Engine noise", "Movement of liquid cargo", "Brake overheating", "Tire damage"],
    answer: "Movement of liquid cargo",
  },
  {
    course: "HazMat",
    slug: "hazmat",
    spanish: "Materiales Peligrosos",
    question: "What is the purpose of placards?",
    options: ["Decoration", "Communicate risk", "Show company name", "Show weight"],
    answer: "Communicate risk",
  },
  {
    course: "Passenger",
    slug: "passenger",
    spanish: "Vehículos de Pasajeros",
    question: "Carry-on baggage must not be stored where?",
    options: ["Under seats", "In baggage area", "In the aisle", "Secured compartments"],
    answer: "In the aisle",
  },
  {
    course: "School Bus",
    slug: "school-bus",
    spanish: "Autobús Escolar",
    question: "At railroad crossings, school buses should:",
    options: ["Stop, look, and listen", "Speed up", "Shift gears on tracks", "Use high beams"],
    answer: "Stop, look, and listen",
  },
  {
    course: "Pre-Trip Inspection",
    slug: "pre-trip-inspection",
    spanish: "Inspección Previa al Viaje",
    question: "When should a pre-trip inspection be performed?",
    options: ["Monthly", "Before operating the vehicle", "Only after repairs", "Only at night"],
    answer: "Before operating the vehicle",
  },
];

export default function FreePracticeTestPage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#0D2B45]">
      <nav className="sticky top-0 z-50 bg-[#061A2E] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MyCDLClass" width={58} height={58} />
            <span className="font-extrabold tracking-wide">MYCDL CLASS</span>
          </Link>

          <div className="hidden gap-6 text-sm md:flex">
            <Link href="/courses">Courses</Link>
            <Link href="/free-practice-test">Free Test</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>

          <Link href="/courses" className="rounded-lg bg-[#16A34A] px-4 py-2 font-bold">
            Browse Courses
          </Link>
        </div>
      </nav>

      <section className="bg-[#061A2E] px-6 py-20 text-center text-white">
        <h1 className="text-5xl font-extrabold">Free CDL Practice Tests</h1>
        <p className="mx-auto mt-5 max-w-3xl text-xl text-white/85">
          Take a full interactive practice test for any of our 9 CDL courses &mdash; just like
          General Knowledge. Real questions, instant feedback, and answer explanations in
          English and Spanish.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="#samples"
            className="rounded-lg bg-[#16A34A] px-7 py-3 font-bold text-white"
          >
            Choose a Practice Test
          </Link>

          <Link
            href="/courses"
            className="rounded-lg border border-white px-7 py-3 font-bold"
          >
            Browse Full Courses
          </Link>
        </div>
      </section>

      <section id="samples" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold">Interactive Practice Tests by Course</h2>
          <p className="mt-3 text-lg text-gray-600">
            Each test runs the same way as General Knowledge: timed questions, instant
            scoring, and detailed answer explanations with full bilingual support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleTests.map((test, index) => (
            <div key={test.course} className="flex flex-col rounded-2xl bg-white p-6 shadow-lg border">
              <div className="mb-4">
                <span className="rounded-full bg-[#16A34A] px-3 py-1 text-xs font-bold text-white">
                  Interactive Test
                </span>
              </div>

              <h3 className="text-xl font-bold">{index + 1}. {test.course}</h3>
              <p className="mt-1 text-sm font-semibold text-[#16A34A]">
                {test.spanish}
              </p>

              <p className="mt-5 text-sm font-semibold text-gray-700">Sample question:</p>
              <p className="mt-1 text-sm text-gray-600">{test.question}</p>

              <Link
                href={`/courses/${test.slug}/quiz`}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-5 py-3 text-center font-bold text-white transition-colors hover:bg-[#15803D]"
              >
                Start Interactive Test
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href={`/courses/${test.slug}/quiz?lang=es`}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#16A34A] px-5 py-3 text-center font-bold text-[#16A34A] transition-colors hover:bg-[#16A34A] hover:text-white"
              >
                Empezar en Español
              </Link>

              <Link
                href={`/courses/${test.slug}`}
                className="mt-3 block text-center text-sm font-semibold text-[#1E4D8C] hover:underline"
              >
                Get Full {test.course} Course
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-bold">What Premium Includes</h2>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              "9 CDL Courses",
              "English & Spanish",
              "Full Practice Exams",
              "Progress Tracking",
            ].map((item) => (
              <div key={item} className="rounded-xl border p-6 font-bold">
                ✓ {item}
              </div>
            ))}
          </div>

          <Link
            href="/courses"
            className="mt-10 inline-block rounded-lg bg-[#16A34A] px-8 py-4 text-lg font-bold text-white"
          >
            Browse All Courses
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}

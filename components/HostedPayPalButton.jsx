"use client";

import { useState } from "react";
import { getPayPalHostedButton } from "@/lib/paypalHostedButtons";

const COPY = {
  en: {
    buy: "Buy with PayPal",
    redirecting: "Redirecting to PayPal…",
    instant: "Instant access right after payment — you'll return here to start the course.",
    secure: "Secure checkout. You can pay with PayPal or any card.",
    unavailable: "Checkout is temporarily unavailable. Please try again shortly.",
  },
  es: {
    buy: "Comprar con PayPal",
    redirecting: "Redirigiendo a PayPal…",
    instant: "Acceso inmediato después del pago — volverás aquí para comenzar el curso.",
    secure: "Pago seguro. Puedes pagar con PayPal o cualquier tarjeta.",
    unavailable: "El pago no está disponible por el momento. Inténtalo de nuevo en breve.",
  },
};

export default function HostedPayPalButton({ slug, lang = "en", label }) {
  const [loading, setLoading] = useState(false);
  const t = COPY[lang] || COPY.en;
  const paypalUrl = getPayPalHostedButton(slug, lang);

  function handlePayPalClick() {
    if (!paypalUrl) return;
    setLoading(true);

    // Remember what the buyer is purchasing so the success page can confirm it,
    // even though PayPal handles the actual checkout + return redirect.
    try {
      localStorage.setItem(
        "pendingCoursePurchase",
        JSON.stringify({
          slug,
          lang,
          successUrl: `/courses/${slug}/success${lang === "es" ? "?lang=es" : ""}`,
          startedAt: Date.now(),
        })
      );
    } catch {
      // localStorage may be unavailable (private mode); checkout still works.
    }

    window.location.href = paypalUrl;
  }

  if (!paypalUrl) {
    return (
      <p className="rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-700">
        {t.unavailable}
      </p>
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handlePayPalClick}
        disabled={loading}
        aria-busy={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFC439] px-6 py-4 text-lg font-extrabold text-[#003087] shadow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? t.redirecting : label || t.buy}
      </button>

      <p className="mt-3 rounded-lg bg-[#E6F0FF] px-3 py-2 text-center text-xs font-medium text-[#1E4D8C]">
        {t.instant}
      </p>
      <p className="mt-2 text-center text-xs text-gray-500">{t.secure}</p>
    </div>
  );
}

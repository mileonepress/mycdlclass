"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

const COPY = {
  en: {
    secure: "Secure checkout powered by PayPal",
    processing: "Processing your payment...",
    error: "Payment could not be completed. Please try again.",
    oneTime: "One-time purchase. Lifetime access.",
  },
  es: {
    secure: "Pago seguro con PayPal",
    processing: "Procesando tu pago...",
    error: "No se pudo completar el pago. Inténtalo de nuevo.",
    oneTime: "Compra única. Acceso de por vida.",
  },
};

export default function PayPalCourseButton({ slug, price, lang = "en" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const t = COPY[lang === "es" ? "es" : "en"];

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        PayPal is not configured. Please contact support.
      </p>
    );
  }

  return (
    <div className="w-full">
      <PayPalScriptProvider
        options={{
          clientId,
          currency: "USD",
          intent: "capture",
          locale: lang === "es" ? "es_MX" : "en_US",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", label: "pay" }}
          disabled={processing}
          createOrder={async () => {
            setError("");
            try {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, lang }),
              });
              const data = await res.json();
              if (!res.ok || !data.id) {
                throw new Error(data.error || "create order failed");
              }
              return data.id;
            } catch (err) {
              setError(t.error);
              throw err;
            }
          }}
          onApprove={async (data) => {
            setProcessing(true);
            setError("");
            try {
              const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID }),
              });
              const result = await res.json();
              if (
                res.ok &&
                (result.status === "COMPLETED" || result.status === "APPROVED")
              ) {
                const langParam = lang === "es" ? "?lang=es" : "";
                router.push(result.redirectUrl || `/courses/${slug}/success${langParam}`);
              } else {
                setProcessing(false);
                setError(t.error);
              }
            } catch (err) {
              setProcessing(false);
              setError(t.error);
            }
          }}
          onError={() => {
            setProcessing(false);
            setError(t.error);
          }}
        />
      </PayPalScriptProvider>

      {processing && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-[#0D2B45]">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t.processing}
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      <p className="mt-3 text-center text-xs text-gray-500">{t.secure}</p>
      <p className="text-center text-xs text-gray-400">{t.oneTime}</p>
    </div>
  );
}

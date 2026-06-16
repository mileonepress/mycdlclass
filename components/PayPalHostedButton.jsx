"use client";

import { useEffect, useRef } from "react";

const SDK_SRC =
  "https://www.paypal.com/sdk/js?client-id=BAA7UjEWj2CG1p95FtGDAxqmQE-9qFK3ZAsMdsE5anHEr27WAq7EmSZS8BfXSfj9VVqQIdjYD4G689goFo&components=hosted-buttons&enable-funding=venmo&currency=USD";

const COPY = {
  en: {
    secure: "Secure checkout powered by PayPal",
    oneTime: "One-time purchase. Lifetime access.",
    instant: "Instant access — your lessons are ready below as soon as you pay.",
  },
  es: {
    secure: "Pago seguro con PayPal",
    oneTime: "Compra única. Acceso de por vida.",
    instant: "Acceso inmediato — tus lecciones están listas abajo en cuanto pagues.",
  },
};

// Loads the PayPal hosted-buttons SDK exactly once across the page.
function loadPayPalSdk() {
  if (typeof window === "undefined") return Promise.reject();
  if (window.paypal?.HostedButtons) return Promise.resolve();

  if (!window.__paypalHostedSdkPromise) {
    window.__paypalHostedSdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SDK_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", reject);
        return;
      }
      const script = document.createElement("script");
      script.src = SDK_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return window.__paypalHostedSdkPromise;
}

export default function PayPalHostedButton({ hostedButtonId, lang = "en" }) {
  const containerRef = useRef(null);
  const renderedRef = useRef(false);
  const t = COPY[lang === "es" ? "es" : "en"];
  const containerId = `paypal-container-${hostedButtonId}`;

  useEffect(() => {
    let cancelled = false;
    if (!hostedButtonId || renderedRef.current) return;

    loadPayPalSdk()
      .then(() => {
        if (cancelled || renderedRef.current) return;
        if (window.paypal?.HostedButtons && containerRef.current) {
          renderedRef.current = true;
          window.paypal
            .HostedButtons({ hostedButtonId })
            .render(`#${containerId}`);
        }
      })
      .catch(() => {
        // SDK failed to load; container stays empty.
      });

    return () => {
      cancelled = true;
    };
  }, [hostedButtonId, containerId]);

  if (!hostedButtonId) return null;

  return (
    <div className="w-full">
      <div id={containerId} ref={containerRef} />
      <p className="mt-3 rounded-lg bg-[#E6F0FF] px-3 py-2 text-center text-xs font-medium text-[#1E4D8C]">
        {t.instant}
      </p>
      <p className="mt-2 text-center text-xs text-gray-500">{t.secure}</p>
      <p className="text-center text-xs text-gray-400">{t.oneTime}</p>
    </div>
  );
}

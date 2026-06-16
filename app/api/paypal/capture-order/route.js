import { NextResponse } from "next/server";
import { getPayPalAccessToken, getPayPalBase } from "@/lib/paypal";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    const res = await fetch(
      `${getPayPalBase()}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("[v0] PayPal capture-order error:", data);
      return NextResponse.json(
        { error: "Unable to capture payment." },
        { status: 500 }
      );
    }

    const unit = data?.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    const slug = unit?.reference_id || null;
    const language = unit?.custom_id === "es" ? "es" : "en";
    const amount = capture?.amount?.value || null;
    const currency = capture?.amount?.currency_code || "USD";
    const payerEmail = data?.payer?.email_address || null;

    // Record the purchase (no gating; just a record). Tie to the logged-in user if any.
    if (slug && data.status === "COMPLETED") {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const admin = getSupabaseAdmin();
        await admin.from("purchases").upsert(
          {
            user_id: user?.id || null,
            course_slug: slug,
            language,
            paypal_order_id: data.id,
            amount,
            currency,
            payer_email: payerEmail,
            status: data.status,
          },
          { onConflict: "paypal_order_id" }
        );
      } catch (dbErr) {
        // Don't fail the purchase if recording fails; payment already captured.
        console.error("[v0] Failed to record purchase:", dbErr);
      }
    }

    const redirectUrl = slug
      ? `/courses/${slug}/success${language === "es" ? "?lang=es" : ""}`
      : "/courses";

    return NextResponse.json({
      status: data.status,
      slug,
      language,
      captureId: capture?.id || null,
      payer: payerEmail,
      redirectUrl,
    });
  } catch (err) {
    console.error("[v0] capture-order exception:", err);
    return NextResponse.json(
      { error: "Something went wrong capturing the payment." },
      { status: 500 }
    );
  }
}

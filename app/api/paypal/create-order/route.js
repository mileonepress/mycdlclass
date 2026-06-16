import { NextResponse } from "next/server";
import { getPayPalAccessToken, getPayPalBase } from "@/lib/paypal";
import { getCourseProduct } from "@/lib/courseProducts";

export async function POST(req) {
  try {
    const { slug, lang } = await req.json();
    const product = getCourseProduct(slug);

    if (!product) {
      return NextResponse.json({ error: "Invalid course." }, { status: 400 });
    }

    const language = lang === "es" ? "es" : "en";
    const courseName = product.name[language];

    const accessToken = await getPayPalAccessToken();

    const res = await fetch(`${getPayPalBase()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: product.slug,
            custom_id: language,
            description: `MyCDLClass - ${courseName} Course`,
            amount: {
              currency_code: "USD",
              value: product.price,
            },
          },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[v0] PayPal create-order error:", data);
      return NextResponse.json(
        { error: "Unable to create PayPal order." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("[v0] create-order exception:", err);
    return NextResponse.json(
      { error: "Something went wrong creating the order." },
      { status: 500 }
    );
  }
}

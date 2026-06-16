import { type NextRequest, NextResponse } from "next/server"
import { get } from "@vercel/blob"
import { createAdminClient } from "@/lib/supabase/admin"
import { getEbookProduct } from "@/lib/ebookProducts"

export const runtime = "nodejs"

/**
 * Securely delivers a purchased ebook PDF. Access is granted ONLY when the
 * request carries a valid, purchase-issued download token. The PDF itself lives
 * in private Blob storage and is streamed through this route — its blob URL is
 * never exposed to the client.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: purchase, error } = await admin
    .from("ebook_purchases")
    .select("ebook_slug, status")
    .eq("download_token", token)
    .maybeSingle()

  if (error || !purchase || purchase.status !== "completed") {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 403 })
  }

  const product = getEbookProduct(purchase.ebook_slug)
  if (!product) {
    return NextResponse.json({ error: "Ebook not found" }, { status: 404 })
  }

  try {
    const result = await get(product.blobPathname, {
      access: "private",
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    })

    if (!result) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          "Cache-Control": "private, no-cache",
        },
      })
    }

    const fileName = `${product.slug}.pdf`
    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        ETag: result.blob.etag,
        "Cache-Control": "private, no-cache",
      },
    })
  } catch (err) {
    console.error("[v0] ebook download: failed to serve file:", err)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}

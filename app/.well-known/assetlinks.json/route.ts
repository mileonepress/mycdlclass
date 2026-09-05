import { NextResponse } from "next/server"

// Serves the Digital Asset Links file at /.well-known/assetlinks.json
// so Google Play can verify the app <-> website association for
// Android App Links / Play Console "Link app and website".
//
// Values are read from environment variables so they can be filled in
// from the Play Console without a code change:
//   ANDROID_PACKAGE_NAME          e.g. com.mycdlclass.app
//   ANDROID_SHA256_CERT_FINGERPRINTS  one or more SHA-256 fingerprints,
//                                     comma-separated (colon-separated hex)

export const dynamic = "force-dynamic"

export async function GET() {
  const packageName = process.env.ANDROID_PACKAGE_NAME ?? ""

  const fingerprints = (process.env.ANDROID_SHA256_CERT_FINGERPRINTS ?? "")
    .split(",")
    .map((fp) => fp.trim())
    .filter(Boolean)

  const statements = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName,
        sha256_cert_fingerprints: fingerprints,
      },
    },
  ]

  return NextResponse.json(statements, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}

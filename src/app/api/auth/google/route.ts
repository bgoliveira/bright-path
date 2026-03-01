import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google/oauth";

export async function GET(request: NextRequest) {
  try {
    // Get role from query parameter (set by signup page)
    const role = request.nextUrl.searchParams.get("role");

    // Force consent only for signup (when role is provided)
    // This ensures we get a refresh token for new users
    const forceConsent = !!role;

    // Pass role through OAuth state parameter
    const authUrl = getAuthUrl(role || undefined, forceConsent);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating Google auth URL:", error);
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}

import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google/oauth";

export async function GET() {
  try {
    const authUrl = getAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating Google auth URL:", error);
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getTokensFromCode,
  getUserInfo,
  encryptToken,
} from "@/lib/google/oauth";

// Use service role client for admin operations
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(new URL(`/login?error=${error}`, baseUrl));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", baseUrl));
  }

  try {
    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    // Get user info from Google
    const userInfo = await getUserInfo(tokens.access_token);

    if (!userInfo.email) {
      throw new Error("No email in user info");
    }

    const supabase = getServiceClient();

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("email", userInfo.email)
      .single();

    let userId: string;
    let userRole: string;

    if (existingProfile) {
      // Existing user - update their tokens
      userId = existingProfile.id;
      userRole = existingProfile.role;

      await supabase
        .from("profiles")
        .update({
          google_refresh_token: tokens.refresh_token
            ? encryptToken(tokens.refresh_token)
            : undefined,
          google_access_token_expires_at: tokens.expiry_date
            ? new Date(tokens.expiry_date).toISOString()
            : undefined,
          avatar_url: userInfo.picture,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    } else {
      // New user - create auth user and profile
      // Default to student role, can be changed later
      // In production, you'd handle role selection properly
      userRole = "student";

      // Create user in Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: userInfo.email,
          email_confirm: true,
          user_metadata: {
            full_name: userInfo.name,
            avatar_url: userInfo.picture,
          },
        });

      if (authError) {
        // User might already exist in auth but not in profiles
        const { data: existingAuthUser } =
          await supabase.auth.admin.listUsers();
        const foundUser = existingAuthUser.users.find(
          (u) => u.email === userInfo.email
        );

        if (foundUser) {
          userId = foundUser.id;
        } else {
          throw authError;
        }
      } else {
        userId = authData.user.id;
      }

      // Create profile
      await supabase.from("profiles").upsert({
        id: userId,
        email: userInfo.email,
        role: userRole,
        full_name: userInfo.name || userInfo.email.split("@")[0],
        avatar_url: userInfo.picture,
        google_refresh_token: tokens.refresh_token
          ? encryptToken(tokens.refresh_token)
          : null,
        google_access_token_expires_at: tokens.expiry_date
          ? new Date(tokens.expiry_date).toISOString()
          : null,
      });
    }

    // Create a session for the user
    // We'll use a simple cookie-based approach
    // In production, use Supabase's built-in session management

    // Generate a session token
    const { data: sessionData, error: sessionError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: userInfo.email,
        options: {
          redirectTo: `${baseUrl}/${userRole === "parent" ? "parent" : "student"}/dashboard`,
        },
      });

    if (sessionError) {
      console.error("Session error:", sessionError);
      // Fallback: redirect to dashboard anyway
      return NextResponse.redirect(
        new URL(
          `/${userRole === "parent" ? "parent" : "student"}/dashboard`,
          baseUrl
        )
      );
    }

    // Redirect through the magic link to establish session
    if (sessionData?.properties?.action_link) {
      return NextResponse.redirect(sessionData.properties.action_link);
    }

    // Fallback redirect
    return NextResponse.redirect(
      new URL(
        `/${userRole === "parent" ? "parent" : "student"}/dashboard`,
        baseUrl
      )
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", baseUrl)
    );
  }
}

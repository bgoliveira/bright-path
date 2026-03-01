import { google } from "googleapis";

// Google OAuth scopes needed for Classroom API
export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
  "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
  );
}

export function getAuthUrl(state?: string, forceConsent = false): string {
  const oauth2Client = getOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_SCOPES,
    ...(forceConsent && { prompt: "consent" }),
    state: state,
  });
}

export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function getUserInfo(accessToken: string) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
}

// Simple encryption for storing refresh tokens
// In production, use a proper encryption library like crypto-js
export function encryptToken(token: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    // If no encryption key, store as-is (not recommended for production)
    return token;
  }

  // Simple XOR encryption (use proper encryption in production)
  const tokenBytes = Buffer.from(token, "utf-8");
  const encrypted = Buffer.alloc(tokenBytes.length);

  for (let i = 0; i < tokenBytes.length; i++) {
    encrypted[i] = tokenBytes[i] ^ key.charCodeAt(i % key.length);
  }

  return encrypted.toString("base64");
}

export function decryptToken(encrypted: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    return encrypted;
  }

  const encryptedBytes = Buffer.from(encrypted, "base64");
  const decrypted = Buffer.alloc(encryptedBytes.length);

  for (let i = 0; i < encryptedBytes.length; i++) {
    decrypted[i] = encryptedBytes[i] ^ key.charCodeAt(i % key.length);
  }

  return decrypted.toString("utf-8");
}

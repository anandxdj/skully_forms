import { db, eq } from "@repo/database";
import { usersTable, type SelectUser } from "@repo/database/schema";
import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";
import { GetAuthenticationMethodOutputSchema } from "./model";
import crypto from "crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === verifyHash;
}

class UserService {
  public async getAuthenticationMethods(): Promise<
    ReadonlyArray<GetAuthenticationMethodOutputSchema>
  > {
    const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchema[] = [];

    const isGoogleConfigured = !!(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET);

    if (isGoogleConfigured) {
      const url = googleOAuth2Client.generateAuthUrl();
      supportedAuthenticationProviders.push({
        provider: "GOOGLE_OAUTH",
        displayName: "Google",
        displayText: "Signin with Google",
        authUrl: url,
      });
    }

    return supportedAuthenticationProviders;
  }

  public async getUserById(id: string): Promise<SelectUser | null> {
    const users = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return users[0] || null;
  }

  public async createUser(data: { email: string; fullName: string; password?: string }): Promise<SelectUser> {
    const emailLower = data.email.toLowerCase().trim();
    
    // Check email uniqueness
    const users = await db.select().from(usersTable).where(eq(usersTable.email, emailLower)).limit(1);
    if (users.length > 0) {
      throw new Error("A user with this email address already exists.");
    }

    const passwordHash = data.password ? hashPassword(data.password) : null;

    const [newUser] = await db
      .insert(usersTable)
      .values({
        email: emailLower,
        fullName: data.fullName.trim(),
        passwordHash,
      })
      .returning();

    if (!newUser) {
      throw new Error("Failed to create user account.");
    }

    return newUser;
  }

  public async authenticateUser(data: { email: string; password?: string }): Promise<SelectUser> {
    const emailLower = data.email.toLowerCase().trim();
    
    const users = await db.select().from(usersTable).where(eq(usersTable.email, emailLower)).limit(1);
    const user = users[0];
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    if (data.password) {
      if (!user.passwordHash) {
        throw new Error(
          "This account is configured for Google/Social sign in. Please use your social provider to log in."
        );
      }
      const isValid = verifyPassword(data.password, user.passwordHash);
      if (!isValid) {
        throw new Error("Invalid email or password.");
      }
    } else {
      throw new Error("Password is required for credentials login.");
    }

    return user;
  }
}

export default UserService;

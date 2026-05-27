import { db, eq } from "@repo/database";
import { usersTable, type SelectUser } from "@repo/database/schema";
import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";
import { GetAuthenticationMethodOutputSchema } from "./model";
import { hashPassword, verifyPassword, needsRehash } from "../auth/password";

// Distinct error class so the router/error-formatter can map to the right
// HTTP status without leaking the underlying DB error.
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: "INVALID_CREDENTIALS" | "OAUTH_ONLY" | "INTERNAL" = "INVALID_CREDENTIALS",
  ) {
    super(message);
    this.name = "AuthError";
  }
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

  /**
   * Create a user account. Returns `{ user, created }`:
   *   - `created: true`  → a fresh row was inserted.
   *   - `created: false` → email already existed; no row inserted, no fields touched.
   * Callers should return the same outward response in both cases so that
   * sign-up cannot be used to enumerate registered emails.
   */
  public async createUser(data: {
    email: string;
    fullName: string;
    password?: string;
  }): Promise<{ user: SelectUser; created: boolean }> {
    const emailLower = data.email.toLowerCase().trim();

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, emailLower))
      .limit(1);

    if (existing.length > 0 && existing[0]) {
      return { user: existing[0], created: false };
    }

    const passwordHash = data.password ? await hashPassword(data.password) : null;

    const [newUser] = await db
      .insert(usersTable)
      .values({
        email: emailLower,
        fullName: data.fullName.trim(),
        passwordHash,
      })
      .returning();

    if (!newUser) {
      throw new AuthError("Failed to create user account.", "INTERNAL");
    }

    return { user: newUser, created: true };
  }

  public async authenticateUser(data: { email: string; password?: string }): Promise<SelectUser> {
    const emailLower = data.email.toLowerCase().trim();

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, emailLower))
      .limit(1);
    const user = users[0];

    // To defend against user-enumeration via timing, do the same amount of
    // crypto work whether or not the row exists.
    if (!user) {
      // Dummy verify against a fixed (well-formed) hash so timing doesn't leak
      // whether the account exists.
      await verifyPassword(
        data.password ?? "",
        "scrypt$32768$8$1$00000000000000000000000000000000$" +
          "0".repeat(128),
      );
      throw new AuthError("Invalid email or password.");
    }

    if (!data.password) {
      throw new AuthError("Invalid email or password.");
    }

    if (!user.passwordHash) {
      throw new AuthError(
        "This account uses social sign-in. Please continue with your provider.",
        "OAUTH_ONLY",
      );
    }

    const ok = await verifyPassword(data.password, user.passwordHash);
    if (!ok) {
      throw new AuthError("Invalid email or password.");
    }

    // Opportunistic rehash: silently upgrade legacy / weaker hashes on
    // successful login so the user is never aware of the migration.
    if (needsRehash(user.passwordHash)) {
      try {
        const newHash = await hashPassword(data.password);
        await db
          .update(usersTable)
          .set({ passwordHash: newHash })
          .where(eq(usersTable.id, user.id));
        user.passwordHash = newHash;
      } catch {
        // Non-fatal — login still succeeds even if the rehash write fails.
      }
    }

    return user;
  }
}

export default UserService;

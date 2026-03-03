import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Credentials Provider ──────────────────────────────────────
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const normalizedEmail = credentials.email.toLowerCase();
          await dbConnect();

          const user = await User.findOne({ email: normalizedEmail });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          // If user registered via Google and hasn't set a password yet
          if (!user.password) {
            throw new Error(
              "This account uses Google sign-in. Please log in with Google, then set a password."
            );
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.user_name,
            user_name: user.user_name,
            provider: user.provider || "credentials",
            image: user.image,
            hasPassword: true,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Authentication failed");
        }
      },
    }),

    // ── Google Provider ───────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    // ── Sign-In Callback ────────────────────────────────────────
    // Runs after provider auth succeeds, before JWT is created.
    // Return true to allow sign-in, false or a URL string to deny.
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();

          const normalizedEmail = user.email?.toLowerCase();
          if (!normalizedEmail) {
            console.error("[SIGNIN] Google account has no email");
            return "/login?error=GoogleNoEmail";
          }

          const existingUser = await User.findOne({ email: normalizedEmail });

          if (existingUser) {
            // User already exists — update their Google info and allow sign-in
            // This merges accounts: even if they originally signed up with credentials,
            // they can now also use Google.
            const updateData: any = {};
            if (user.image && !existingUser.image) {
              updateData.image = user.image;
            }
            // If originally a credentials user, keep provider as-is 
            // (they already have a password)
            if (existingUser.provider === "credentials") {
              // Optionally update image from Google profile
              if (Object.keys(updateData).length > 0) {
                await User.findByIdAndUpdate(existingUser._id, updateData);
              }
            } else {
              // Google user — update image if changed
              if (user.image && user.image !== existingUser.image) {
                updateData.image = user.image;
              }
              if (Object.keys(updateData).length > 0) {
                await User.findByIdAndUpdate(existingUser._id, updateData);
              }
            }

            user.id = existingUser._id.toString();
            user.user_name = existingUser.user_name;
            user.provider = existingUser.provider;
            user.image = user.image || existingUser.image;
            // Track whether user has a password set
            (user as any).hasPassword = !!existingUser.password;
          } else {
            // First-time Google sign-in → create new user (no password)
            const newUser = await User.create({
              email: normalizedEmail,
              user_name:
                user.name || profile?.name || normalizedEmail.split("@")[0],
              provider: "google",
              image: user.image || (profile as any)?.picture,
            });

            user.id = newUser._id.toString();
            user.user_name = newUser.user_name;
            user.provider = "google";
            user.image = newUser.image;
            (user as any).hasPassword = false;
          }

          return true;
        } catch (error) {
          console.error("[SIGNIN] Google sign-in error:", error);
          return "/login?error=GoogleSignInFailed";
        }
      }

      // Credentials provider — always allow (authorize already validated)
      return true;
    },

    // ── JWT Callback ────────────────────────────────────────────
    // Called whenever a JWT is created or updated.
    // `user` is only available on initial sign-in.
    // `trigger === "update"` when client calls `update()` to refresh token.
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || user.user_name;
        token.user_name = user.user_name;
        token.provider = user.provider || account?.provider;
        token.image = user.image;
        token.hasPassword = (user as any).hasPassword ?? true;
      }

      // When client calls update() (e.g. after setting password),
      // re-check the DB to refresh the hasPassword flag.
      if (trigger === "update") {
        try {
          await dbConnect();
          const dbUser = await User.findById(token.id);
          if (dbUser) {
            token.hasPassword = !!dbUser.password;
            token.user_name = dbUser.user_name;
            token.image = dbUser.image;
          }
        } catch (error) {
          console.error("[JWT] Error refreshing token:", error);
        }
      }

      return token;
    },

    // ── Session Callback ────────────────────────────────────────
    // Called whenever a session is checked (e.g. useSession, getSession).
    // Populates session.user from the JWT token.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).user_name = token.user_name as string;
        (session.user as any).provider = token.provider as string;
        session.user.image = token.image as string;
        (session.user as any).hasPassword = token.hasPassword as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

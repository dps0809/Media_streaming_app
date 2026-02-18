import { NextAuthOptions } from "next-auth";import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { createApiResponse } from "@/types/apiresponse";


export const authOptions: NextAuthOptions = {
  providers: [
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
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        try {
          await dbConnect();
          const user = await User.findOne({
            $or: [
              { email: credentials.email },
              { user_name: credentials.user_name },
            ],
          });

          if (!user) {
            throw new Error("No user found with the given email or username");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (isPasswordValid) {
            return {
              id: user._id.toString(),
              email: user.email,
              user_name: user.user_name,
            };
          } else {
            throw new Error("Invalid password");
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.user_name = user.user_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.user_name = token.user_name as string;
      } 
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
    session:{
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, 
    },
  secret: process.env.NEXTAUTH_SECRET,
};

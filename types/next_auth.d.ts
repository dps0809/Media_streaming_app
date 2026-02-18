import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    user_name?: string;
  }
  interface Session {
    user: {
      id?: string;
      user_name?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
    user_name?: string;
  }
}

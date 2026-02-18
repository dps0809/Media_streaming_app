import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import path from "path";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token ,req}) => {
                const { pathname } = req.nextUrl;
                if (pathname.startsWith("/api/auth") || pathname.startsWith("/login") || pathname.startsWith("/signup") ) {
                    return true;
                }
               if(pathname.startsWith("/") || pathname.startsWith("/dashboard") || pathname.startsWith("/api/videos"))
                {
                return true;
                }
                return !!token;
            }
        }
    }
)

export const config = {
   matcher :[
    "/",
    "/dashboard",
    "/api/videos",
    "/api/auth/:path*",
    "/login",
    "/signup"
   ]
}
   
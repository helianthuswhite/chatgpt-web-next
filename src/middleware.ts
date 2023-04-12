import { NextRequest, NextResponse } from "next/server";
import { StaticFileExtensions, USER_TOKEN } from "@/constants";

const checkPath = (pathname: string) => {
    const dotIndex = pathname.lastIndexOf(".");
    const suffix = pathname.substring(dotIndex + 1);

    return !(
        pathname.startsWith("/_next/") ||
        StaticFileExtensions.includes(`.${suffix}`) ||
        pathname.includes("/login") ||
        pathname.includes("/register") ||
        pathname.includes("/send_code")
    );
};

export function middleware(req: NextRequest) {
    const token = req.cookies.get(USER_TOKEN)?.value;
    const { pathname } = req.nextUrl;
    const isAuthPath = checkPath(pathname);

    if (pathname === "/login" && token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (isAuthPath && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

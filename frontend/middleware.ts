import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { useAppContext } from "@/context/appContext";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    if (payload.isAuthenticated === true) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (err) {
    console.log("error", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/app/:path*"],
};

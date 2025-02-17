import { NextResponse } from 'next/server';
import { cookies } from "next/headers";

export async function middleware(req) {
const { pathname } = req.nextUrl;

const token = cookies(req).get("userSession");
    const isPublicPath = pathname==='/'

if(isPublicPath && token)
    {
    return NextResponse.redirect(new URL("/super-admin/company-master", req.url));

    }

    if(!isPublicPath && !token)
        {
        return NextResponse.redirect(new URL("/", req.url));
    
        }
}
export const config = {
  matcher: ['/', '/super-admin/company-master'], // Protect these routes
};
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";

export async function middleware(req) {
const { pathname } = req.nextUrl;

const token = cookies(req).get("userSession");
    const isPublicPath = pathname==='/'

if(isPublicPath && token)
    {
    return NextResponse.redirect(new URL("/control-pannel/company-master", req.url));

    }

    if(!isPublicPath && !token)
        {
        return NextResponse.redirect(new URL("/", req.url));
    
        }
}
export const config = {
  matcher: ['/', '/control-pannel/company-master'], // Protect these routes
};
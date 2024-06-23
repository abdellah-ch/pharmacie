// middleware.ts

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req:any) {
  const token = await getToken({ req, secret: process.env.SECRET });

  const { pathname } = req.nextUrl;

  if (!(pathname.startsWith('/signin')) && !token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }
if ((pathname.startsWith('/signin')) && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}

export const config = {
matcher: ['/','/Achats/:path*','/Inventaire/:path*','/Vente/:path*' , '/signin'], 
};

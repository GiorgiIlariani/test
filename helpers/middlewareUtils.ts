import { NextRequest, NextResponse } from 'next/server';

export const deleteMiddlewareCookie = (
  request: NextRequest,
  response: NextResponse,
  cookie: string,
) => {
  const cookies = request.headers.get('cookie');
  if (!cookies) return;
  const cookieValue = cookies?.split(';').find((c) => c.trim().startsWith(`${cookie}=`));

  if (!cookieValue) return;
  response.headers.set('Set-Cookie', `${cookieValue}; Max-Age=0`);
};

export const logoutUser = (request: NextRequest, response: NextResponse) => {
  deleteMiddlewareCookie(request, response, 'tenant-url');
  deleteMiddlewareCookie(request, response, 'end-user');
  deleteMiddlewareCookie(request, response, 'token');
};

const setMiddlewareCookie = (response: NextResponse, name: string, value: any, maxAge: number) => {
  response.cookies.set(name, value, { maxAge });
};

export const setIntendedUrl = (response: NextResponse, request: NextRequest) => {
  setMiddlewareCookie(
    response,
    'intended-url',
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    3600,
  );
};

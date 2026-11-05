import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_ROUTES_REGEX, GUEST_ROUTES_REGEX } from 'config';
import {
  deleteMiddlewareCookie,
  domainAndSubdomains,
  getUserTokenInfo,
  logoutUser,
  setIntendedUrl,
} from 'helpers';
import { deleteCookie } from 'cookies-next';

export function middleware(request: NextRequest) {
  let response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;
  const userInfo = request.cookies.get('end-user')?.value;
  const tenantUrl = request.cookies.get('tenant-url')?.value;
  const user = userInfo && JSON.parse(userInfo!.toString());
  const permissionsArray = user?.permissions;
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL;

  const isUserInMainDomain = `${protocol}://${request.headers.get('host')}` === baseUrl;

  /**
   * This logic is to redirect users to logout
   * in order to clear all cookies.
   * This is to prevent users from being stuck due to token structure change.
   */
  if (token && tenantUrl) {
    const tokenInfo = getUserTokenInfo(token)!;
    if (Object.hasOwn(tokenInfo, 'tenant_id')) {
      return NextResponse.redirect(new URL('/tmp-logout', `${protocol}://${tenantUrl}`));
    }
  }

  if (isUserInMainDomain && tenantUrl) {
    return NextResponse.redirect(new URL('/', `${protocol}://${tenantUrl}`));
  }

  if (!GUEST_ROUTES_REGEX.some((regex) => regex.test(pathname)) && token) {
    if (permissionsArray) return response;

    response = NextResponse.redirect(
      new URL(
        `/api/reset-permissions?intended_url=${Buffer.from(
          `${pathname}${request.nextUrl.search}`,
        ).toString('base64')}`,
        request.url,
      ),
    );

    deleteMiddlewareCookie(request, response, 'user');
    return response;
  } else if (!pathname.includes('employee-registration') && token)
    return NextResponse.redirect(new URL('/', request.url));

  if (token && user) return response;

  if (AUTH_ROUTES_REGEX.some((regex) => regex.test(pathname))) {
    const redirectResponse = NextResponse.redirect(new URL('/', request.url));

    logoutUser(request, redirectResponse);
    setIntendedUrl(redirectResponse, request);
    return redirectResponse;
  }

  if (
    !token &&
    !isUserInMainDomain &&
    !request.nextUrl.searchParams.get('token') &&
    pathname !== '/login'
  ) {
    deleteCookie('tenant-url', {
      domain: domainAndSubdomains,
    });
    return NextResponse.redirect(new URL('/login', baseUrl));
  }

  return response;
}

export const config = {
  unstable_allowDynamic: [
    '/node_modules/@react-pdf/pdfkit/lib/pdfkit.browser.es.js',
    '/node_modules/@react-pdf/png-js/lib/png-js.browser.es.js',
  ],
  matcher: [
    '/admin/:path',
    '/admin/:path/:path',
    '/admin/recruitment/active',
    '/admin/recruitment/rejected',
    '/employees',
    '/employee/:path/:path',
    '/employee/:path*',
    '/employee-registration/:path',
    '/add-employee',
    '/login',
    '/forgot-password',
    '/verification',
    '/verify-notice',
    '/projects',
    '/projects/:path/:path*',
    '/invoices',
    '/career-history',
    '/time-offs',
    '/traffic',
    '/welcome',
    '/',
    '/reports/income',
    '/reports/revenue',
    '/settings/configs',
    '/settings/profile',
    '/settings/organization-configs',
  ],
};

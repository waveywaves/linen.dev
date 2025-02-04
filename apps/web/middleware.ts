import { NextRequest, NextResponse } from 'next/server';
import { isSubdomainbasedRouting } from './utilities/domain';
import { getCommunityName } from './utilities/middlewareHelper';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PAGES = [
  '/signup',
  '/signin',
  '/settings',
  '/forgot-password',
  '/reset-password',
];

function isTopLevelPathname(pathname: string) {
  return (
    PAGES.includes(pathname) ||
    pathname.startsWith('/api') ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/sitemap/') ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/_next')
  );
}

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone(); // clone the request url
  const { pathname } = request.nextUrl; // get pathname of request (e.g. /blog-slug)
  const hostname = request.headers.get('host'); // get hostname of request (e.g. demo.vercel.pub)

  if (!isSubdomainbasedRouting(hostname || '')) {
    return;
  }

  //Community name is the subdomain of the request or the full url if it's a redirect
  const communityName = getCommunityName(IS_PRODUCTION, hostname);

  if (!isTopLevelPathname(pathname) && communityName !== '') {
    url.pathname = `/subdomain/${communityName}${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (PAGES.includes(pathname) && communityName !== '') {
    return NextResponse.rewrite(`https://linen.dev${pathname}`);
  }
}

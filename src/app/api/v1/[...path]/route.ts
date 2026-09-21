import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = 'https://front-lalafo-students.prolabagency.com/api/v1';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path || [];
  let pathStr = pathSegments.join('/');

  // Ensure trailing slash for Django REST framework
  if (pathStr && !pathStr.endsWith('/')) {
    pathStr += '/';
  }

  const searchParams = req.nextUrl.search || '';
  const targetUrl = `${BACKEND_BASE_URL}/${pathStr}${searchParams}`;

  // Forward necessary headers
  const forwardHeaders: Record<string, string> = {
    Accept: 'application/json, */*',
  };

  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    forwardHeaders['Authorization'] = authHeader;
  }

  const contentType = req.headers.get('content-type');
  if (contentType) {
    forwardHeaders['Content-Type'] = contentType;
  }

  const fetchOptions: RequestInit = {
    method: req.method,
    headers: forwardHeaders,
    cache: 'no-store',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // For POST/PUT/PATCH, forward body stream or arrayBuffer
    try {
      const buffer = await req.arrayBuffer();
      if (buffer.byteLength > 0) {
        fetchOptions.body = buffer;
      }
    } catch {
      // Empty body
    }
  }

  try {
    const upstreamRes = await fetch(targetUrl, fetchOptions);
    const resData = await upstreamRes.arrayBuffer();

    const resHeaders = new Headers();
    const upstreamContentType = upstreamRes.headers.get('content-type');
    if (upstreamContentType) {
      resHeaders.set('content-type', upstreamContentType);
    }

    // Explicitly allow CORS on our proxy for all local/preview origins
    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    resHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

    return new NextResponse(resData, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: resHeaders,
    });
  } catch (error: any) {
    console.error(`[Proxy Error] Failed to fetch ${targetUrl}:`, error.message);
    return NextResponse.json(
      {
        detail: `Proxy error: ${error.message}`,
        targetUrl,
      },
      {
        status: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    },
  });
}

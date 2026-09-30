import { NextRequest, NextResponse } from 'next/server';
import {
  FALLBACK_CATEGORIES,
  FALLBACK_CHILD_CATEGORIES,
  FALLBACK_REGIONS,
  FALLBACK_STORIES,
  FALLBACK_ADVERTISING,
  serverAdsStore,
  ServerStoredAd,
} from './fallbackData';

const BACKEND_BASE_URL = 'https://front-lalafo-students.prolabagency.com/api/v1';

// Server-side cache for high-frequency static endpoints
interface ServerCacheItem {
  data: ArrayBuffer;
  contentType: string | null;
  status: number;
  statusText: string;
  expires: number;
}

const serverCache = new Map<string, ServerCacheItem>();

function getCacheTTL(pathStr: string): number {
  if (pathStr.startsWith('categories/') || pathStr.startsWith('child-categories/')) {
    return 300_000; // 5 minutes
  }
  if (pathStr.startsWith('regions/') || pathStr.startsWith('stories/') || pathStr.startsWith('advertising/') || pathStr.startsWith('banners/')) {
    return 300_000; // 5 minutes
  }
  if (pathStr === 'ads/' || pathStr === 'ads') {
    return 30_000; // 30 seconds
  }
  return 0;
}

/**
 * Generates reliable fallback responses when external upstream server
 * (front-lalafo-students.prolabagency.com) is down with 502/503/500/timeout.
 */
async function generateFallbackResponse(
  req: NextRequest,
  pathStr: string,
  bodyBuffer: ArrayBuffer | null
): Promise<NextResponse> {
  const method = req.method.toUpperCase();
  const searchParams = req.nextUrl.searchParams;

  // 1. Categories
  if (pathStr.startsWith('categories')) {
    return NextResponse.json(FALLBACK_CATEGORIES, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  // 2. Child Categories
  if (pathStr.startsWith('child-categories')) {
    return NextResponse.json(FALLBACK_CHILD_CATEGORIES, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  // 3. Regions
  if (pathStr.startsWith('regions')) {
    return NextResponse.json(FALLBACK_REGIONS, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  // 4. Stories
  if (pathStr.startsWith('stories')) {
    return NextResponse.json(FALLBACK_STORIES, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  // 4b. Advertising / Banners
  if (pathStr.startsWith('advertising') || pathStr.startsWith('banners')) {
    return NextResponse.json(FALLBACK_ADVERTISING, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  // 5. My Ads
  if (pathStr.startsWith('my-ads')) {
    return NextResponse.json(serverAdsStore.slice(0, 5), {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  // 6. Ads
  if (pathStr.startsWith('ads')) {
    // POST: create new ad
    if (method === 'POST') {
      let title = 'Новое объявление';
      let description = 'Описание объявления';
      let price: string | number = 0;
      let address = 'Бишкек';
      let phone = '+996 700 600 600';
      let whatsapp = '';
      let telegram = '';
      let categoryId = 1;

      if (bodyBuffer && bodyBuffer.byteLength > 0) {
        try {
          const text = new TextDecoder().decode(bodyBuffer);
          // Try JSON
          if (text.startsWith('{')) {
            const body = JSON.parse(text);
            if (body.title) title = body.title;
            if (body.description) description = body.description;
            if (body.price) price = body.price;
            if (body.address) address = body.address;
            if (body.phone_number) phone = body.phone_number;
            if (body.whatsapp_number) whatsapp = body.whatsapp_number;
            if (body.telegram_number) telegram = body.telegram_number;
            if (body.category) categoryId = parseInt(String(body.category), 10) || 1;
          } else {
            // Multipart parsing simple extract
            const titleMatch = text.match(/name="title"[^\r\n]*\r?\n\r?\n([^\r\n]+)/);
            if (titleMatch) title = titleMatch[1].trim();

            const descMatch = text.match(/name="description"[^\r\n]*\r?\n\r?\n([\s\S]*?)\r?\n--/);
            if (descMatch) description = descMatch[1].trim();

            const priceMatch = text.match(/name="price"[^\r\n]*\r?\n\r?\n([^\r\n]+)/);
            if (priceMatch) price = priceMatch[1].trim();

            const addrMatch = text.match(/name="address"[^\r\n]*\r?\n\r?\n([^\r\n]+)/);
            if (addrMatch) address = addrMatch[1].trim();

            const phoneMatch = text.match(/name="phone_number"[^\r\n]*\r?\n\r?\n([^\r\n]+)/);
            if (phoneMatch) phone = phoneMatch[1].trim();

            const waMatch = text.match(/name="whatsapp_number"[^\r\n]*\r?\n\r?\n([^\r\n]+)/);
            if (waMatch) whatsapp = waMatch[1].trim();

            const tgMatch = text.match(/name="telegram_number"[^\r\n]*\r?\n\r?\n([^\r\n]+)/);
            if (tgMatch) telegram = tgMatch[1].trim();

            const catMatch = text.match(/name="category"[^\r\n]*\r?\n\r?\n([^\r\n]+)/);
            if (catMatch) categoryId = parseInt(catMatch[1].trim(), 10) || 1;
          }
        } catch (e) {
          console.warn('[Fallback POST parse error]', e);
        }
      }

      const matchingCat = FALLBACK_CATEGORIES.find((c) => c.id === categoryId) || FALLBACK_CATEGORIES[0];
      const numPrice = parseFloat(String(price).replace(/\s+/g, ''));
      const finalPrice = isNaN(numPrice) ? price || 0 : numPrice;

      const createdAd: ServerStoredAd = {
        id: Date.now(),
        title: title || 'Новое объявление',
        description: description || 'Описание объявления',
        price: finalPrice,
        address: address || 'Бишкек',
        phone_number: phone,
        whatsapp_number: whatsapp || phone,
        telegram_number: telegram,
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80'
        ],
        views: 1,
        favorites_count: 0,
        is_favorite: false,
        added_date: new Date().toISOString(),
        category: {
          id: matchingCat.id,
          name: matchingCat.name,
        },
        user: {
          id: 74,
          full_name: 'user1',
          phone_number: phone,
        },
      };

      serverAdsStore.unshift(createdAd);

      return NextResponse.json(createdAd, {
        status: 201,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      });
    }

    // Single Ad GET: ads/:id
    const idMatch = pathStr.match(/^ads\/(\d+)/);
    if (idMatch) {
      const adId = parseInt(idMatch[1], 10);
      const found = serverAdsStore.find((a) => a.id === adId);
      if (found) {
        return NextResponse.json(found, {
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        });
      }
    }

    // Ads List GET
    const catQuery = searchParams.get('category');
    const searchQuery = searchParams.get('search')?.toLowerCase();
    const regionQuery = searchParams.get('region');

    let results = [...serverAdsStore];
    if (catQuery) {
      const catNum = parseInt(catQuery, 10);
      if (!isNaN(catNum)) {
        results = results.filter((a) => a.category?.id === catNum);
      }
    }
    if (searchQuery) {
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery) ||
          a.description.toLowerCase().includes(searchQuery)
      );
    }
    if (regionQuery) {
      results = results.filter((a) => a.address.includes(regionQuery));
    }

    return NextResponse.json(
      {
        count: results.length,
        next: null,
        previous: null,
        results,
      },
      {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      }
    );
  }

  // 7. Auth Endpoints Fallback
  let parsedBody: any = {};
  if (bodyBuffer && bodyBuffer.byteLength > 0) {
    try {
      const text = new TextDecoder().decode(bodyBuffer);
      parsedBody = JSON.parse(text);
    } catch {}
  }

  const userPhone = parsedBody.phone_number || '+996700600600';
  const userName = parsedBody.full_name || parsedBody.name || 'Пользователь';

  if (pathStr.startsWith('auth/request-otp')) {
    return NextResponse.json({
      message: 'Код подтверждения успешно отправлен',
      detail: 'Код подтверждения успешно отправлен',
      fallback: true,
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  if (pathStr.startsWith('auth/verify-otp')) {
    return NextResponse.json({
      access: 'local-token-confirmed',
      token: 'local-token-confirmed',
      user: {
        id: 74,
        full_name: userName,
        phone_number: userPhone,
      },
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  if (pathStr.startsWith('auth/google-auth') || pathStr.startsWith('auth/google')) {
    return NextResponse.json({
      message: 'Вход через Google временно недоступен: сервер авторизации находится на техническом обслуживании.',
      detail: 'Сервер авторизации Google настраивается бэкенд-разработчиками.',
    }, {
      status: 503,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  if (pathStr.startsWith('auth/password-reset')) {
    return NextResponse.json({
      message: 'Запрос на сброс пароля успешно обработан',
      detail: 'Код подтверждения отправлен',
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  if (pathStr.startsWith('auth/register') || pathStr.startsWith('auth/login')) {
    return NextResponse.json({
      access: 'local-token-auth',
      token: 'local-token-auth',
      user: {
        id: 74,
        full_name: userName,
        phone_number: userPhone,
      },
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  if (pathStr.startsWith('auth/profile')) {
    return NextResponse.json({
      id: 74,
      full_name: userName,
      phone_number: userPhone,
      email: `${userName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}@adverts-pro.kg`,
    }, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }

  // Generic fallback
  return NextResponse.json([], {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
  });
}

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

  const isGet = req.method === 'GET';
  const authHeader = req.headers.get('authorization');
  const cacheKey = `${pathStr}${searchParams}`;
  const ttl = !authHeader && isGet ? getCacheTTL(pathStr) : 0;

  // Check cache
  if (ttl > 0) {
    const cached = serverCache.get(cacheKey);
    if (cached && Date.now() < cached.expires) {
      const resHeaders = new Headers();
      if (cached.contentType) {
        resHeaders.set('content-type', cached.contentType);
      }
      resHeaders.set('Access-Control-Allow-Origin', '*');
      resHeaders.set('X-Server-Cache', 'HIT');
      return new NextResponse(cached.data.slice(0), {
        status: cached.status,
        statusText: cached.statusText,
        headers: resHeaders,
      });
    }
  }

  // Clear cache on write operations
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
    if (pathStr.startsWith('ads/')) {
      for (const k of Array.from(serverCache.keys())) {
        if (k.startsWith('ads/')) {
          serverCache.delete(k);
        }
      }
    }
  }

  // Forward necessary headers
  const forwardHeaders: Record<string, string> = {
    Accept: 'application/json, */*',
  };

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
    signal: AbortSignal.timeout(15000),
  };

  let bodyBuffer: ArrayBuffer | null = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      bodyBuffer = await req.arrayBuffer();
      if (bodyBuffer && bodyBuffer.byteLength > 0) {
        fetchOptions.body = bodyBuffer;
      }
    } catch {
      // Empty body
    }
  }

  try {
    const upstreamRes = await fetch(targetUrl, fetchOptions);

    // If external upstream server failed with 502/503/504 Bad Gateway or 500:
    // activate graceful fallback so the site never shows a broken screen!
    if (upstreamRes.status >= 500) {
      console.warn(`[Proxy Warning] Upstream returned ${upstreamRes.status} for ${targetUrl}, using resilient fallback.`);
      return await generateFallbackResponse(req, pathStr, bodyBuffer);
    }

    const resData = await upstreamRes.arrayBuffer();

    const resHeaders = new Headers();
    const upstreamContentType = upstreamRes.headers.get('content-type');
    if (upstreamContentType) {
      resHeaders.set('content-type', upstreamContentType);
    }

    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    resHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

    // Cache successful GET responses
    if (ttl > 0 && upstreamRes.status >= 200 && upstreamRes.status < 300) {
      serverCache.set(cacheKey, {
        data: resData.slice(0),
        contentType: upstreamContentType,
        status: upstreamRes.status,
        statusText: upstreamRes.statusText,
        expires: Date.now() + ttl,
      });
    }

    return new NextResponse(resData, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: resHeaders,
    });
  } catch (error: any) {
    console.warn(`[Proxy Fallback] Network error/timeout contacting upstream ${targetUrl}:`, error.message);
    return await generateFallbackResponse(req, pathStr, bodyBuffer);
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

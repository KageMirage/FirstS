module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/src/app/api/v1/[...path]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "OPTIONS",
    ()=>OPTIONS,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const BACKEND_BASE_URL = 'https://front-lalafo-students.prolabagency.com/api/v1';
async function handleProxy(req, { params }) {
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
    const forwardHeaders = {
        Accept: 'application/json, */*'
    };
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
        forwardHeaders['Authorization'] = authHeader;
    }
    const contentType = req.headers.get('content-type');
    if (contentType) {
        forwardHeaders['Content-Type'] = contentType;
    }
    const fetchOptions = {
        method: req.method,
        headers: forwardHeaders,
        cache: 'no-store'
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        // For POST/PUT/PATCH, forward body stream or arrayBuffer
        try {
            const buffer = await req.arrayBuffer();
            if (buffer.byteLength > 0) {
                fetchOptions.body = buffer;
            }
        } catch  {
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
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](resData, {
            status: upstreamRes.status,
            statusText: upstreamRes.statusText,
            headers: resHeaders
        });
    } catch (error) {
        console.error(`[Proxy Error] Failed to fetch ${targetUrl}:`, error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            detail: `Proxy error: ${error.message}`,
            targetUrl
        }, {
            status: 502,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
async function GET(req, ctx) {
    return handleProxy(req, ctx);
}
async function POST(req, ctx) {
    return handleProxy(req, ctx);
}
async function PUT(req, ctx) {
    return handleProxy(req, ctx);
}
async function PATCH(req, ctx) {
    return handleProxy(req, ctx);
}
async function DELETE(req, ctx) {
    return handleProxy(req, ctx);
}
async function OPTIONS() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11stofp._.js.map
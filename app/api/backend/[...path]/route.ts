import { NextRequest, NextResponse } from 'next/server'

const BACKEND = (process.env.BACKEND_API_URL || 'http://localhost:4000').replace(/\/$/, '')

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  const target = `${BACKEND}/${path.join('/')}${req.nextUrl.search}`

  const headers = new Headers()
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (
      lower === 'host' ||
      lower === 'connection' ||
      lower === 'content-length' ||
      lower === 'x-forwarded-for' ||
      lower === 'x-furlo-client-ip'
    ) {
      return
    }
    headers.set(key, value)
  })

  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    undefined
  if (clientIp) {
    headers.set('x-forwarded-for', clientIp)
    headers.set('x-furlo-client-ip', clientIp)
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual',
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer()
  }

  const upstream = await fetch(target, init)
  const outHeaders = new Headers()
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (lower === 'transfer-encoding' || lower === 'content-encoding' || lower === 'set-cookie') return
    outHeaders.set(key, value)
  })

  const cookies =
    typeof upstream.headers.getSetCookie === 'function' ? upstream.headers.getSetCookie() : []
  for (const cookie of cookies) {
    outHeaders.append('set-cookie', cookie)
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}
export function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}
export function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}
export function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}
export function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}
export function OPTIONS(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}

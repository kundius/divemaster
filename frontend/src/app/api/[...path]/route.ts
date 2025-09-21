// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCookie } from 'cookies-next' // или просто через headers

const API_BASE = process.env.API_URL || 'https://api.site.com'

export async function middleware(req: NextRequest) {
  // Можно добавить глобальную проверку авторизации здесь
  return NextResponse.next()
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path)
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path, 'POST')
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path, 'PUT')
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params.path, 'DELETE')
}

async function proxyRequest(req: NextRequest, path: string[], method: string = 'GET') {
  const token = req.cookies.get('accessToken')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = `${API_BASE}/${path.join('/')}`
  const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      // Передаём другие заголовки, если нужно
      ...Object.fromEntries(req.headers.entries())
    },
    body: body ? body : undefined
  })

  // Проксируем ответ как есть
  const data = await res.text() // используем text(), чтобы не сломать JSON/стримы
  return new NextResponse(data, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/json'
    }
  })
}

// Worker that adds a tiny JSON API on top of the static Astro site.
// Everything except /api/* is served from the prebuilt ./dist assets.

import { buildPass, type PassEnv } from './pass'

interface KVNamespace {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
}

interface Env extends PassEnv {
  ATTIRE_KV: KVNamespace
  ASSETS: { fetch(request: Request): Promise<Response> }
}

// one KV key holds the whole collection as a JSON array
const KEY = 'attires'

type SavedAttire = {
  id: string
  name: string // who saved it
  colors: Record<string, string>
  createdAt: number
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })

async function readAll(env: Env): Promise<SavedAttire[]> {
  const raw = await env.ATTIRE_KV.get(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/attires') {
      // list — newest first
      if (request.method === 'GET') {
        const all = await readAll(env)
        all.sort((a, b) => b.createdAt - a.createdAt)
        return json(all)
      }

      // save a new palette
      if (request.method === 'POST') {
        let body: { name?: string; colors?: Record<string, string> }
        try {
          body = await request.json()
        } catch {
          return json({ error: 'invalid json' }, 400)
        }

        const name = (body.name ?? '').toString().trim().slice(0, 40)
        const colors = body.colors
        if (!name) return json({ error: 'name required' }, 400)
        if (!colors || typeof colors !== 'object')
          return json({ error: 'colors required' }, 400)

        const entry: SavedAttire = {
          id: crypto.randomUUID(),
          name,
          colors,
          createdAt: Date.now(),
        }

        const all = await readAll(env)
        all.push(entry)
        await env.ATTIRE_KV.put(KEY, JSON.stringify(all))
        return json(entry, 201)
      }

      // delete by id
      if (request.method === 'DELETE') {
        const id = url.searchParams.get('id')
        if (!id) return json({ error: 'id required' }, 400)
        const all = await readAll(env)
        const next = all.filter((a) => a.id !== id)
        await env.ATTIRE_KV.put(KEY, JSON.stringify(next))
        return json({ ok: true })
      }

      return json({ error: 'method not allowed' }, 405)
    }

    // ── /aqilah RSVP + Apple Wallet pass ──
    if (url.pathname === '/api/aqilah/rsvp' && request.method === 'POST') {
      let body: { name?: string }
      try {
        body = await request.json()
      } catch {
        return json({ error: 'invalid json' }, 400)
      }
      const name = (body.name ?? '').toString().trim().slice(0, 60)
      if (!name) return json({ error: 'name required' }, 400)
      const guest = { id: crypto.randomUUID(), name, createdAt: Date.now() }
      await env.ATTIRE_KV.put(`aqilah-rsvp:${guest.id}`, JSON.stringify(guest))
      return json(guest, 201)
    }

    const passMatch = url.pathname.match(/^\/api\/aqilah\/pass\/([0-9a-f-]{36})(?:\.pkpass)?$/)
    if (passMatch && request.method === 'GET') {
      const raw = await env.ATTIRE_KV.get(`aqilah-rsvp:${passMatch[1]}`)
      if (!raw) return json({ error: 'rsvp not found' }, 404)
      const guest = JSON.parse(raw) as { id: string; name: string }
      try {
        const pkpass = buildPass(env, guest)
        return new Response(pkpass as unknown as BodyInit, {
          headers: {
            'content-type': 'application/vnd.apple.pkpass',
            'content-disposition': `attachment; filename="aqilah-walimah.pkpass"`,
            'cache-control': 'no-store',
          },
        })
      } catch (err) {
        console.error('pass build failed', err)
        return json({ error: 'pass signing failed — are the PASS_* secrets set?' }, 500)
      }
    }

    // open-slide is a client-routed SPA under /slides — unknown paths
    // there (e.g. /slides/my-deck) fall back to its index page
    if (url.pathname === '/slides' || url.pathname.startsWith('/slides/')) {
      const res = await env.ASSETS.fetch(request)
      if (res.status !== 404 || url.pathname.startsWith('/slides/assets/')) return res
      return env.ASSETS.fetch(new Request(new URL('/slides', url), request))
    }

    // anything else → static site
    return env.ASSETS.fetch(request)
  },
}

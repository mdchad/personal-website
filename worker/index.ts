// Worker that adds a tiny JSON API on top of the static Astro site.
// Everything except /api/* is served from the prebuilt ./dist assets.

interface KVNamespace {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
}

interface Env {
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

    // anything else → static site
    return env.ASSETS.fetch(request)
  },
}

import { useRef, useState } from 'react'
import { ATTIRE_PATHS, VIEW_BOX } from './attire-paths'

// ── Colour model ───────────────────────────────────────────────
type Colors = {
  songkok: string // groom's hat
  groomBaju: string // groom's top (baju melayu)
  sampin: string // groom's waist wrap (samping)
  seluar: string // groom's trousers
  tudung: string // bride's hijab (head + front drape)
  veil: string // bride's flowing veil
  brideBaju: string // bride's top (baju kurung)
  kain: string // bride's skirt
}

// matches the base colours of the traced artwork (attire-piece.svg)
const DEFAULT: Colors = {
  songkok: '#0c0c0b',
  groomBaju: '#f3e5d0',
  sampin: '#eadac2',
  seluar: '#f3e4d0',
  tudung: '#f6ecdf',
  veil: '#f6ecdf',
  brideBaju: '#f3e5d0',
  kain: '#f3e4d0',
}

type Preset = { name: string; colors: Colors }

const PRESETS: Preset[] = [
  { name: 'Cream', colors: DEFAULT },
  {
    name: 'Sage & ivory',
    colors: {
      songkok: '#23291f',
      groomBaju: '#eef0e6',
      sampin: '#9bab86',
      seluar: '#eef0e6',
      tudung: '#dfe6d3',
      veil: '#dfe6d3',
      brideBaju: '#eef1e8',
      kain: '#a7b693',
    },
  },
  {
    name: 'Dusty rose',
    colors: {
      songkok: '#2a2026',
      groomBaju: '#f3e9e7',
      sampin: '#c98f96',
      seluar: '#f3e9e7',
      tudung: '#e9d4d3',
      veil: '#e9d4d3',
      brideBaju: '#f4ebe9',
      kain: '#cf9aa1',
    },
  },
  {
    name: 'Navy & gold',
    colors: {
      songkok: '#15192c',
      groomBaju: '#1f2747',
      sampin: '#c9ad6b',
      seluar: '#1f2747',
      tudung: '#e9dcc0',
      veil: '#e9dcc0',
      brideBaju: '#26305a',
      kain: '#c9ad6b',
    },
  },
  {
    name: 'Terracotta',
    colors: {
      songkok: '#2b1f1a',
      groomBaju: '#f0e2d4',
      sampin: '#c07a52',
      seluar: '#f0e2d4',
      tudung: '#ecdbc8',
      veil: '#ecdbc8',
      brideBaju: '#f1e5d8',
      kain: '#c6845c',
    },
  },
  {
    name: 'Emerald',
    colors: {
      songkok: '#14211c',
      groomBaju: '#0f3a2f',
      sampin: '#caa861',
      seluar: '#0f3a2f',
      tudung: '#e9dcc0',
      veil: '#e9dcc0',
      brideBaju: '#134438',
      kain: '#caa861',
    },
  },
]

const SWATCHES: { key: keyof Colors; label: string; group: 'groom' | 'bride' }[] = [
  { key: 'songkok', label: 'songkok', group: 'groom' },
  { key: 'groomBaju', label: 'baju melayu', group: 'groom' },
  { key: 'sampin', label: 'sampin', group: 'groom' },
  { key: 'seluar', label: 'seluar', group: 'groom' },
  { key: 'tudung', label: 'tudung', group: 'bride' },
  { key: 'veil', label: 'veil', group: 'bride' },
  { key: 'brideBaju', label: 'baju kurung', group: 'bride' },
  { key: 'kain', label: 'kain', group: 'bride' },
]

// darken a hex colour for folds/shadows
function shade(hex: string, amt: number): string {
  const h = hex.replace('#', '')
  if (h.length !== 6) return hex
  const n = parseInt(h, 16)
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt))
  const b = Math.max(0, Math.min(255, (n & 255) + amt))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// page-background colour of the artwork; also shows through the hijab's face opening
const BG = '#fdf9f6'

// The traced scarf is one continuous fabric, so the hijab and veil share paths.
// We clip the shared paths along the drawn fold line (SEAM, in viewBox space):
// everything to its right is the flowing veil, everything left is the hijab.
const SEAM =
  'M1003,58 L1010,110 L1016,170 L1021,230 L1023,270 L1005,310 L985,380 L960,460 L975,600 L940,690'
const VEIL_BOUNDARY = `${SEAM} L1145,690 L1145,58 Z`
// the veil is then lifted out and shifted into its own spot — right of the
// hijab, above the skirt — so it reads as a separate piece, not a recolour.
const VEIL_OFFSET = 'translate(130,-12)'

export default function WeddingAttire() {
  const [colors, setColors] = useState<Colors>(DEFAULT)
  const svgRef = useRef<SVGSVGElement>(null)

  const set = (key: keyof Colors, value: string) =>
    setColors((c) => ({ ...c, [key]: value }))

  const randomize = () => {
    const rnd = () =>
      '#' +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')
    setColors({
      songkok: rnd(),
      groomBaju: rnd(),
      sampin: rnd(),
      seluar: rnd(),
      tudung: rnd(),
      veil: rnd(),
      brideBaju: rnd(),
      kain: rnd(),
    })
  }

  const download = () => {
    const svg = svgRef.current
    if (!svg) return
    const data = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([data], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wedding-attire.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  const c = colors

  return (
    <div>
      {/* illustration */}
      <div
        className="rounded-xl border p-4 sm:p-6"
        style={{ background: BG, borderColor: '#e4dccb' }}
      >
        <svg
          ref={svgRef}
          viewBox={VIEW_BOX}
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          style={{ display: 'block' }}
        >
          <defs>
            {/* veil = right of the fold; hijab = the rest (even-odd cut-out) */}
            <clipPath id="attire-veil">
              <path d={VEIL_BOUNDARY} />
            </clipPath>
            <clipPath id="attire-hijab" clipRule="evenodd">
              <path d={`M70,30 H1282 V1096 H70 Z ${VEIL_BOUNDARY}`} />
            </clipPath>
          </defs>

          {/* background so the downloaded SVG matches the on-page panel */}
          <rect x="70" y="30" width="1212" height="1066" fill={BG} />
          {/* hijab + every other piece, drawn in place. tudung paths are
              clipped to the hijab side of the seam (the veil side is omitted) */}
          {ATTIRE_PATHS.map((p, i) =>
            p.piece === 'tudung' ? (
              <path key={i} d={p.d} clipPath="url(#attire-hijab)" fill={shade(c.tudung, p.shade)} />
            ) : (
              <path
                key={i}
                d={p.d}
                fill={p.piece === 'fixed' ? BG : shade(c[p.piece], p.shade)}
              />
            )
          )}

          {/* the veil: the same paths clipped to the veil side, then shifted
              out to its own spot so it stands alone as a separate piece */}
          <g transform={VEIL_OFFSET}>
            {ATTIRE_PATHS.filter((p) => p.piece === 'tudung').map((p, i) => (
              <path key={i} d={p.d} clipPath="url(#attire-veil)" fill={shade(c.veil, p.shade)} />
            ))}
          </g>
        </svg>
      </div>

      {/* presets */}
      <div className="mt-6">
        <p className="mb-2 text-fg-secondary/70 dark:text-fg-dark-secondary">// palettes</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setColors(p.colors)}
              className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 transition-colors hover:border-hotpink"
              style={{ borderColor: '#e4dccb' }}
            >
              <span className="flex">
                {[p.colors.sampin, p.colors.kain, p.colors.tudung].map((col, i) => (
                  <span
                    key={i}
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ background: col, marginLeft: i ? -5 : 0, border: '1px solid #00000018' }}
                  />
                ))}
              </span>
              <span className="text-xs">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* individual colour pickers */}
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
        {(['groom', 'bride'] as const).map((group) => (
          <div key={group}>
            <p className="mb-2 text-fg-secondary/70 dark:text-fg-dark-secondary">
              // {group === 'groom' ? 'pengantin lelaki' : 'pengantin perempuan'}
            </p>
            {SWATCHES.filter((s) => s.group === group).map((s) => (
              <label
                key={s.key}
                className="flex cursor-pointer items-center justify-between border-b py-2"
                style={{ borderColor: '#00000010' }}
              >
                <span>{s.label}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-fg-secondary/50 dark:text-fg-dark-secondary uppercase">
                    {colors[s.key]}
                  </span>
                  <span
                    className="relative inline-block h-7 w-9 rounded-md border"
                    style={{ background: colors[s.key], borderColor: '#00000020' }}
                  >
                    <input
                      type="color"
                      value={colors[s.key]}
                      onChange={(e) => set(s.key, e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </span>
                </span>
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={randomize}
          className="rounded-md border px-3 py-1.5 transition-colors hover:border-hotpink hover:text-hotpink"
          style={{ borderColor: '#e4dccb' }}
        >
          randomize
        </button>
        <button
          onClick={() => setColors(DEFAULT)}
          className="rounded-md border px-3 py-1.5 transition-colors hover:border-hotpink hover:text-hotpink"
          style={{ borderColor: '#e4dccb' }}
        >
          reset
        </button>
        <button
          onClick={download}
          className="rounded-md border px-3 py-1.5 transition-colors hover:border-hotpink hover:text-hotpink"
          style={{ borderColor: '#e4dccb' }}
        >
          download svg
        </button>
      </div>
    </div>
  )
}

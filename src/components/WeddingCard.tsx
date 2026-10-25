// Walimatul urus invitation card. Rendered as one SVG (viewBox 500×700) so the
// whole card — frame, florals and type — scales together at any width.

const INK = '#6b7354' // olive text
const GOLD = '#ecdfac' // frame lines
const PAPER = '#f8f5ec'
const LEAF = '#7f977b'
const LEAF_DARK = '#5f7a66'
const STEM = '#8ea07f'

// ── Botanicals ─────────────────────────────────────────────────
type Bloom = { x: number; y: number; r: number; rot?: number }

// layered rings of petals, outermost first
function Peony({ x, y, r, rot = 0 }: Bloom) {
  const rings = [
    { n: 9, d: 0.52, rx: 0.55, ry: 0.42, fill: 'url(#petal-light)' },
    { n: 7, d: 0.32, rx: 0.42, ry: 0.32, fill: 'url(#petal-mid)' },
    { n: 5, d: 0.14, rx: 0.3, ry: 0.22, fill: 'url(#petal-deep)' },
  ]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#watercolor)">
      {rings.map((ring, i) =>
        Array.from({ length: ring.n }, (_, j) => {
          const a = (360 / ring.n) * j + i * 17
          return (
            <ellipse
              key={`${i}-${j}`}
              cx={r * ring.d}
              cy={0}
              rx={r * ring.rx}
              ry={r * ring.ry}
              transform={`rotate(${a})`}
              fill={ring.fill}
              stroke="#e39aaa"
              strokeOpacity={0.35}
              strokeWidth={0.6}
            />
          )
        }),
      )}
      <circle r={r * 0.1} fill="#d9788f" opacity={0.7} />
    </g>
  )
}

// tighter, cupped bloom with a swirl of inner arcs
function Rose({ x, y, r, rot = 0 }: Bloom) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#watercolor)">
      {Array.from({ length: 7 }, (_, j) => (
        <ellipse
          key={j}
          cx={r * 0.42}
          rx={r * 0.5}
          ry={r * 0.42}
          transform={`rotate(${(360 / 7) * j})`}
          fill="url(#petal-light)"
          stroke="#e39aaa"
          strokeOpacity={0.35}
          strokeWidth={0.6}
        />
      ))}
      <circle r={r * 0.55} fill="url(#petal-mid)" />
      {[0.42, 0.3, 0.18].map((k, i) => (
        <path
          key={k}
          d={`M ${-r * k} 0 A ${r * k} ${r * k} 0 1 1 ${r * k * 0.6} ${r * k * 0.8}`}
          transform={`rotate(${i * 70})`}
          fill="none"
          stroke="#d27088"
          strokeOpacity={0.55}
          strokeWidth={1}
        />
      ))}
    </g>
  )
}

function Bud({ x, y, r, rot = 0 }: Bloom) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <ellipse rx={r * 0.75} ry={r} fill="url(#petal-deep)" />
      <path d={`M ${-r * 0.7} ${r * 0.3} Q 0 ${r * 1.6} ${r * 0.7} ${r * 0.3}`} fill={LEAF} opacity={0.85} />
    </g>
  )
}

// a leaf whose base sits at (x, y), pointing along `rot` degrees
function Leaf({ x, y, len, rot, dark = false }: { x: number; y: number; len: number; rot: number; dark?: boolean }) {
  const w = len * 0.28
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={0.88}>
      <path
        d={`M 0 0 C ${len * 0.3} ${-w}, ${len * 0.7} ${-w}, ${len} 0 C ${len * 0.7} ${w}, ${len * 0.3} ${w}, 0 0 Z`}
        fill={dark ? LEAF_DARK : LEAF}
      />
      <path d={`M 0 0 L ${len * 0.92} 0`} stroke={PAPER} strokeOpacity={0.45} strokeWidth={0.7} />
    </g>
  )
}

function Stem({ d }: { d: string }) {
  return <path d={d} fill="none" stroke={STEM} strokeWidth={1.4} strokeLinecap="round" />
}

function Sprig({ points }: { points: [number, number, number][] }) {
  return (
    <>
      {points.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#f2b8c3' : '#e994a8'} opacity={0.85} />
      ))}
    </>
  )
}

// ── Frame ──────────────────────────────────────────────────────
// double gold rule with small interlocking squares at each corner
function Frame() {
  const outer = 26
  const inner = 33
  const sq = 15
  const corners: [number, number][] = [
    [outer - sq + 4, outer - sq + 4],
    [500 - outer - 4, outer - sq + 4],
    [outer - sq + 4, 700 - outer - 4],
    [500 - outer - 4, 700 - outer - 4],
  ]
  return (
    <g fill="none" stroke={GOLD} strokeWidth={1.6}>
      <rect x={outer} y={outer} width={500 - outer * 2} height={700 - outer * 2} />
      <rect x={inner} y={inner} width={500 - inner * 2} height={700 - inner * 2} />
      {corners.map(([cx, cy], i) => (
        <g key={i}>
          <rect x={cx} y={cy} width={sq} height={sq} />
          <rect x={cx + 3} y={cy + 3} width={sq - 6} height={sq - 6} />
        </g>
      ))}
    </g>
  )
}

// ── Card ───────────────────────────────────────────────────────
export default function WeddingCard() {
  return (
    <svg
      viewBox="0 0 500 700"
      role="img"
      aria-labelledby="card-title"
      className="block h-auto w-full"
      style={{ background: PAPER }}
    >
      <title id="card-title">Walimatul Urus — Irsyad &amp; 'Aqilah — 30 May 2027 — #QilsLoveAtFirstSyad</title>
      <defs>
        <radialGradient id="petal-light" cx="35%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="60%" stopColor="#f8cdd4" />
          <stop offset="100%" stopColor="#f0aebb" />
        </radialGradient>
        <radialGradient id="petal-mid" cx="40%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#fde3e6" />
          <stop offset="100%" stopColor="#eb9fb0" />
        </radialGradient>
        <radialGradient id="petal-deep" cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#f6bfc9" />
          <stop offset="100%" stopColor="#d9708a" />
        </radialGradient>
        <filter id="watercolor" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="3.5" />
        </filter>
        <path id="arc" d="M 150 196 A 190 190 0 0 1 350 196" />
      </defs>

      <Frame />

      {/* top-left cluster */}
      <g>
        <Stem d="M 60 120 C 110 70, 170 40, 250 20" />
        <Leaf x={150} y={52} len={40} rot={-40} />
        <Leaf x={185} y={40} len={36} rot={10} dark />
        <Leaf x={215} y={30} len={34} rot={-30} />
        <Leaf x={235} y={24} len={30} rot={15} dark />
        <Stem d="M 40 150 C 30 220, 40 270, 60 320" />
        <Leaf x={36} y={210} len={48} rot={75} dark />
        <Leaf x={42} y={250} len={44} rot={55} />
        <Leaf x={50} y={280} len={40} rot={95} dark />
        <Leaf x={30} y={185} len={36} rot={115} />
        <Peony x={25} y={150} r={30} rot={20} />
        <Peony x={95} y={28} r={40} rot={10} />
        <Peony x={30} y={55} r={52} />
        <Peony x={110} y={110} r={44} rot={35} />
        <Bud x={140} y={160} r={9} rot={-20} />
        <Bud x={62} y={185} r={8} rot={10} />
        <Rose x={110} y={192} r={18} rot={40} />
        <Rose x={150} y={88} r={14} rot={-30} />
      </g>

      {/* top-right sprig */}
      <g>
        <Stem d="M 500 70 C 480 120, 470 170, 478 230" />
        <Leaf x={488} y={110} len={30} rot={200} />
        <Leaf x={477} y={150} len={34} rot={160} dark />
        <Leaf x={474} y={190} len={30} rot={210} />
        <Leaf x={478} y={215} len={26} rot={20} dark />
        <Sprig points={[[492, 90, 4], [484, 125, 5], [490, 135, 3.5], [472, 165, 4.5], [481, 175, 3.5], [470, 205, 4], [488, 200, 3]]} />
      </g>

      {/* bottom-left sprig */}
      <g>
        <Stem d="M 0 640 C 20 590, 25 530, 18 470" />
        <Leaf x={15} y={600} len={30} rot={-30} dark />
        <Leaf x={20} y={560} len={28} rot={-150} />
        <Leaf x={22} y={520} len={26} rot={-40} />
        <Leaf x={8} y={630} len={30} rot={-5} dark />
        <Sprig points={[[18, 470, 4], [24, 488, 5], [12, 500, 4], [26, 515, 3.5], [14, 540, 4.5], [27, 555, 3], [10, 580, 3.5]]} />
      </g>

      {/* bottom-right cluster */}
      <g>
        <Stem d="M 470 470 C 460 540, 450 580, 440 620" />
        <Stem d="M 260 690 C 310 660, 360 640, 410 630" />
        <Leaf x={470} y={470} len={40} rot={-80} />
        <Leaf x={465} y={500} len={44} rot={-30} dark />
        <Leaf x={458} y={530} len={40} rot={-130} />
        <Leaf x={300} y={672} len={44} rot={-160} dark />
        <Leaf x={330} y={655} len={40} rot={-120} />
        <Leaf x={355} y={645} len={36} rot={-170} />
        <Leaf x={410} y={575} len={34} rot={-140} dark />
        <Rose x={480} y={570} r={30} rot={10} />
        <Rose x={330} y={688} r={18} rot={70} />
        <Rose x={385} y={640} r={28} rot={-15} />
        <Rose x={470} y={665} r={34} rot={30} />
        <Peony x={432} y={612} r={42} rot={15} />
        <Bud x={405} y={590} r={8} rot={-30} />
        <Bud x={455} y={545} r={7} rot={20} />
        <Bud x={360} y={612} r={7} rot={-50} />
      </g>

      {/* type */}
      <g fill={INK} textAnchor="middle">
        <text fontFamily="'Cormorant Garamond', serif" fontWeight={600} fontSize={19} letterSpacing={3}>
          <textPath href="#arc" startOffset="50%">
            WALIMATUL URUS
          </textPath>
        </text>

        <g fontFamily="'Pinyon Script', cursive">
          <text x={221} y={340} fontSize={170}>I</text>
          <text x={251} y={370} fontSize={130}>A</text>
        </g>

        <text x={250} y={428} fontFamily="'Berkshire Swash', cursive" fontSize={30}>
          Irsyad &amp; ‘Aqilah
        </text>

        <g fontFamily="'Cormorant Garamond', serif" fontWeight={600} fontSize={20} letterSpacing={4} style={{ fontVariantNumeric: 'lining-nums' }}>
          <text x={166.6} y={520}>30</text>
          <text x={239.2} y={520}>MAY</text>
          <text x={324.6} y={520}>2027</text>
        </g>
        <g stroke={INK} strokeWidth={1}>
          <line x1={194} y1={502} x2={194} y2={524} />
          <line x1={280.4} y1={502} x2={280.4} y2={524} />
        </g>

        <text x={250} y={606} fontFamily="'Cormorant Garamond', serif" fontWeight={600} fontSize={11} letterSpacing={1.5}>
          #QilsLoveAtFirstSyad
        </text>
      </g>
    </svg>
  )
}

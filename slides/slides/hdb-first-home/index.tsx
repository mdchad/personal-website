import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { type CSSProperties, type ReactNode, useState } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#f8edda', text: '#4a3430', accent: '#cd6a4e' },
  fonts: {
    display: '"Londrina Solid", "Arial Narrow", Impact, sans-serif',
    body: '"Mali", "Comic Neue", "Segoe UI", system-ui, sans-serif',
  },
  typeScale: { hero: 220, body: 34 },
  radius: 36,
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@400;900&family=Mali:wght@400;500;600;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-hdb-first-home';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

// "teal" is the sage green from the template — kept as the name used across pages.
const teal = '#6f9c7e';
const muted = '#8a6e62';
const line = '#ecdcc3';
const card = '#fffaf2';
const tan = '#d6b89a';
const sky = '#a9cbe8';
const mint = '#a7d1b6';

/* ---------- Template decor: blobs, squiggle, sparkles, flat illustrations ---------- */

const Blob = ({ style, w = 640 }: { style: CSSProperties; w?: number }) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 600 600"
    style={{ position: 'absolute', zIndex: -1, ...style }}
  >
    <path
      d="M420 40 C540 90 600 230 560 360 C520 500 380 590 240 560 C110 530 20 430 30 290 C40 150 140 60 260 30 C320 15 370 20 420 40Z"
      fill={card}
    />
  </svg>
);

const Squiggle = ({ style }: { style: CSSProperties }) => (
  <svg
    width="380"
    height="260"
    viewBox="0 0 380 260"
    fill="none"
    style={{ position: 'absolute', zIndex: -1, ...style }}
  >
    <path
      d="M20 -10 C40 50 110 50 140 90 S150 190 230 205 S340 200 400 215"
      stroke={tan}
      strokeWidth="14"
      strokeLinecap="round"
    />
  </svg>
);

const Sparkle = ({ x, y, s = 80 }: { x: number; y: number; s?: number }) => (
  <svg
    width={s}
    height={s}
    viewBox="-50 -50 100 100"
    fill="none"
    style={{ position: 'absolute', left: x, top: y, zIndex: -1 }}
  >
    <path
      d="M0 -46 C5 -10 10 -5 46 0 C10 5 5 10 0 46 C-5 10 -10 5 -46 0 C-10 -5 -5 -10 0 -46Z"
      stroke="#7a5a45"
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

const HdbBlock = ({ style, w = 300 }: { style: CSSProperties; w?: number }) => (
  <svg width={w} height={w * 1.4} viewBox="0 0 300 420" style={{ position: 'absolute', ...style }}>
    <rect x="70" y="70" width="170" height="330" rx="12" fill="#f3dcc2" />
    <rect x="58" y="52" width="194" height="34" rx="10" fill="var(--osd-accent)" />
    {Array.from({ length: 18 }, (_, i) => (
      <rect
        key={i}
        x={92 + (i % 3) * 46}
        y={106 + Math.floor(i / 3) * 44}
        width="32"
        height="26"
        rx="6"
        fill={sky}
      />
    ))}
    <rect x="135" y="360" width="40" height="40" rx="8" fill={teal} />
    <rect x="252" y="330" width="10" height="70" rx="5" fill="#9b7458" />
    <circle cx="257" cy="318" r="34" fill={mint} />
    <rect x="30" y="398" width="250" height="10" rx="5" fill={tan} />
  </svg>
);

const HouseKey = ({ style, w = 260 }: { style: CSSProperties; w?: number }) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 260 260"
    style={{ position: 'absolute', transform: 'rotate(-30deg)', ...style }}
  >
    <circle cx="70" cy="130" r="50" fill="none" stroke="var(--osd-accent)" strokeWidth="26" />
    <rect x="115" y="117" width="130" height="26" rx="13" fill={sky} />
    <rect x="200" y="135" width="20" height="40" rx="6" fill={sky} />
    <rect x="168" y="135" width="18" height="28" rx="6" fill={sky} />
  </svg>
);

const Coins = ({ style, w = 260 }: { style: CSSProperties; w?: number }) => (
  <svg width={w} height={w} viewBox="0 0 260 260" style={{ position: 'absolute', ...style }}>
    <ellipse cx="110" cy="210" rx="80" ry="26" fill="#5e8a6c" />
    <rect x="30" y="180" width="160" height="30" fill={teal} />
    <ellipse cx="110" cy="180" rx="80" ry="26" fill={mint} />
    <ellipse cx="120" cy="160" rx="80" ry="26" fill="#5e8a6c" />
    <rect x="40" y="130" width="160" height="30" fill={teal} />
    <ellipse cx="120" cy="130" rx="80" ry="26" fill={mint} />
    <circle cx="190" cy="70" r="52" fill="var(--osd-accent)" />
    <text
      x="190"
      y="92"
      textAnchor="middle"
      fontSize="64"
      fontFamily="Londrina Solid, sans-serif"
      fill={card}
    >
      $
    </text>
  </svg>
);

const Letter = ({ style, w = 240 }: { style: CSSProperties; w?: number }) => (
  <svg
    width={w}
    height={w * 1.2}
    viewBox="0 0 240 288"
    style={{ position: 'absolute', transform: 'rotate(8deg)', ...style }}
  >
    <rect x="20" y="20" width="180" height="240" rx="16" fill={card} />
    <rect x="50" y="64" width="120" height="14" rx="7" fill={tan} />
    <rect x="50" y="98" width="100" height="12" rx="6" fill={line} />
    <rect x="50" y="124" width="120" height="12" rx="6" fill={line} />
    <rect x="50" y="150" width="80" height="12" rx="6" fill={line} />
    <circle cx="170" cy="222" r="44" fill={teal} />
    <path
      d="M150 222 L165 237 L192 207"
      fill="none"
      stroke={card}
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];

export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const fill = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  position: 'relative',
  boxSizing: 'border-box',
  isolation: 'isolate', // lets zIndex:-1 decor sit above the bg but under content
  overflow: 'hidden', // decor shapes bleed off the canvas edge by design
} as const;

const page = { ...fill, padding: '110px 140px' } as const;

const Heading = ({ children }: { children: ReactNode }) => (
  <h2
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 100,
      fontWeight: 400,
      lineHeight: 1,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      margin: 0,
    }}
  >
    {children}
  </h2>
);

const Footnote = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: 140,
      right: 140,
      bottom: 60,
      fontSize: 22,
      color: muted,
    }}
  >
    {children}
  </div>
);

/* ---------- 1. Cover ---------- */

const Cover: Page = () => (
  <div
    style={{
      ...fill,
      padding: '0 140px 0 780px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Blob w={1100} style={{ left: -330, top: 150 }} />
    <Squiggle style={{ right: 0, top: 0 }} />
    <HdbBlock w={380} style={{ left: 150, top: 330 }} />
    <HouseKey w={280} style={{ left: 500, top: 720 }} />
    <Sparkle x={590} y={300} s={110} />
    <Sparkle x={690} y={420} s={60} />
    <Sparkle x={640} y={520} s={80} />
    <h1
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 400,
        lineHeight: 0.95,
        textTransform: 'uppercase',
        textAlign: 'center',
        margin: '0 0 56px',
      }}
    >
      Our first <span style={{ color: 'var(--osd-accent)' }}>home</span>
    </h1>
    <div
      style={{
        background: teal,
        color: card,
        borderRadius: 64,
        padding: '52px 64px',
        fontSize: 38,
        lineHeight: 1.5,
        letterSpacing: '0.03em',
        textAlign: 'center',
        maxWidth: 860,
      }}
    >
      HFE letter, the maximum HDB loan, and which flats get us there — for a couple aged{' '}
      <b>33</b> &amp; <b>26</b>.
    </div>
  </div>
);

/* ---------- 2. HFE letter ---------- */

const TimelineStep = ({ n, title, sub }: { n: string; title: string; sub: string }) => (
  <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
    <div
      style={{
        width: 56,
        height: 56,
        flex: 'none',
        borderRadius: 28,
        background: teal,
        color: card,
        fontSize: 26,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div>
      <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.3 }}>{title}</div>
      <div style={{ fontSize: 26, color: muted, lineHeight: 1.4, marginTop: 4 }}>{sub}</div>
    </div>
  </div>
);

const Hfe: Page = () => (
  <div className="hdb-deck" style={page}>
    <Squiggle style={{ right: 0, top: 0 }} />
    <Blob w={760} style={{ left: -300, bottom: -420 }} />
    <Letter w={200} style={{ left: 1480, top: 740 }} />
    <Sparkle x={1390} y={770} s={70} />
    <Sparkle x={1720} y={720} s={50} />
    <Heading>The HFE letter comes first</Heading>
    <div style={{ display: 'flex', gap: 96, marginTop: 64 }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.5, margin: 0 }}>
          <b>HDB Flat Eligibility</b> — one assessment that tells us three things:
        </p>
        <ul
          style={{
            fontSize: 'var(--osd-size-body)',
            lineHeight: 1.5,
            margin: '24px 0 0',
            paddingLeft: 40,
            listStyle: 'disc',
          }}
        >
          <li>Can we buy a new or resale flat?</li>
          <li>Which CPF housing grants, and how much</li>
          <li>Whether we get an HDB loan, and how much</li>
        </ul>
        <p style={{ fontSize: 30, lineHeight: 1.5, color: muted, margin: '40px 0 0' }}>
          Needed <b style={{ color: 'var(--osd-text)' }}>before</b> a BTO application or a resale
          OTP. Free. Valid <b style={{ color: 'var(--osd-accent)' }}>9 months</b> — can’t extend,
          only reapply.
        </p>
      </div>
      <div
        style={{
          width: 700,
          flex: 'none',
          background: card,
          borderRadius: 'var(--osd-radius)',
          padding: '44px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
        }}
      >
        <TimelineStep n="1" title="Preliminary HFE check" sub="HDB Flat Portal · Singpass" />
        <TimelineStep n="2" title="Submit HFE within 30 days" sub="Choose HDB loan · Myinfo income" />
        <TimelineStep n="3" title="Letter in ~1 month" sub="Longer around BTO launches" />
      </div>
    </div>
    <Footnote>
      Job, income or property status changes? Redo the preliminary check. Source: CPF / mynicehome.gov.sg
    </Footnote>
  </div>
);

/* ---------- 2b. HFE journey timeline ---------- */

const SPINE_Y = 620;
const HDB_Y = 405;
const BANK_Y = 835;

const StepCard = ({
  n,
  x,
  w,
  title,
  sub,
  final,
}: {
  n: string;
  x: number;
  w: number;
  title: string;
  sub: string;
  final?: boolean;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: SPINE_Y,
      width: w,
      transform: 'translateY(-50%)',
      background: final ? teal : card,
      color: final ? card : 'var(--osd-text)',
      border: `2px solid ${final ? teal : line}`,
      borderRadius: 'var(--osd-radius)',
      padding: '28px 28px 30px',
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        background: final ? card : teal,
        color: final ? teal : card,
        fontSize: 24,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.25, marginTop: 18 }}>{title}</div>
    <div
      style={{
        fontSize: 22,
        lineHeight: 1.4,
        marginTop: 10,
        color: final ? 'rgba(251,247,240,.8)' : muted,
      }}
    >
      {sub}
    </div>
  </div>
);

const LaneCard = ({
  y,
  color,
  tag,
  children,
}: {
  y: number;
  color: string;
  tag: string;
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 460,
      top: y,
      width: 480,
      transform: 'translateY(-50%)',
      background: card,
      borderLeft: `10px solid ${color}`,
      borderRadius: 'var(--osd-radius)',
      padding: '28px 32px 30px',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{tag}</div>
    <ul
      style={{
        fontSize: 24,
        lineHeight: 1.45,
        margin: '12px 0 0',
        paddingLeft: 28,
        listStyle: 'disc',
      }}
    >
      {children}
    </ul>
  </div>
);

const Journey: Page = () => (
  <div className="hdb-deck" style={page}>
    <Squiggle style={{ right: 0, top: 0 }} />
    <Blob w={700} style={{ left: -320, top: -300 }} />
    <Sparkle x={1580} y={330} s={70} />
    <Sparkle x={1680} y={390} s={46} />
    <Heading>Our HFE journey</Heading>

    {/* Connectors: fork after step 1, merge into step 3, then straight spine. */}
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      fill="none"
      style={{ position: 'absolute', inset: 0 }}
    >
      <g strokeWidth="6" strokeLinecap="round">
        <path d={`M400 ${SPINE_Y} C440 ${SPINE_Y} 420 ${HDB_Y} 460 ${HDB_Y}`} stroke={teal} />
        <path
          d={`M400 ${SPINE_Y} C440 ${SPINE_Y} 420 ${BANK_Y} 460 ${BANK_Y}`}
          stroke="var(--osd-accent)"
        />
        <path d={`M940 ${HDB_Y} C975 ${HDB_Y} 955 ${SPINE_Y} 990 ${SPINE_Y}`} stroke={teal} />
        <path
          d={`M940 ${BANK_Y} C975 ${BANK_Y} 955 ${SPINE_Y} 990 ${SPINE_Y}`}
          stroke="var(--osd-accent)"
        />
        <path d={`M1210 ${SPINE_Y} H1240 M1480 ${SPINE_Y} H1520`} stroke={muted} />
      </g>
    </svg>

    <StepCard
      n="1"
      x={140}
      w={260}
      title="Preliminary HFE check"
      sub="HDB Flat Portal · Singpass · household, income, property"
    />

    <LaneCard y={HDB_Y} color={teal} tag="2 · HDB loan">
      <li>Pick HDB loan in the HFE</li>
      <li>HDB sets our loan amount</li>
      <li>Income ≤ $16k · 2.6% interest</li>
      <li>Up to 25 yrs · 75% LTV</li>
    </LaneCard>

    <LaneCard y={BANK_Y} color="var(--osd-accent)" tag="2 · Bank (FI) loan">
      <li>Get bank In-Principle Approval</li>
      <li>No $16k ceiling · rates float</li>
      <li>Up to 30 yrs · 75% LTV</li>
      <li>No switching back to HDB loan</li>
    </LaneCard>

    <StepCard
      n="3"
      x={990}
      w={220}
      title="Submit HFE"
      sub="Within 30 days · both verify via Singpass"
    />
    <StepCard
      n="4"
      x={1240}
      w={240}
      title="HFE letter"
      sub="~1 month · valid 9 months, no extension"
    />
    <StepCard
      n="5"
      x={1520}
      w={260}
      title="Buy"
      sub="Apply for BTO, or get a resale OTP"
      final
    />
  </div>
);

/* ---------- 3. HDB loan rules ---------- */

const Stat = ({ value, label, note }: { value: string; label: string; note: string }) => (
  <div
    style={{
      flex: 1,
      background: card,
      borderRadius: 'var(--osd-radius)',
      padding: '40px 40px 36px',
    }}
  >
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 96,
        fontWeight: 400,
        lineHeight: 1,
        color: 'var(--osd-accent)',
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 30, fontWeight: 600, marginTop: 24 }}>{label}</div>
    <div style={{ fontSize: 24, color: muted, marginTop: 8, lineHeight: 1.4 }}>{note}</div>
  </div>
);

const Loan: Page = () => (
  <div className="hdb-deck" style={page}>
    <Squiggle style={{ right: 0, top: 0 }} />
    <Blob w={720} style={{ right: -180, bottom: -300 }} />
    <Coins w={250} style={{ left: 1480, top: 700 }} />
    <Sparkle x={1400} y={720} s={60} />
    <Heading>The numbers that cap our loan</Heading>
    <div style={{ display: 'flex', gap: 32, marginTop: 64 }}>
      <Stat value="75%" label="Loan-to-value" note="Of price (resale: lower of price or valuation)" />
      <Stat value="2.6%" label="Interest rate" note="CPF OA rate + 0.1%, reviewed quarterly" />
      <Stat value="30%" label="Mortgage servicing" note="Max share of gross monthly income" />
      <Stat value="25 yrs" label="Max tenure" note="Shortest of 25, 65 − avg age, or lease − 20" />
    </div>
    <ul
      style={{
        fontSize: 'var(--osd-size-body)',
        lineHeight: 1.5,
        margin: '56px 0 0',
        paddingLeft: 40,
            listStyle: 'disc',
      }}
    >
      <li>
        Household income ≤ <b style={{ color: teal }}>$16,000</b>/month (raised from $14k, Aug 2026)
      </li>
      <li>At least one of us employed at HFE and at loan disbursement</li>
      <li>No private property now, or sold in the last 30 months</li>
    </ul>
    <Footnote>
      CPF OA savings go in first — each of us may keep up to $20,000. Source: mynicehome.gov.sg
    </Footnote>
  </div>
);

/* ---------- 4. Our eligible flats ---------- */

const Check = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
    <span
      style={{
        fontSize: 34,
        fontWeight: 700,
        width: 36,
        flex: 'none',
        color: ok ? teal : 'var(--osd-accent)',
      }}
    >
      {ok ? '✓' : '✕'}
    </span>
    <span style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.45 }}>{children}</span>
  </div>
);

const Flats: Page = () => (
  <div className="hdb-deck" style={page}>
    <Squiggle style={{ right: 0, top: 0 }} />
    <Blob w={860} style={{ left: -260, top: 220 }} />
    <HdbBlock w={200} style={{ left: 420, top: 660 }} />
    <Sparkle x={600} y={330} s={90} />
    <Sparkle x={660} y={450} s={54} />
    <Heading>Lease must last till age 95</Heading>
    <div style={{ display: 'flex', gap: 100, marginTop: 60, alignItems: 'center' }}>
      <div style={{ width: 560, flex: 'none' }}>
        <div
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 280,
            fontWeight: 400,
            lineHeight: 0.9,
            color: 'var(--osd-accent)',
          }}
        >
          69
        </div>
        <div style={{ fontSize: 34, fontWeight: 600, marginTop: 24 }}>
          years of lease left, minimum
        </div>
        <div style={{ fontSize: 30, color: muted, marginTop: 12 }}>95 − 26 (youngest) = 69</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Check ok>
          <b>Any BTO</b> — fresh 99-year lease
        </Check>
        <Check ok>
          <b>Resale</b> with lease starting <b>1996 or later</b>
        </Check>
        <Check ok>
          Tenure: 65 − avg age 29.5 = 35.5 → full <b>25 yrs</b>
        </Check>
        <Check ok={false}>Under 69 yrs left: loan &amp; CPF use pro-rated</Check>
        <Check ok={false}>20 yrs or less left: no HDB loan at all</Check>
      </div>
    </div>
    <Footnote>
      Check the exact lease commencement date before an OTP — remaining lease is counted at flat
      application.
    </Footnote>
  </div>
);

/* ---------- 4b. Interactive lease checker ---------- */

const APPLY_YEAR = 2026;
const BAR_W = 1640;
const BAR_MIN_AGE = 20;
const BAR_MAX_AGE = 110;
const ageX = (a: number) =>
  ((Math.min(Math.max(a, BAR_MIN_AGE), BAR_MAX_AGE) - BAR_MIN_AGE) / (BAR_MAX_AGE - BAR_MIN_AGE)) *
  BAR_W;

const sliderCss = `
.hdb-range { -webkit-appearance: none; appearance: none; width: 100%; height: 56px; background: transparent; cursor: pointer; margin: 0; }
.hdb-range::-webkit-slider-runnable-track { height: 12px; border-radius: 6px; background: ${line}; }
.hdb-range::-moz-range-track { height: 12px; border-radius: 6px; background: ${line}; }
.hdb-range::-webkit-slider-thumb { -webkit-appearance: none; width: 44px; height: 44px; margin-top: -16px; border-radius: 50%; background: ${teal}; border: 6px solid ${card}; box-shadow: 0 2px 8px rgba(42,36,32,.25); }
.hdb-range::-moz-range-thumb { width: 32px; height: 32px; border-radius: 50%; background: ${teal}; border: 6px solid ${card}; }
`;

const Slider = ({
  label,
  value,
  display,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) => (
  <div data-osd-interactive>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 26, color: muted, fontWeight: 600 }}>{label}</span>
      <span
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 64,
          fontWeight: 400,
          lineHeight: 1.1,
        }}
      >
        {display}
      </span>
    </div>
    <input
      className="hdb-range"
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: muted }}>
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

const Readout = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div style={{ fontSize: 22, color: muted, fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 36, fontWeight: 700, marginTop: 4 }}>{value}</div>
  </div>
);

const LeaseCheck: Page = () => {
  const [leaseStart, setLeaseStart] = useState(1996);
  const [age, setAge] = useState(26);

  const remaining = Math.max(0, 99 - (APPLY_YEAR - leaseStart));
  const needed = 95 - age;
  const endsAtAge = age + remaining;
  const tenure = Math.max(0, Math.min(25, remaining - 20));
  const status = remaining >= needed ? 'full' : remaining > 20 ? 'partial' : 'none';

  const verdict = {
    full: { color: teal, title: 'Full loan ✓', sub: '75% LTV and full CPF usage' },
    partial: {
      color: 'var(--osd-accent)',
      title: 'Pro-rated',
      sub: 'Loan and CPF usage reduced',
    },
    none: { color: '#8a2d1c', title: 'No HDB loan', sub: '20 years or less of lease left' },
  }[status];

  return (
    <div className="hdb-deck" style={page}>
      <Squiggle style={{ right: 0, top: 0 }} />
      <Blob w={560} style={{ left: -300, bottom: -330 }} />
      <Heading>Does this flat last until we’re 95?</Heading>

      <div style={{ display: 'flex', gap: 80, marginTop: 52 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 36 }}>
          <Slider
            label="Lease started (≈ TOP year)"
            value={leaseStart}
            display={leaseStart === APPLY_YEAR ? `${leaseStart} · BTO` : String(leaseStart)}
            min={1966}
            max={APPLY_YEAR}
            onChange={setLeaseStart}
          />
          <Slider
            label="Youngest owner’s age"
            value={age}
            display={`${age} yrs`}
            min={21}
            max={55}
            onChange={setAge}
          />
        </div>

        <div
          style={{
            width: 640,
            flex: 'none',
            background: card,
            borderTop: `10px solid ${verdict.color}`,
            borderRadius: 'var(--osd-radius)',
            padding: '36px 44px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--osd-font-display)',
              fontSize: 72,
              fontWeight: 400,
              lineHeight: 1.1,
              color: verdict.color,
            }}
          >
            {verdict.title}
          </div>
          <div style={{ fontSize: 28, color: muted, marginTop: 8 }}>{verdict.sub}</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px 32px',
              marginTop: 32,
            }}
          >
            <Readout label="Lease left in 2026" value={`${remaining} yrs`} />
            <Readout label="Needed (95 − age)" value={`${needed} yrs`} />
            <Readout label="Lease ends at age" value={`${endsAtAge}`} />
            <Readout label="Max HDB tenure" value={tenure ? `${tenure} yrs` : '—'} />
          </div>
        </div>
      </div>

      {/* Lease vs. lifetime bar: ages 20 → 110 */}
      <div style={{ position: 'relative', width: BAR_W, height: 110, marginTop: 56 }}>
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 0,
            width: BAR_W,
            height: 28,
            borderRadius: 14,
            background: line,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: ageX(age),
            width: Math.max(0, ageX(endsAtAge) - ageX(age)),
            height: 28,
            borderRadius: 14,
            background: verdict.color,
            transition: 'width 180ms ease-out, left 180ms ease-out, background 180ms',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: ageX(95) - 2,
            width: 4,
            height: 68,
            background: 'var(--osd-text)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 82,
            left: ageX(95) - 60,
            width: 120,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          age 95
        </div>
        <div
          style={{
            position: 'absolute',
            top: 82,
            left: ageX(age) - 60,
            width: 120,
            textAlign: 'center',
            fontSize: 22,
            color: muted,
          }}
        >
          now
        </div>
      </div>

      <Footnote>
        Lease counted at flat application ({APPLY_YEAR}). Exact pro-rating: use CPF’s housing usage
        calculator.
      </Footnote>
    </div>
  );
};

/* ---------- 5. Grants + next steps ---------- */

const Grant = ({
  amount,
  name,
  note,
}: {
  amount: string;
  name: string;
  note: string;
}) => (
  <div
    style={{
      flex: 1,
      background: card,
      borderRadius: 'var(--osd-radius)',
      padding: '36px 40px',
    }}
  >
    <div style={{ fontSize: 24, color: muted, fontWeight: 600 }}>up to</div>
    <div
      style={{
        fontFamily: 'var(--osd-font-display)',
        fontSize: 84,
        fontWeight: 400,
        lineHeight: 1.05,
        color: teal,
      }}
    >
      {amount}
    </div>
    <div style={{ fontSize: 30, fontWeight: 600, marginTop: 16 }}>{name}</div>
    <div style={{ fontSize: 24, color: muted, marginTop: 8, lineHeight: 1.4 }}>{note}</div>
  </div>
);

const NextStep = ({ n, children }: { n: string; children: ReactNode }) => (
  <div style={{ flex: 1, borderTop: `4px solid var(--osd-accent)`, paddingTop: 20 }}>
    <div style={{ fontSize: 22, color: 'var(--osd-accent)', fontWeight: 700 }}>{n}</div>
    <div style={{ fontSize: 28, lineHeight: 1.35, marginTop: 6 }}>{children}</div>
  </div>
);

const Grants: Page = () => (
  <div className="hdb-deck" style={page}>
    <Squiggle style={{ right: 0, top: 0 }} />
    <Blob w={640} style={{ left: -320, bottom: -360 }} />
    <Sparkle x={1400} y={100} s={80} />
    <Sparkle x={1490} y={170} s={50} />
    <Heading>Grants that lower the price</Heading>
    <div style={{ display: 'flex', gap: 32, marginTop: 56 }}>
      <Grant
        amount="$120k"
        name="Enhanced Housing Grant"
        note="BTO or resale · avg income ≤ $9k · tiered"
      />
      <Grant
        amount="$80k"
        name="Family Grant"
        note="Resale · ≤ 4-room · $50k if 5-room+"
      />
      <Grant amount="$30k" name="Proximity Grant" note="Resale · with parents ($20k if ≤ 4 km)" />
    </div>
    <div style={{ display: 'flex', gap: 40, marginTop: 72 }}>
      <NextStep n="01">Preliminary HFE check on HDB Flat Portal</NextStep>
      <NextStep n="02">HFE letter: ~1 month, valid 9 months</NextStep>
      <NextStep n="03">BTO launch or resale OTP</NextStep>
      <NextStep n="04">Register marriage within 3 mths of keys / completion</NextStep>
    </div>
    <Footnote>
      BTO bonus: fiancée ≤ 30 → staggered downpayment, 5% at signing. Confirm all figures in our
      HFE letter.
    </Footnote>
  </div>
);

/* ---------- 6. Interactive loan calculator ---------- */

const HDB_RATE = 0.026;
const LTV = 0.75;
const MSR = 0.3;
const HDB_LOAN_CEILING = 16000;
const FAMILY_CEILING = 16000;
const CPF_RETAIN_EACH = 20000;

// EHG for first-timer couples (Aug 2024 table): [max avg monthly household income, grant].
const EHG_TIERS: [number, number][] = [
  [1500, 120000],
  [2000, 110000],
  [2500, 105000],
  [3000, 95000],
  [3500, 90000],
  [4000, 80000],
  [4500, 70000],
  [5000, 65000],
  [5500, 55000],
  [6000, 50000],
  [6500, 40000],
  [7000, 30000],
  [7500, 25000],
  [8000, 20000],
  [8500, 10000],
  [9000, 5000],
];
const ehgFor = (income: number) => EHG_TIERS.find(([cap]) => income <= cap)?.[1] ?? 0;

const money = (n: number) => `$${Math.round(n).toLocaleString('en-SG')}`;

const calcCss = `
.hdb-num { width: 100%; box-sizing: border-box; font: 600 34px var(--osd-font-body); color: var(--osd-text); background: ${card}; border: 2px solid ${line}; border-radius: 14px; padding: 10px 18px; outline: none; }
.hdb-num:focus { border-color: ${teal}; }
.hdb-num::-webkit-inner-spin-button { opacity: .4; }
`;

const FieldLabel = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 22, color: muted, fontWeight: 600, marginBottom: 8 }}>{children}</div>
);

const NumField = ({
  label,
  value,
  step,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  onChange: (v: number) => void;
}) => (
  <label style={{ display: 'block' }}>
    <FieldLabel>{label}</FieldLabel>
    <input
      className="hdb-num"
      type="number"
      min={0}
      step={step}
      value={value}
      onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
    />
  </label>
);

const SegButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      flex: 1,
      font: '600 26px var(--osd-font-body)',
      padding: '14px 0',
      border: 'none',
      borderRadius: 12,
      cursor: 'pointer',
      background: active ? teal : 'transparent',
      color: active ? card : 'var(--osd-text)',
    }}
  >
    {children}
  </button>
);

const Seg = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      gap: 6,
      padding: 6,
      background: card,
      borderRadius: 16,
    }}
  >
    {children}
  </div>
);

const Switch = ({ on, disabled }: { on: boolean; disabled: boolean }) => (
  <span
    style={{
      width: 72,
      height: 40,
      flex: 'none',
      borderRadius: 20,
      position: 'relative',
      background: on && !disabled ? teal : line,
      transition: 'background 160ms',
    }}
  >
    <span
      style={{
        position: 'absolute',
        top: 4,
        left: on && !disabled ? 36 : 4,
        width: 32,
        height: 32,
        borderRadius: 16,
        background: card,
        boxShadow: '0 1px 3px rgba(42,36,32,.3)',
        transition: 'left 160ms ease-out',
      }}
    />
  </span>
);

const GrantToggle = ({
  name,
  amount,
  on,
  eligible,
  reason,
  onToggle,
  children,
}: {
  name: string;
  amount: number;
  on: boolean;
  eligible: boolean;
  reason: string;
  onToggle: () => void;
  children?: ReactNode;
}) => {
  const counted = on && eligible;
  return (
    <div
      style={{
        background: card,
        border: `2px solid ${counted ? teal : line}`,
        borderRadius: 'var(--osd-radius)',
        padding: '22px 28px',
        opacity: eligible ? 1 : 0.75,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          width: '100%',
        }}
      >
        <Switch on={on} disabled={!eligible} />
        <span style={{ flex: 1, fontSize: 28, fontWeight: 600 }}>{name}</span>
        <span
          style={{
            fontFamily: 'var(--osd-font-display)',
            fontSize: 40,
            fontWeight: 400,
            color: counted ? teal : muted,
            textDecoration: eligible ? 'none' : 'line-through',
          }}
        >
          {money(amount)}
        </span>
      </button>
      <div
        style={{
          fontSize: 22,
          marginTop: 10,
          paddingLeft: 92,
          color: eligible ? muted : 'var(--osd-accent)',
        }}
      >
        {eligible ? '✓ ' : '✕ '}
        {reason}
      </div>
      {children}
    </div>
  );
};

const Row = ({
  label,
  value,
  strong,
  sub,
}: {
  label: string;
  value: string;
  strong?: boolean;
  sub?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '10px 0',
      borderTop: strong ? `2px solid ${line}` : 'none',
      fontSize: sub ? 24 : 28,
      color: sub ? muted : 'var(--osd-text)',
      fontWeight: strong ? 700 : 400,
    }}
  >
    <span>{label}</span>
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>
  </div>
);

const Calculator: Page = () => {
  const [resale, setResale] = useState(true);
  const [big, setBig] = useState(false); // 5-room or bigger
  const [price, setPrice] = useState(600000);
  const [incomeA, setIncomeA] = useState(5000);
  const [incomeB, setIncomeB] = useState(3500);
  const [cpfOa, setCpfOa] = useState(60000);
  const [tenure, setTenure] = useState(25);
  const [useEhg, setUseEhg] = useState(true);
  const [useFamily, setUseFamily] = useState(true);
  const [useProx, setUseProx] = useState(true);
  const [withParents, setWithParents] = useState(false);

  const income = incomeA + incomeB;
  const years = Math.min(25, Math.max(1, tenure));

  // Grants
  const ehgAmt = ehgFor(income);
  const ehgOk = income > 0 && ehgAmt > 0;
  const famAmt = big ? 50000 : 80000;
  const famOk = resale && income <= FAMILY_CEILING;
  const proxAmt = withParents ? 30000 : 20000;
  const proxOk = resale;
  const grants =
    (useEhg && ehgOk ? ehgAmt : 0) +
    (useFamily && famOk ? famAmt : 0) +
    (useProx && proxOk ? proxAmt : 0);

  // Loan
  const r = HDB_RATE / 12;
  const n = years * 12;
  const annuity = (1 - (1 + r) ** -n) / r;
  const net = Math.max(0, price - grants);
  const cpfExcess = Math.max(0, cpfOa - 2 * CPF_RETAIN_EACH);
  const loanOk = income > 0 && income <= HDB_LOAN_CEILING;
  const caps = {
    'LTV 75%': LTV * price,
    'CPF used first': net - cpfExcess,
    'MSR 30%': MSR * income * annuity,
  };
  const [binding, cap] = Object.entries(caps).reduce((a, b) => (b[1] < a[1] ? b : a));
  const loan = loanOk ? Math.max(0, cap) : 0;
  const monthly = loan / annuity;
  const down = net - loan;
  const fromCpf = Math.min(cpfOa, down);
  const cash = down - fromCpf;
  const msrPct = income ? monthly / income : 0;

  return (
    <div className="hdb-deck" style={{ ...page, padding: '80px 120px' }}>
      <Squiggle style={{ right: 0, top: 0, transform: 'scale(.55)', transformOrigin: 'top right' }} />
      <h2
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 84,
          fontWeight: 400,
          lineHeight: 1,
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        What will we actually pay?
      </h2>

      <div data-osd-interactive style={{ display: 'flex', gap: 48, marginTop: 36 }}>
        {/* Inputs */}
        <div style={{ width: 540, flex: 'none', display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <FieldLabel>Flat</FieldLabel>
              <Seg>
                <SegButton active={!resale} onClick={() => setResale(false)}>
                  BTO
                </SegButton>
                <SegButton active={resale} onClick={() => setResale(true)}>
                  Resale
                </SegButton>
              </Seg>
            </div>
            <div style={{ flex: 1 }}>
              <FieldLabel>Size</FieldLabel>
              <Seg>
                <SegButton active={!big} onClick={() => setBig(false)}>
                  ≤ 4-rm
                </SegButton>
                <SegButton active={big} onClick={() => setBig(true)}>
                  5-rm+
                </SegButton>
              </Seg>
            </div>
          </div>
          <NumField label="Flat price ($)" value={price} step={5000} onChange={setPrice} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <NumField label="My income /mth" value={incomeA} step={100} onChange={setIncomeA} />
            <NumField label="Fiancée /mth" value={incomeB} step={100} onChange={setIncomeB} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <NumField label="CPF OA (both)" value={cpfOa} step={1000} onChange={setCpfOa} />
            <NumField label="Tenure (yrs, ≤25)" value={tenure} step={1} onChange={setTenure} />
          </div>
          <div
            style={{
              fontSize: 26,
              padding: '16px 22px',
              borderRadius: 14,
              background: loanOk ? 'rgba(31,92,90,.08)' : 'rgba(196,98,63,.12)',
              color: loanOk ? teal : 'var(--osd-accent)',
              fontWeight: 600,
            }}
          >
            Household {money(income)}/mth ·{' '}
            {loanOk ? '✓ HDB loan' : income ? '✕ above $16k' : 'enter income'}
          </div>
        </div>

        {/* Grants */}
        <div style={{ width: 520, flex: 'none', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <GrantToggle
            name="EHG"
            amount={ehgAmt || 120000}
            on={useEhg}
            eligible={ehgOk}
            reason={ehgOk ? `Income ${money(income)} → tier ${money(ehgAmt)}` : 'Income above $9,000'}
            onToggle={() => setUseEhg((v) => !v)}
          />
          <GrantToggle
            name="Family Grant"
            amount={famAmt}
            on={useFamily}
            eligible={famOk}
            reason={
              !resale ? 'Resale flats only' : famOk ? 'Income ≤ $16,000' : 'Income above $16,000'
            }
            onToggle={() => setUseFamily((v) => !v)}
          />
          <GrantToggle
            name="Proximity"
            amount={proxAmt}
            on={useProx}
            eligible={proxOk}
            reason={proxOk ? 'No income ceiling' : 'Resale flats only'}
            onToggle={() => setUseProx((v) => !v)}
          >
            <div style={{ marginTop: 14, paddingLeft: 92 }}>
              <Seg>
                <SegButton active={!withParents} onClick={() => setWithParents(false)}>
                  Within 4 km
                </SegButton>
                <SegButton active={withParents} onClick={() => setWithParents(true)}>
                  With parents
                </SegButton>
              </Seg>
            </div>
          </GrantToggle>
        </div>

        {/* Result */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 24, color: muted, fontWeight: 600 }}>Monthly instalment</div>
          <div
            style={{
              fontFamily: 'var(--osd-font-display)',
              fontSize: 104,
              fontWeight: 400,
              lineHeight: 1.05,
              color: 'var(--osd-accent)',
            }}
          >
            {money(monthly)}
          </div>
          <div style={{ fontSize: 24, color: muted, marginBottom: 16 }}>
            {loanOk ? `${years} yrs · limited by ${binding}` : 'No HDB loan · bank loan not modelled'}
          </div>
          <Row label="Flat price" value={money(price)} />
          <Row label="− Grants" value={money(grants)} />
          <Row label="= Net price" value={money(net)} strong />
          <Row label="HDB loan" value={money(loan)} />
          <Row label="Downpayment" value={money(down)} strong />
          <Row label="from CPF OA" value={money(fromCpf)} sub />
          <Row label="in cash" value={money(cash)} sub />
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 22,
                color: muted,
              }}
            >
              <span>Share of income</span>
              <span style={{ fontWeight: 700, color: 'var(--osd-text)' }}>
                {(msrPct * 100).toFixed(1)}% / 30%
              </span>
            </div>
            <div
              style={{
                height: 14,
                borderRadius: 7,
                background: line,
                marginTop: 8,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, (msrPct / MSR) * 100)}%`,
                  height: '100%',
                  borderRadius: 7,
                  background: msrPct >= MSR - 0.001 ? 'var(--osd-accent)' : teal,
                  transition: 'width 180ms ease-out',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 120, right: 120, bottom: 40, fontSize: 20, color: muted }}>
        Estimate only · assumes price = valuation (no COV) and lease covers youngest to 95 · CPF
        excess above $20k each is used before the loan · confirm with HFE letter.
      </div>
    </div>
  );
};

// Scoped control styles, injected once (create-or-update so HMR picks up edits).
const STYLE_ID = 'osd-styles-hdb-first-home';
const deckCss = `${sliderCss}${calcCss}
.hdb-deck li::marker { color: ${design.palette.accent}; }`;
if (typeof document !== 'undefined') {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== deckCss) style.textContent = deckCss;
}

export const meta: SlideMeta = {
  title: 'HDB: Our First Home',
  createdAt: '2026-10-12T13:49:24.710Z',
};

export default [Cover, Hfe, Journey, Loan, Flats, LeaseCheck, Grants, Calculator] satisfies Page[];

export const notes: (string | undefined)[] = [
  'Goal: understand the HFE letter, how to get the maximum HDB loan, and which flats qualify for us (33 and 26).',
  `HFE is the gate for everything — no letter, no BTO application, no resale OTP.
Valid 9 months; time it before the launch we want.`,
  `Walk left to right. Step 1 is quick; the real choice is step 2.
HDB loan: assessed inside the HFE, stable 2.6%, but capped by the $16k income ceiling.
Bank loan: get an IPA first; rates float, tenure up to 30 years. Once we go bank, we can never go back to an HDB loan — HDB to bank later is allowed.`,
  `Loan amount = lowest of: 75% of price, what 30% of our income can service over 25 years at 2.6%.
Income ceiling went to $16k at NDR 2026 — effective date to confirm on the HDB Flat Portal.
Unclear whether HDB uses income-weighted average age; either way we get 25 years.`,
  `The binding rule is the age-95 lease test, not the tenure cap.
69 years left at application for full 75% LTV and full CPF usage. Any BTO passes; resale roughly built 1996+.`,
  `Live demo: drag the lease-start year. Try 1996 (just passes at 26), then 1990 (pro-rated), then 1970.
Also drag the age — an older youngest owner needs less lease.`,
  `EHG tiers: $120k at ≤$1.5k avg income down to $5k at $8.5–9k; needs 12 months continuous employment.
Resale could stack EHG + Family + Proximity (~$230k max).`,
  `Live calculator. Plug in our real incomes and CPF OA balances.
Toggle grants: Family + Proximity only apply to resale; EHG drops to 0 above $9k household income.
Watch which cap binds the loan: LTV 75%, CPF-first, or MSR 30%. EHG tier table is the Aug 2024 one — re-check on HDB.`,
];

import React, { useRef, useEffect, useState } from 'react';
import {
  Activity, BarChart2, BookOpen, ChevronDown, ChevronRight,
  Check, Cpu, DollarSign, Globe, Layers, LineChart,
  RefreshCw, Search, Settings, Target, TrendingUp, Zap,
} from 'lucide-react';
import { OIBarChart, type OIRow } from './charts/OIBarChart';
import { CandlestickChart, type SRLevel } from './charts/CandlestickChart';
import { BubbleChart, type BarrierRow } from './charts/BubbleChart';

// ─── palette ─────────────────────────────────────────────────────────────────
const C = {
  page:     '#0f172a',
  card:     '#1e293b',
  accent:   '#0d1929',
  border:   '#1e293b',
  borderHi: '#334151',
  p1: '#ffffff',
  p2: '#94a3b8',
  p3: '#475569',
  green: '#059669',
  red:   '#dc2626',
  amber: '#d97706',
  gray:  '#64748b',
  blue:  '#3b82f6',
} as const;

// ─── data ────────────────────────────────────────────────────────────────────
const SPOT   = 541.20;
const TICKER = 'SPY';

const OI_DATA: OIRow[] = [
  { strike: 555, callOI: 12800, putOI:  8200 },
  { strike: 550, callOI: 45200, putOI: 18600 },
  { strike: 545, callOI: 38600, putOI: 25100 },
  { strike: 542, callOI: 15200, putOI:  8900 },
  { strike: 540, callOI: 28500, putOI: 42300, isSpot: true },
  { strike: 538, callOI:  8200, putOI: 35600 },
  { strike: 535, callOI: 22400, putOI: 31200 },
  { strike: 530, callOI: 18700, putOI: 28900 },
  { strike: 525, callOI: 12100, putOI: 41800 },
];

const SR_LEVELS: SRLevel[] = [
  { label: 'Res.3', price: 555, color: '#fca5a5' },
  { label: 'Res.2', price: 550, color: '#ef4444' },
  { label: 'Res.1', price: 545, color: '#dc2626' },
  { label: 'Sup.1', price: 535, color: '#059669' },
  { label: 'Sup.2', price: 530, color: '#34d399' },
  { label: 'Sup.3', price: 525, color: '#6ee7b7' },
];

const BARRIER_DATA: BarrierRow[] = [
  { level: 'Res.3', strike: 555, levelColor: '#fca5a5', exp1: { oi: 12800, dominant: 'call' }, exp2: { oi:  8600, dominant: 'call' } },
  { level: 'Res.2', strike: 550, levelColor: '#ef4444', exp1: { oi: 45200, dominant: 'call' }, exp2: { oi: 22100, dominant: 'call' } },
  { level: 'Res.1', strike: 545, levelColor: '#dc2626', exp1: { oi: 38600, dominant: 'put'  }, exp2: { oi: 31400, dominant: 'put'  } },
  { level: 'Sup.1', strike: 535, levelColor: '#059669', exp1: { oi: 22400, dominant: 'call' }, exp2: { oi: 18800, dominant: 'call' } },
  { level: 'Sup.2', strike: 530, levelColor: '#34d399', exp1: { oi: 18700, dominant: 'put'  }, exp2: { oi: 24600, dominant: 'put'  } },
  { level: 'Sup.3', strike: 525, levelColor: '#6ee7b7', exp1: { oi: 12100, dominant: 'put'  }, exp2: { oi: 41800, dominant: 'put'  } },
];

const ALL_EXPIRIES = [
  '27/06/2026', '18/07/2026', '15/08/2026', '19/09/2026',
  '17/10/2026', '21/11/2026', '16/01/2027', '21/03/2027',
];

// All OI values ranked for barrier table coloring
const ALL_OI_VALUES = BARRIER_DATA.flatMap((d) => [
  { key: `${d.level}-1`, oi: d.exp1.oi },
  { key: `${d.level}-2`, oi: d.exp2.oi },
]).sort((a, b) => b.oi - a.oi);

const rankColor = (key: string): string | undefined => {
  const idx = ALL_OI_VALUES.findIndex((v) => v.key === key);
  if (idx === 0) return '#f59e0b';
  if (idx === 1) return '#d97706';
  if (idx === 2) return '#92400e';
  return undefined;
};

const EXPIRIES_SHOWN = ['27/06/2026', '18/07/2026'];

// ─── sidebar nav ─────────────────────────────────────────────────────────────
interface NavItem { icon: React.ComponentType<{ size?: number }>; label: string; active?: boolean }
interface NavGroup { label: string | null; items: NavItem[] }

const NAV: NavGroup[] = [
  { label: null, items: [{ icon: BookOpen, label: 'Guida' }] },
  {
    label: 'Ciclo Macro',
    items: [
      { icon: BarChart2,  label: 'Barometro S&P 500' },
      { icon: Cpu,        label: 'Cockpit' },
      { icon: Layers,     label: 'Cruscotto MHM' },
      { icon: TrendingUp, label: 'Inflazione' },
      { icon: Globe,      label: 'Macro' },
      { icon: Activity,   label: 'Pring Cycle' },
    ],
  },
  {
    label: 'Asset Class',
    items: [
      { icon: DollarSign, label: 'Bonds' },
      { icon: LineChart,  label: 'Commodities' },
      { icon: Target,     label: 'Equities' },
      { icon: Zap,        label: 'Open Interest', active: true },
    ],
  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function RatioBadge({ ratio }: { ratio: number }) {
  const [color, bg] =
    ratio > 1.5 ? [C.green, `${C.green}18`] :
    ratio < 0.7 ? [C.red,   `${C.red}18`]   :
                  [C.gray,  `${C.gray}18`];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-bold"
      style={{ color, backgroundColor: bg }}
    >
      {ratio.toFixed(2)}
    </span>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: C.p2 }}>
        {title}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: C.borderHi }} />
    </div>
  );
}

// ─── expiry multiselect ───────────────────────────────────────────────────────
function ExpirySelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const toggle = (exp: string) => {
    onChange(
      selected.includes(exp) ? selected.filter((s) => s !== exp) : [...selected, exp],
    );
  };

  const label = selected.length === 0
    ? 'Seleziona scadenze…'
    : selected.slice(0, 2).join(' · ') + (selected.length > 2 ? ` +${selected.length - 2}` : '');

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm"
        style={{
          backgroundColor: C.card,
          border: `1px solid ${C.borderHi}`,
          color: C.p2,
          minWidth: 220,
        }}
      >
        <span className="flex-1 text-left truncate">{label}</span>
        <ChevronDown size={13} />
      </button>

      {open && (
        <div
          className="absolute z-30 mt-1 rounded-md overflow-hidden shadow-xl"
          style={{
            top: '100%',
            left: 0,
            minWidth: '100%',
            backgroundColor: C.page,
            border: `1px solid ${C.borderHi}`,
          }}
        >
          {ALL_EXPIRIES.map((exp) => {
            const sel = selected.includes(exp);
            return (
              <button
                key={exp}
                onClick={() => toggle(exp)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-white/5"
                style={{ color: sel ? C.blue : C.p2 }}
              >
                <span
                  className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                  style={{
                    borderColor: sel ? C.blue : C.borderHi,
                    backgroundColor: sel ? `${C.blue}22` : 'transparent',
                  }}
                >
                  {sel && <Check size={10} color={C.blue} />}
                </span>
                {exp}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── main ────────────────────────────────────────────────────────────────────
export default function App() {
  const [tickerInput,  setTickerInput]  = useState(TICKER);
  const [verified,     setVerified]     = useState(true);
  const [selExpiries,  setSelExpiries]  = useState(['27/06/2026', '18/07/2026']);

  return (
    <div className="flex" style={{ backgroundColor: C.page, minWidth: 1280, minHeight: '100vh' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className="fixed top-0 left-0 h-full flex flex-col z-20 overflow-y-auto"
        style={{ width: 240, backgroundColor: C.accent, borderRight: `1px solid ${C.borderHi}` }}
      >
        <div className="px-5 py-5" style={{ borderBottom: `1px solid ${C.borderHi}` }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                 style={{ backgroundColor: C.blue }}>
              <BarChart2 size={14} color="#fff" />
            </div>
            <span className="font-bold text-sm" style={{ color: C.p1, letterSpacing: '-0.01em' }}>
              MacroCompass
            </span>
          </div>
          <span className="text-xs pl-9" style={{ color: C.p3 }}>v2.8.1</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-6">
          {NAV.map((group) => (
            <div key={group.label ?? '_top'}>
              {group.label && (
                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: C.p3 }}>
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map(({ icon: Icon, label, active }) => (
                  <li key={label}>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
                      style={{
                        backgroundColor: active ? `${C.blue}22` : 'transparent',
                        color: active ? C.blue : C.p2,
                      }}
                    >
                      <Icon size={14} />
                      <span>{label}</span>
                      {active && <ChevronRight size={12} style={{ marginLeft: 'auto', color: C.blue }} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-4 py-4" style={{ borderTop: `1px solid ${C.borderHi}` }}>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-white/5"
                  style={{ color: C.p3 }}>
            <Settings size={13} />
            <span>Impostazioni</span>
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto" style={{ marginLeft: 240, padding: 24 }}>

        {/* BLOCCO 0 — Top bar */}
        <div className="mb-6">
          <h1 className="font-bold mb-1.5" style={{ fontSize: 22, color: C.p1 }}>
            Open Interest — Struttura Opzioni
          </h1>
          <p style={{ fontSize: 13, color: C.p2 }}>
            Analisi OI per strike, supporti/resistenze e confronto multi-scadenza
          </p>
        </div>

        {/* BLOCCO 1 — ControlBar */}
        <div
          className="flex flex-wrap items-center gap-3 rounded-lg mb-6"
          style={{ backgroundColor: C.card, border: `1px solid ${C.borderHi}`, padding: 16 }}
        >
          {/* Ticker input */}
          <input
            type="text"
            value={tickerInput}
            onChange={(e) => { setTickerInput(e.target.value.toUpperCase()); setVerified(false); }}
            placeholder="es. SPY"
            className="rounded-md px-3 py-2 text-sm font-mono font-bold outline-none"
            style={{
              width: 120,
              backgroundColor: C.page,
              border: `1px solid ${C.borderHi}`,
              color: C.p1,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
            onBlur={(e)  => (e.currentTarget.style.borderColor = C.borderHi)}
          />

          {/* Verifica button */}
          <button
            onClick={() => setVerified(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm"
            style={{ backgroundColor: C.accent, border: `1px solid ${C.borderHi}`, color: C.p2 }}
          >
            <Search size={13} />
            Verifica
          </button>

          {/* Verified ticker chip */}
          {verified && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold"
              style={{
                backgroundColor: `${C.green}20`,
                border: `1px solid ${C.green}`,
                color: C.green,
              }}
            >
              <span className="font-mono">{tickerInput}</span>
              <span style={{ color: C.p3 }}>·</span>
              <span>{SPOT.toFixed(2)} USD</span>
              <Check size={12} />
            </div>
          )}

          <div className="w-px h-6 self-center" style={{ backgroundColor: C.borderHi }} />

          {/* Expiry multiselect */}
          <ExpirySelect selected={selExpiries} onChange={setSelExpiries} />

          {/* Carica Scadenze */}
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm"
            style={{ backgroundColor: C.accent, border: `1px solid ${C.borderHi}`, color: C.p2 }}
          >
            <RefreshCw size={13} />
            Carica Scadenze
          </button>

          {/* Fetch OI — primary */}
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold ml-auto"
            style={{ backgroundColor: C.blue, color: '#ffffff', borderRadius: 6 }}
          >
            <Activity size={13} />
            Fetch OI
          </button>
        </div>

        {/* BLOCCO 2 — OI principale (2 colonne) */}
        <div className="flex gap-4 mb-6" style={{ alignItems: 'stretch' }}>

          {/* Left 55% — OI Bar Chart */}
          <div
            className="flex flex-col rounded-lg"
            style={{
              flex: '0 0 55%',
              backgroundColor: C.card,
              border: `1px solid ${C.borderHi}`,
              padding: 16,
            }}
          >
            <span className="block text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: C.p2 }}>
              Open Interest per Strike — 27/06/2026
            </span>
            <div style={{ flex: 1, minHeight: 420 }}>
              <OIBarChart data={OI_DATA} spot={SPOT} />
            </div>
          </div>

          {/* Right 45% — Top Strike Table */}
          <div
            className="flex flex-col rounded-lg flex-1"
            style={{ backgroundColor: C.card, border: `1px solid ${C.borderHi}`, padding: 16 }}
          >
            <span className="block text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: C.p2 }}>
              Top Strike per OI
            </span>
            <div className="rounded-md overflow-hidden flex-1" style={{ border: `1px solid ${C.borderHi}` }}>
              <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ backgroundColor: C.accent }}>
                    {['Strike', 'Call OI', 'Put OI', 'Ratio'].map((h) => (
                      <th key={h} className="text-left px-3 py-2"
                          style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em',
                                   textTransform: 'uppercase', color: C.p2,
                                   borderBottom: `1px solid ${C.borderHi}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OI_DATA.map((d, idx) => {
                    const ratio   = d.callOI / d.putOI;
                    const isSpot  = !!d.isSpot;
                    const rowBg   = isSpot ? `${C.amber}20` : idx % 2 === 0 ? C.card : C.accent;
                    return (
                      <tr
                        key={d.strike}
                        style={{
                          backgroundColor: rowBg,
                          borderLeft: isSpot ? `3px solid ${C.amber}` : '3px solid transparent',
                        }}
                      >
                        <td className="px-3 py-2.5"
                            style={{ borderBottom: `1px solid ${C.border}`, fontSize: 13,
                                     fontWeight: isSpot ? 700 : 500,
                                     color: isSpot ? C.amber : C.p1, fontFamily: 'monospace' }}>
                          {d.strike}
                          {isSpot && (
                            <span className="ml-1.5 text-xs" style={{ color: C.amber }}>★</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5"
                            style={{ borderBottom: `1px solid ${C.border}`, fontSize: 13,
                                     fontWeight: 600, color: C.green, fontFamily: 'monospace' }}>
                          {fmt(d.callOI)}
                        </td>
                        <td className="px-3 py-2.5"
                            style={{ borderBottom: `1px solid ${C.border}`, fontSize: 13,
                                     fontWeight: 600, color: C.red, fontFamily: 'monospace' }}>
                          {fmt(d.putOI)}
                        </td>
                        <td className="px-3 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                          <RatioBadge ratio={ratio} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BLOCCO 3 — Supporti e Resistenze */}
        <div
          className="rounded-lg mb-6"
          style={{ backgroundColor: C.card, border: `1px solid ${C.borderHi}`, padding: 16 }}
        >
          <span className="block text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: C.p2 }}>
            Supporti e Resistenze — Grafico 6 Mesi
          </span>

          <div className="rounded-md overflow-hidden mb-4"
               style={{ backgroundColor: C.accent, height: 380 }}>
            <CandlestickChart srLevels={SR_LEVELS} spot={SPOT} />
          </div>

          {/* S/R legend chips */}
          <div className="flex flex-wrap gap-2">
            {SR_LEVELS.map(({ label, price, color }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs font-semibold" style={{ color }}>
                  {label} {price}
                </span>
              </div>
            ))}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded"
              style={{ backgroundColor: `${C.amber}15`, border: `1px solid ${C.amber}40` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.amber }} />
              <span className="text-xs font-semibold" style={{ color: C.amber }}>
                Spot {SPOT}
              </span>
            </div>
          </div>
        </div>

        {/* BLOCCO 4 — Mappa Barriere Multi-Scadenza */}
        <div
          className="rounded-lg mb-8"
          style={{ backgroundColor: C.card, border: `1px solid ${C.borderHi}`, padding: 16 }}
        >
          <span className="block text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: C.p2 }}>
            Mappa Barriere Multi-Scadenza
          </span>

          {/* Barrier table */}
          <div className="rounded-md overflow-hidden mb-4" style={{ border: `1px solid ${C.borderHi}` }}>
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: C.accent }}>
                  <th className="text-left px-4 py-2.5" style={{ width: '22%', fontSize: 10,
                       fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
                       color: C.p2, borderBottom: `1px solid ${C.borderHi}` }}>
                    Livello
                  </th>
                  {EXPIRIES_SHOWN.map((exp) => (
                    <th key={exp} className="text-left px-4 py-2.5"
                        style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em',
                                 textTransform: 'uppercase', color: C.p2,
                                 borderBottom: `1px solid ${C.borderHi}` }}>
                      {exp}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BARRIER_DATA.map((row, idx) => (
                  <tr key={row.level}
                      style={{ backgroundColor: idx % 2 === 0 ? C.card : C.accent }}>
                    {/* Level label */}
                    <td className="px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: row.levelColor }} />
                        <span className="font-bold text-sm" style={{ color: row.levelColor }}>
                          {row.level}
                        </span>
                        <span className="text-xs font-mono" style={{ color: C.p3 }}>
                          {row.strike}
                        </span>
                      </div>
                    </td>

                    {/* Exp1 OI */}
                    {(() => {
                      const k1 = `${row.level}-1`;
                      const k2 = `${row.level}-2`;
                      const c1 = rankColor(k1);
                      const c2 = rankColor(k2);
                      return (
                        <>
                          <td className="px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <span className="block font-mono"
                                  style={{ fontSize: 14, color: c1 ?? C.p1, fontWeight: c1 ? 700 : 500 }}>
                              {row.exp1.oi.toLocaleString()}
                            </span>
                            <span style={{ fontSize: 11, color: C.p3 }}>
                              {row.exp1.dominant === 'call' ? '↑ Call' : '↓ Put'}
                            </span>
                          </td>
                          <td className="px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <span className="block font-mono"
                                  style={{ fontSize: 14, color: c2 ?? C.p1, fontWeight: c2 ? 700 : 500 }}>
                              {row.exp2.oi.toLocaleString()}
                            </span>
                            <span style={{ fontSize: 11, color: C.p3 }}>
                              {row.exp2.dominant === 'call' ? '↑ Call' : '↓ Put'}
                            </span>
                          </td>
                        </>
                      );
                    })()}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* OI ranking legend */}
          <div className="flex items-center gap-4 mb-4">
            {[
              { rank: '#1', color: '#f59e0b', label: 'OI massimo' },
              { rank: '#2', color: '#d97706', label: 'OI secondo' },
              { rank: '#3', color: '#92400e', label: 'OI terzo'  },
            ].map(({ rank, color, label }) => (
              <div key={rank} className="flex items-center gap-1.5">
                <span className="font-bold text-xs" style={{ color }}>{rank}</span>
                <span style={{ fontSize: 11, color: C.p3 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Bubble chart */}
          <div className="rounded-md overflow-hidden"
               style={{ backgroundColor: C.accent, height: 320 }}>
            <BubbleChart data={BARRIER_DATA} />
          </div>
        </div>

      </main>
    </div>
  );
}

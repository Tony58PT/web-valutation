import {
  Activity,
  BarChart2,
  BookOpen,
  ChevronRight,
  Globe,
  Home,
  Layers,
  LineChart,
  Settings,
  Target,
  TrendingUp,
  Bot,
  Cpu,
  DollarSign,
} from 'lucide-react';

// ─── palette constants ───────────────────────────────────────────────────────
const C = {
  page:   '#0f172a',
  card:   '#1e293b',
  accent: '#0d1929',
  border: '#1e293b',
  borderHi: '#334151',
  textPrimary:   '#ffffff',
  textSecondary: '#94a3b8',
  textTertiary:  '#475569',
  green:  '#059669',
  red:    '#dc2626',
  amber:  '#d97706',
  gray:   '#64748b',
  blue:   '#3b82f6',
  purple: '#8b5cf6',
} as const;

// ─── types ───────────────────────────────────────────────────────────────────
type SignalLevel = 'green' | 'red' | 'amber' | 'gray' | 'blue' | 'purple';

interface ValueCardData {
  label: string;
  value: string;
  pct: number;
  pctLabel: string;
  chipText: string;
  chipColor: SignalLevel;
}

interface ConfirmSignal {
  label: string;
  dot: SignalLevel;
  status: string;
  detail: string;
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function signalColor(level: SignalLevel): string {
  const map: Record<SignalLevel, string> = {
    green:  C.green,
    red:    C.red,
    amber:  C.amber,
    gray:   C.gray,
    blue:   C.blue,
    purple: C.purple,
  };
  return map[level];
}

// ─── sub-components ──────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: C.textSecondary }}
      >
        {title}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: C.borderHi }} />
    </div>
  );
}

function Chip({ text, color }: { text: string; color: SignalLevel }) {
  const c = signalColor(color);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold"
      style={{
        backgroundColor: c + '1a',
        color: c,
        border: `1px solid ${c}33`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: c }}
      />
      {text}
    </span>
  );
}

function PercentileBar({ pct, color }: { pct: number; color: SignalLevel }) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height: 6, backgroundColor: C.accent }}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: signalColor(color) }}
      />
    </div>
  );
}

function ValueCard({ data, accentColor }: { data: ValueCardData; accentColor: SignalLevel }) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-3"
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.borderHi}`,
        borderRadius: 8,
      }}
    >
      <span
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: C.textSecondary }}
      >
        {data.label}
      </span>
      <span
        className="font-bold leading-none"
        style={{ fontSize: 26, color: C.textPrimary, letterSpacing: '-0.02em' }}
      >
        {data.value}
      </span>
      <div className="flex flex-col gap-1">
        <PercentileBar pct={data.pct} color={accentColor} />
        <span style={{ fontSize: 11, color: C.textTertiary }}>{data.pctLabel}</span>
      </div>
      <Chip text={data.chipText} color={accentColor} />
    </div>
  );
}

function AIBox({ text }: { text: string }) {
  return (
    <div
      className="rounded-lg p-4 flex gap-3"
      style={{
        backgroundColor: C.accent,
        border: `1px solid ${C.borderHi}`,
        borderRadius: 8,
        marginTop: 12,
      }}
    >
      <Bot size={16} color={C.purple} className="flex-shrink-0 mt-0.5" />
      <div>
        <span
          className="block text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: C.purple }}
        >
          Analisi AI
        </span>
        <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>{text}</p>
      </div>
    </div>
  );
}

// ─── data ────────────────────────────────────────────────────────────────────
const BONDS_CARDS: ValueCardData[] = [
  {
    label: 'Yield 10Y US',
    value: '4.32%',
    pct: 72,
    pctLabel: '72° percentile (36 anni)',
    chipText: 'ALTO',
    chipColor: 'red',
  },
  {
    label: 'Yield 2Y US',
    value: '4.89%',
    pct: 81,
    pctLabel: '81° percentile (36 anni)',
    chipText: 'MOLTO ALTO',
    chipColor: 'red',
  },
  {
    label: 'Spread 10Y–2Y',
    value: '−0.57%',
    pct: 28,
    pctLabel: '28° percentile (36 anni)',
    chipText: 'BASSO',
    chipColor: 'amber',
  },
  {
    label: 'Real Yield 10Y',
    value: '2.10%',
    pct: 68,
    pctLabel: '68° percentile (36 anni)',
    chipText: 'ALTO',
    chipColor: 'red',
  },
];

const EQUITY_CARDS: ValueCardData[] = [
  {
    label: 'S&P 500 P/E',
    value: '24.8×',
    pct: 78,
    pctLabel: '78° percentile (36 anni)',
    chipText: 'ALTO',
    chipColor: 'red',
  },
  {
    label: 'CAPE Shiller',
    value: '37.2',
    pct: 91,
    pctLabel: '91° percentile (36 anni)',
    chipText: 'MOLTO ALTO',
    chipColor: 'red',
  },
  {
    label: 'Earnings Yield',
    value: '4.03%',
    pct: 31,
    pctLabel: '31° percentile (36 anni)',
    chipText: 'BASSO',
    chipColor: 'amber',
  },
  {
    label: 'Margin Debt YoY',
    value: '+8.2%',
    pct: 71,
    pctLabel: '71° percentile (36 anni)',
    chipText: 'ALTO',
    chipColor: 'red',
  },
];

const COMMODITIES_CARDS: ValueCardData[] = [
  {
    label: 'CRB Index',
    value: '285.4',
    pct: 54,
    pctLabel: '54° percentile (36 anni)',
    chipText: 'NEUTRO',
    chipColor: 'gray',
  },
  {
    label: 'Oil WTI',
    value: '$78.3',
    pct: 42,
    pctLabel: '42° percentile (36 anni)',
    chipText: 'NEUTRO',
    chipColor: 'gray',
  },
  {
    label: 'Gold',
    value: '$2,385',
    pct: 82,
    pctLabel: '82° percentile (36 anni)',
    chipText: 'MOLTO ALTO',
    chipColor: 'amber',
  },
  {
    label: 'Copper/Gold',
    value: '0.0021',
    pct: 38,
    pctLabel: '38° percentile (36 anni)',
    chipText: 'BASSO',
    chipColor: 'amber',
  },
];

const CONFIRM_SIGNALS: ConfirmSignal[] = [
  { label: 'Yield Curve',     dot: 'green', status: 'Normale',    detail: '10Y−3M: +0.42%' },
  { label: 'VIX Regime',      dot: 'green', status: 'Bassa Vol',  detail: '16.8 < soglia 20' },
  { label: 'Fear & Greed',    dot: 'amber', status: 'Greed',      detail: '58/100' },
  { label: 'AAII Sentiment',  dot: 'blue',  status: 'Rialzista',  detail: 'Bull−Bear +12.3%' },
];

const NAV_GROUPS = [
  {
    label: null,
    items: [{ icon: BookOpen, label: 'Guida', href: '#' }],
  },
  {
    label: 'Ciclo Macro',
    items: [
      { icon: BarChart2,   label: 'Barometro S&P 500', href: '#' },
      { icon: Cpu,         label: 'Cockpit',            href: '#', active: true },
      { icon: Layers,      label: 'Cruscotto MHM',      href: '#' },
      { icon: TrendingUp,  label: 'Inflazione',         href: '#' },
      { icon: Globe,       label: 'Macro',              href: '#' },
      { icon: Activity,    label: 'Pring Cycle',        href: '#' },
    ],
  },
  {
    label: 'Asset Class',
    items: [
      { icon: DollarSign, label: 'Bonds',       href: '#' },
      { icon: LineChart,  label: 'Commodities', href: '#' },
      { icon: Target,     label: 'Equities',    href: '#' },
      { icon: Globe,      label: 'Global Market', href: '#' },
    ],
  },
];

// ─── main component ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="flex"
      style={{ backgroundColor: C.page, minWidth: 1280, minHeight: '100vh' }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="fixed top-0 left-0 h-full flex flex-col z-20 overflow-y-auto"
        style={{ width: 240, backgroundColor: C.accent, borderRight: `1px solid ${C.borderHi}` }}
      >
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: `1px solid ${C.borderHi}` }}>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: C.blue }}
            >
              <BarChart2 size={14} color="#fff" />
            </div>
            <span className="font-bold text-sm" style={{ color: C.textPrimary, letterSpacing: '-0.01em' }}>
              MacroCompass
            </span>
          </div>
          <span className="text-xs pl-9" style={{ color: C.textTertiary }}>v2.8.1</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label ?? '_top'}>
              {group.label && (
                <p
                  className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: C.textTertiary }}
                >
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map(({ icon: Icon, label, active }) => (
                  <li key={label}>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
                      style={{
                        backgroundColor: active ? C.blue + '22' : 'transparent',
                        color: active ? C.blue : C.textSecondary,
                      }}
                    >
                      <Icon size={14} />
                      <span>{label}</span>
                      {active && (
                        <ChevronRight size={12} style={{ marginLeft: 'auto', color: C.blue }} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4" style={{ borderTop: `1px solid ${C.borderHi}` }}>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-white/5 transition-colors"
            style={{ color: C.textTertiary }}
          >
            <Settings size={13} />
            <span>Impostazioni</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ marginLeft: 240, padding: 24 }}
      >
        {/* BLOCCO 0 — Top bar */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.textPrimary }}>
              Cockpit
            </h1>
            <div className="flex items-center gap-1" style={{ fontSize: 12, color: C.textTertiary }}>
              <Home size={11} />
              <span className="mx-1">›</span>
              <span>Ciclo Macro</span>
              <span className="mx-1">›</span>
              <span style={{ color: C.textSecondary }}>Cockpit</span>
            </div>
          </div>
          <span style={{ fontSize: 12, color: C.textTertiary }}>
            Aggiornato: 25/06/2026 08:15
          </span>
        </div>

        {/* BLOCCO 1 — KPI Strip */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {/* FASE PRING */}
          <div
            className="rounded-lg px-4 py-3"
            style={{
              backgroundColor: C.card,
              borderLeft: `3px solid ${C.blue}`,
              border: `1px solid ${C.borderHi}`,
              borderLeftWidth: 3,
              borderLeftColor: C.blue,
            }}
          >
            <span className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: C.textTertiary }}>
              Fase Pring
            </span>
            <span className="font-bold text-base" style={{ color: C.blue }}>F3 Ripresa</span>
          </div>

          {/* SCORE MACRO */}
          <div
            className="rounded-lg px-4 py-3"
            style={{
              backgroundColor: C.card,
              border: `1px solid ${C.borderHi}`,
              borderLeft: `3px solid ${C.green}`,
            }}
          >
            <span className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: C.textTertiary }}>
              Score Macro
            </span>
            <span className="font-bold text-base" style={{ color: C.green }}>62/100</span>
          </div>

          {/* VIX */}
          <div
            className="rounded-lg px-4 py-3"
            style={{
              backgroundColor: C.card,
              border: `1px solid ${C.borderHi}`,
              borderLeft: `3px solid ${C.green}`,
            }}
          >
            <span className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: C.textTertiary }}>
              VIX
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base" style={{ color: C.textPrimary }}>16.8</span>
              <Chip text="BASSA VOLATILITÀ" color="green" />
            </div>
          </div>

          {/* FEAR & GREED */}
          <div
            className="rounded-lg px-4 py-3"
            style={{
              backgroundColor: C.card,
              border: `1px solid ${C.borderHi}`,
              borderLeft: `3px solid ${C.amber}`,
            }}
          >
            <span className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: C.textTertiary }}>
              Fear & Greed
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base" style={{ color: C.textPrimary }}>58</span>
              <Chip text="GREED" color="amber" />
            </div>
          </div>

          {/* AAII */}
          <div
            className="rounded-lg px-4 py-3"
            style={{
              backgroundColor: C.card,
              border: `1px solid ${C.borderHi}`,
              borderLeft: `3px solid ${C.green}`,
            }}
          >
            <span className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: C.textTertiary }}>
              AAII Bull−Bear
            </span>
            <span className="font-bold text-base" style={{ color: C.green }}>+12.3%</span>
          </div>
        </div>

        {/* BLOCCO 2 — BONDS */}
        <section className="mb-8">
          <SectionHeader title="Bonds" />
          <div className="grid grid-cols-4 gap-4">
            {BONDS_CARDS.map((card) => (
              <ValueCard key={card.label} data={card} accentColor={card.chipColor} />
            ))}
          </div>
          <AIBox text="I rendimenti obbligazionari statunitensi si mantengono su livelli storicamente elevati, con il 10Y al 72° percentile. La curva invertita (spread 10Y–2Y negativo, 28° percentile) segnala ancora pressioni recessive latenti, sebbene stia progressivamente normalizzandosi. Il real yield positivo al 2.10% comprime le valutazioni azionarie e favorisce la rotazione verso asset difensivi. Mantenere duration breve fino a conferma del pivot Fed." />
        </section>

        {/* BLOCCO 3 — EQUITY */}
        <section className="mb-8">
          <SectionHeader title="Equity" />
          <div className="grid grid-cols-4 gap-4">
            {EQUITY_CARDS.map((card) => (
              <ValueCard key={card.label} data={card} accentColor={card.chipColor} />
            ))}
          </div>
          <AIBox text="Le valutazioni azionarie rimangono storicamente elevate: il CAPE Shiller a 37.2 si posiziona al 91° percentile, suggerendo rendimenti attesi decennali inferiori alla media storica. L'earnings yield al 4.03% rispetto al real yield al 2.10% mantiene un equity risk premium compresso. Il margin debt in espansione (+8.2%) segnala propensione al rischio elevata — potenziale amplificatore di volatilità in caso di shock." />
        </section>

        {/* BLOCCO 4 — COMMODITIES */}
        <section className="mb-8">
          <SectionHeader title="Commodities" />
          <div className="grid grid-cols-4 gap-4">
            {COMMODITIES_CARDS.map((card) => (
              <ValueCard key={card.label} data={card} accentColor={card.chipColor} />
            ))}
          </div>
          <AIBox text="Il complesso delle materie prime mostra una dicotomia netta: petrolio e CRB Index in territorio neutro suggeriscono assenza di pressioni inflazionistiche da commodity. L'oro all'82° percentile segnala elevata domanda di protezione, coerente con incertezza geopolitica e acquisti delle banche centrali. Il rapporto Copper/Gold basso (38° percentile) indica attese di crescita economica moderata — segnale leading negativo per la fase ciclica." />
        </section>

        {/* BLOCCO 5 — Segnali di Conferma */}
        <section className="mb-8">
          <SectionHeader title="Segnali di Conferma" />
          <div className="grid grid-cols-2 gap-4">
            {CONFIRM_SIGNALS.map((sig) => (
              <div
                key={sig.label}
                className="rounded-lg p-4 flex items-center gap-4"
                style={{
                  backgroundColor: C.card,
                  border: `1px solid ${C.borderHi}`,
                  borderRadius: 8,
                }}
              >
                {/* Dot */}
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: signalColor(sig.dot) }}
                />
                {/* Text */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold" style={{ color: C.textPrimary }}>
                      {sig.label}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: signalColor(sig.dot) }}>
                      {sig.status}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: C.textTertiary }}>{sig.detail}</span>
                </div>
                <Chip text={sig.status.toUpperCase()} color={sig.dot} />
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

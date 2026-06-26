// Placeholder candlestick chart with S/R horizontal lines
export interface SRLevel {
  label: string;
  price: number;
  color: string;
}

interface Candle { o: number; c: number; h: number; l: number }

// Deterministic pseudo-random candle generator
function genCandles(): Candle[] {
  let seed = 7919;
  const next = () => {
    seed = (seed * 16807) % 2_147_483_647;
    return seed / 2_147_483_647;
  };
  const arr: Candle[] = [];
  let px = 513;
  for (let i = 0; i < 82; i++) {
    const drift = i > 60 ? 0.04 : -0.01;
    const move  = (next() - 0.49 + drift) * 3.8;
    const o     = px;
    px          = Math.max(506, Math.min(557, px + move));
    const c     = px;
    const h     = Math.max(o, c) + next() * 1.6;
    const l     = Math.min(o, c) - next() * 1.6;
    arr.push({ o, c, h, l });
  }
  return arr;
}

const CANDLES = genCandles();

const PMIN   = 504;
const PMAX   = 559;
const PRANGE = PMAX - PMIN;
const VB_W   = 860;
const VB_H   = 350;
const LM     = 50;
const RM     = 18;
const TM     = 18;
const BM     = 28;
const PW     = VB_W - LM - RM;
const PH     = VB_H - TM - BM;
const CW     = PW / CANDLES.length;

const pY = (p: number) => TM + ((PMAX - p) / PRANGE) * PH;

const TICK_PRICES = [510, 520, 530, 540, 550];

export function CandlestickChart({ srLevels, spot }: { srLevels: SRLevel[]; spot: number }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      {/* Grid lines */}
      {TICK_PRICES.map((p) => (
        <line key={p} x1={LM} y1={pY(p)} x2={VB_W - RM} y2={pY(p)}
              stroke="#1e293b" strokeWidth="1" />
      ))}

      {/* S/R lines */}
      {srLevels.map(({ label, price, color }) => (
        <g key={label}>
          <line x1={LM} y1={pY(price)} x2={VB_W - RM} y2={pY(price)}
                stroke={color} strokeWidth="1.2" strokeDasharray="7 4" strokeOpacity={0.85} />
          <text x={LM - 4} y={pY(price) + 4} textAnchor="end" fontSize="9"
                fill={color} fontFamily="Inter, sans-serif" fontWeight="600">
            {price}
          </text>
        </g>
      ))}

      {/* Candles */}
      {CANDLES.map((c, i) => {
        const cx      = LM + (i + 0.5) * CW;
        const isGreen = c.c >= c.o;
        const col     = isGreen ? '#059669' : '#dc2626';
        const bTop    = pY(Math.max(c.o, c.c));
        const bBot    = pY(Math.min(c.o, c.c));
        const bH      = Math.max(1, bBot - bTop);
        const bW      = Math.max(2.5, CW * 0.68);
        return (
          <g key={i}>
            <line x1={cx} y1={pY(c.h)} x2={cx} y2={pY(c.l)}
                  stroke={col} strokeWidth="0.9" />
            <rect x={cx - bW / 2} y={bTop} width={bW} height={bH}
                  fill={col} fillOpacity={isGreen ? 0.85 : 0.8} />
          </g>
        );
      })}

      {/* Spot dashed line */}
      <line x1={LM} y1={pY(spot)} x2={VB_W - RM} y2={pY(spot)}
            stroke="#d97706" strokeWidth="1" strokeDasharray="4 3" strokeOpacity={0.6} />

      {/* Y-axis price ticks */}
      {TICK_PRICES.map((p) => (
        <text key={p} x={LM - 5} y={pY(p) + 4} textAnchor="end" fontSize="10"
              fill="#475569" fontFamily="Inter, sans-serif">
          {p}
        </text>
      ))}

      {/* X-axis time labels (approximate months) */}
      {['Jan', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'].map((m, i) => (
        <text key={m} x={LM + (i / 5) * PW} y={VB_H - 6} fontSize="10"
              fill="#475569" fontFamily="Inter, sans-serif" textAnchor="middle">
          {m}
        </text>
      ))}
    </svg>
  );
}

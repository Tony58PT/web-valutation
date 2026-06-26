// Bubble chart: x=expiry, y=strike level, size=OI, color=call/put
export interface BarrierRow {
  level: string;
  strike: number;
  levelColor: string;
  exp1: { oi: number; dominant: 'call' | 'put' };
  exp2: { oi: number; dominant: 'call' | 'put' };
}

const VB_W  = 620;
const VB_H  = 320;
const LM    = 90;
const RM    = 30;
const TM    = 36;
const BM    = 44;
const PW    = VB_W - LM - RM;
const PH    = VB_H - TM - BM;

const EXP_LABELS = ['27/06/2026', '18/07/2026'];
const EXP_XS     = [LM + PW * 0.28, LM + PW * 0.72];

const domColor = (d: 'call' | 'put') => (d === 'call' ? '#059669' : '#dc2626');

export function BubbleChart({ data }: { data: BarrierRow[] }) {
  const maxOI = Math.max(...data.flatMap((d) => [d.exp1.oi, d.exp2.oi]));
  const rowH  = PH / data.length;
  const rowY  = (i: number) => TM + (i + 0.5) * rowH;
  const bR    = (oi: number) => 7 + (oi / maxOI) * 24;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Subtitle */}
      <text x={VB_W / 2} y={16} textAnchor="middle" fontSize="10"
            fill="#475569" fontFamily="Inter, sans-serif">
        Dimensione bolla proporzionale all'OI · Verde = Call · Rosso = Put
      </text>

      {/* Grid */}
      {data.map((_, i) => (
        <line key={i} x1={LM} y1={rowY(i)} x2={VB_W - RM} y2={rowY(i)}
              stroke="#334151" strokeWidth="0.4" strokeOpacity="0.5" />
      ))}
      {EXP_XS.map((x, i) => (
        <line key={i} x1={x} y1={TM} x2={x} y2={VB_H - BM}
              stroke="#334151" strokeWidth="0.4" strokeOpacity="0.5" />
      ))}

      {/* Level labels (Y-axis) */}
      {data.map((d, i) => (
        <text key={d.level} x={LM - 8} y={rowY(i) + 4} textAnchor="end"
              fontSize="11" fill={d.levelColor}
              fontFamily="Inter, sans-serif" fontWeight="600">
          {d.level}
        </text>
      ))}

      {/* Expiry labels (X-axis) */}
      {EXP_LABELS.map((lbl, i) => (
        <text key={lbl} x={EXP_XS[i]} y={VB_H - BM + 16} textAnchor="middle"
              fontSize="10" fill="#94a3b8" fontFamily="Inter, sans-serif">
          {lbl}
        </text>
      ))}

      {/* Bubbles */}
      {data.map((d, i) => {
        const cy = rowY(i);
        return (
          <g key={d.level}>
            {/* Exp 1 */}
            <circle cx={EXP_XS[0]} cy={cy} r={bR(d.exp1.oi)}
                    fill={domColor(d.exp1.dominant)} fillOpacity={0.45}
                    stroke={domColor(d.exp1.dominant)} strokeWidth="1.5" strokeOpacity={0.9} />
            <text x={EXP_XS[0]} y={cy + 3.5} textAnchor="middle" fontSize="8"
                  fill="#ffffff" fontFamily="Inter, sans-serif" fontWeight="600">
              {(d.exp1.oi / 1000).toFixed(0)}k
            </text>
            {/* Exp 2 */}
            <circle cx={EXP_XS[1]} cy={cy} r={bR(d.exp2.oi)}
                    fill={domColor(d.exp2.dominant)} fillOpacity={0.45}
                    stroke={domColor(d.exp2.dominant)} strokeWidth="1.5" strokeOpacity={0.9} />
            <text x={EXP_XS[1]} y={cy + 3.5} textAnchor="middle" fontSize="8"
                  fill="#ffffff" fontFamily="Inter, sans-serif" fontWeight="600">
              {(d.exp2.oi / 1000).toFixed(0)}k
            </text>
          </g>
        );
      })}
    </svg>
  );
}

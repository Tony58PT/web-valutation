// Horizontal butterfly bar chart: Call (green, left) vs Put (red, right) OI per strike
export interface OIRow {
  strike: number;
  callOI: number;
  putOI: number;
  isSpot?: boolean;
}

const CC = {
  green:    '#059669',
  red:      '#dc2626',
  amber:    '#d97706',
  borderHi: '#334151',
  p2:       '#94a3b8',
  p3:       '#475569',
};

const VB_W      = 540;
const VB_H      = 400;
const LABEL_W   = 46;
const R_PAD     = 12;
const T_PAD     = 22;
const B_PAD     = 10;
const CENTER_X  = LABEL_W + (VB_W - LABEL_W - R_PAD) / 2;
const MAX_BAR   = (VB_W - LABEL_W - R_PAD) / 2 - 8;

export function OIBarChart({ data, spot }: { data: OIRow[]; spot: number }) {
  const maxOI  = Math.max(...data.flatMap((d) => [d.callOI, d.putOI]));
  const rows   = data.length;
  const rowH   = (VB_H - T_PAD - B_PAD) / rows;
  const barH   = Math.min(18, rowH - 10);
  const rowCY  = (i: number) => T_PAD + (i + 0.5) * rowH;
  const barW   = (oi: number) => (oi / maxOI) * MAX_BAR;

  // Spot Y: interpolate between adjacent rows
  const spotIdx  = data.findIndex((d) => d.isSpot);
  const prevIdx  = Math.max(0, spotIdx - 1);
  const prevStr  = data[prevIdx].strike;
  const spotStr  = data[spotIdx].strike;
  const t        = prevStr === spotStr ? 0 : (prevStr - spot) / (prevStr - spotStr);
  const spotY    = rowCY(prevIdx) + t * (rowCY(spotIdx) - rowCY(prevIdx));

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Column headers */}
      <text x={CENTER_X - MAX_BAR * 0.5} y={13} textAnchor="middle" fontSize="9"
            fill={CC.green} fontFamily="Inter, sans-serif" fontWeight="600">◄ CALL OI</text>
      <text x={CENTER_X + MAX_BAR * 0.5} y={13} textAnchor="middle" fontSize="9"
            fill={CC.red} fontFamily="Inter, sans-serif" fontWeight="600">PUT OI ►</text>

      {/* Center axis */}
      <line x1={CENTER_X} y1={T_PAD - 4} x2={CENTER_X} y2={VB_H - B_PAD}
            stroke={CC.borderHi} strokeWidth="1" />

      {/* Rows */}
      {data.map((d, i) => {
        const cy    = rowCY(i);
        const cw    = barW(d.callOI);
        const pw    = barW(d.putOI);
        const cur   = !!d.isSpot;

        return (
          <g key={d.strike}>
            {/* Spot row background */}
            {cur && (
              <rect x={LABEL_W} y={cy - rowH / 2} width={VB_W - LABEL_W - R_PAD}
                    height={rowH} fill={CC.amber} fillOpacity={0.06} />
            )}
            {/* Row separator */}
            <line x1={LABEL_W} y1={cy + rowH / 2} x2={VB_W - R_PAD} y2={cy + rowH / 2}
                  stroke={CC.borderHi} strokeWidth="0.3" strokeOpacity="0.35" />
            {/* Call bar */}
            <rect x={CENTER_X - cw} y={cy - barH / 2} width={cw} height={barH}
                  rx="2" fill={CC.green} fillOpacity={cur ? 1 : 0.75} />
            {/* Put bar */}
            <rect x={CENTER_X} y={cy - barH / 2} width={pw} height={barH}
                  rx="2" fill={CC.red} fillOpacity={cur ? 1 : 0.75} />
            {/* OI value labels */}
            {cw > 22 && (
              <text x={CENTER_X - cw - 3} y={cy + 4} textAnchor="end" fontSize="9"
                    fill={CC.green} fontFamily="Inter, sans-serif">
                {(d.callOI / 1000).toFixed(0)}k
              </text>
            )}
            {pw > 22 && (
              <text x={CENTER_X + pw + 3} y={cy + 4} textAnchor="start" fontSize="9"
                    fill={CC.red} fontFamily="Inter, sans-serif">
                {(d.putOI / 1000).toFixed(0)}k
              </text>
            )}
            {/* Strike label */}
            <text x={LABEL_W - 5} y={cy + 4} textAnchor="end" fontSize="11"
                  fill={cur ? CC.amber : CC.p2}
                  fontWeight={cur ? 700 : 400}
                  fontFamily="Inter, sans-serif">
              {d.strike}
            </text>
          </g>
        );
      })}

      {/* Spot horizontal line */}
      <line x1={LABEL_W} y1={spotY} x2={VB_W - R_PAD} y2={spotY}
            stroke={CC.amber} strokeWidth="1.5" strokeDasharray="6 4" />
      <text x={CENTER_X + 4} y={spotY - 5} fontSize="9"
            fill={CC.amber} fontFamily="Inter, sans-serif" fontWeight="700">
        SPOT {spot}
      </text>
    </svg>
  );
}

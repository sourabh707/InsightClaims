import { useState, useRef, useCallback } from 'react';

const CITY_LABELS = [
  'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi NCR',
  'Chennai', 'Kolkata', 'Coimbatore', 'Gurugram', 'Ranga Reddy',
];

const DISEASE_LABELS = [
  'Cataract', 'GI Disorders', 'Infectious', 'Cancer',
  'Kidney', 'Respiratory', 'Caesarean', 'Injuries', 'Cardiac', 'Musculo',
];

// Estimated city × disease case matrix (rows = cities, cols = diseases)
// Derived from national disease proportions with metro/city-type bias applied
const MATRIX = [
  [32200, 31500, 30800, 35500, 24300, 24000, 20600, 18800, 19300, 16600], // Bengaluru
  [21400, 23100, 22000, 28500, 17900, 17200, 15900, 14600, 17800, 15200], // Mumbai
  [12700, 12300, 11800, 12900,  9800,  9400,  8700,  7900,  6900,  7200], // Hyderabad
  [13100, 12400, 11700, 12400,  9700,  9100,  8700,  7700,  7100,  7100], // Pune
  [ 8800,  9500, 10100, 10200,  7500,  8400,  6200,  6400,  7900,  5900], // Delhi NCR
  [10600,  9100,  8500,  8900,  7500,  7400,  6100,  5600,  5200,  5000], // Chennai
  [ 5500,  5300,  5200,  5500,  4300,  4200,  3900,  3600,  3300,  3200], // Kolkata
  [ 6800,  4900,  4700,  4300,  4100,  5500,  3700,  3800,  2700,  3200], // Coimbatore
  [ 4100,  4800,  4600,  5100,  3700,  4100,  3100,  3200,  4200,  3300], // Gurugram
  [ 4600,  4300,  4000,  4400,  3700,  3300,  3200,  2900,  2600,  2800], // Ranga Reddy
];

const MAX_VAL = Math.max(...MATRIX.flat());

// Cream → orange → dark red heat scale
function cellColor(val) {
  const t = val / MAX_VAL;
  if (t < 0.5) {
    const s = t * 2;
    const r = Math.round(255 + (251 - 255) * s);
    const g = Math.round(251 + (146 - 251) * s);
    const b = Math.round(235 + (60  - 235) * s);
    return `rgb(${r},${g},${b})`;
  }
  const s = (t - 0.5) * 2;
  const r = Math.round(251 + (153 - 251) * s);
  const g = Math.round(146 + (27  - 146) * s);
  const b = Math.round(60  + (27  - 60 ) * s);
  return `rgb(${r},${g},${b})`;
}

function textColor(val) { return val / MAX_VAL > 0.35 ? '#fff' : '#374151'; }
function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString(); }

const LEGEND_STEPS = [0, 0.14, 0.28, 0.43, 0.57, 0.71, 0.86, 1.0];

const COL_SUMS = DISEASE_LABELS.map((_, ci) => MATRIX.reduce((s, row) => s + row[ci], 0));
const ROW_SUMS = MATRIX.map((row) => row.reduce((s, v) => s + v, 0));

export default function DiseaseHeatmap() {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const onMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const CW = containerRef.current?.offsetWidth ?? 900;
  const CH = containerRef.current?.offsetHeight ?? 500;
  const TW = 210, TH = 90, OFF = 14;
  const tx = mousePos.x + OFF + TW > CW ? mousePos.x - TW - OFF : mousePos.x + OFF;
  const ty = mousePos.y + OFF + TH > CH ? mousePos.y - TH - OFF : mousePos.y + OFF;

  const tip = hovered
    ? { city: CITY_LABELS[hovered.row], disease: DISEASE_LABELS[hovered.col], val: MATRIX[hovered.row][hovered.col] }
    : null;

  return (
    <div className="px-4 pb-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">City × Disease Heatmap</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Top 10 cities · Top 10 diseases · Estimated case volume · hover for details</p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[9px] text-gray-400 shrink-0">Low</span>
            <div className="flex rounded overflow-hidden" style={{ height: 12 }}>
              {LEGEND_STEPS.map((t) => (
                <div key={t} style={{ width: 26, height: '100%', background: cellColor(t * MAX_VAL) }} />
              ))}
            </div>
            <span className="text-[9px] text-gray-400 shrink-0">High</span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-x-auto select-none p-4"
          onMouseMove={onMove}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={{ minWidth: 720 }}>
            {/* Disease header row */}
            <div className="flex mb-1">
              <div style={{ width: 112, flexShrink: 0 }} />
              {DISEASE_LABELS.map((d) => (
                <div
                  key={d}
                  className="flex-1 text-center px-0.5 pb-2"
                  style={{ fontSize: 9, fontWeight: 700, color: '#4B5563', lineHeight: 1.3 }}
                >
                  {d}
                </div>
              ))}
              <div style={{ width: 48, flexShrink: 0, fontSize: 9, fontWeight: 700, color: '#4B5563', textAlign: 'center', paddingBottom: 8 }}>
                Total
              </div>
            </div>

            {/* Data rows */}
            {MATRIX.map((row, ri) => (
              <div key={ri} className="flex items-center mb-1">
                <div
                  style={{ width: 112, flexShrink: 0, fontSize: 10, fontWeight: 600, color: '#374151', textAlign: 'right', paddingRight: 10 }}
                >
                  {CITY_LABELS[ri]}
                </div>
                {row.map((val, ci) => {
                  const isHov = hovered?.row === ri && hovered?.col === ci;
                  return (
                    <div
                      key={ci}
                      className="flex-1 mx-px rounded flex items-center justify-center cursor-default"
                      style={{
                        height: 40,
                        background: cellColor(val),
                        boxShadow: isHov ? '0 0 0 2px #185FA5, 0 2px 8px rgba(0,0,0,.15)' : 'none',
                        transform: isHov ? 'scale(1.06)' : 'scale(1)',
                        position: 'relative',
                        zIndex: isHov ? 10 : 1,
                        transition: 'transform 0.1s, box-shadow 0.1s',
                      }}
                      onMouseEnter={() => setHovered({ row: ri, col: ci })}
                    >
                      <span style={{ fontSize: 9, fontWeight: 700, color: textColor(val) }}>{fmt(val)}</span>
                    </div>
                  );
                })}
                {/* Row total */}
                <div
                  style={{ width: 48, flexShrink: 0, fontSize: 9, fontWeight: 700, color: '#185FA5', textAlign: 'center' }}
                >
                  {fmt(ROW_SUMS[ri])}
                </div>
              </div>
            ))}

            {/* Column totals row */}
            <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
              <div
                style={{ width: 112, flexShrink: 0, fontSize: 9, fontWeight: 700, color: '#6B7280', textAlign: 'right', paddingRight: 10 }}
              >
                Disease total ↓
              </div>
              {COL_SUMS.map((s, ci) => (
                <div
                  key={ci}
                  className="flex-1 mx-px text-center"
                  style={{ fontSize: 9, fontWeight: 700, color: '#185FA5' }}
                >
                  {fmt(s)}
                </div>
              ))}
              <div style={{ width: 48, flexShrink: 0 }} />
            </div>
          </div>

          {/* Hover tooltip */}
          {tip && (
            <div
              className="absolute pointer-events-none z-20 bg-white border border-gray-200 rounded-lg shadow-xl"
              style={{ left: tx, top: ty, width: TW }}
            >
              <div className="px-3 pt-2 pb-1 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-800">{tip.city}</p>
                <p className="text-[10px] text-gray-400">{tip.disease}</p>
              </div>
              <div className="px-3 py-2 flex justify-between items-center">
                <span className="text-[10px] text-gray-500">Est. cases</span>
                <span className="text-sm font-bold text-[#C2410C]">{tip.val.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

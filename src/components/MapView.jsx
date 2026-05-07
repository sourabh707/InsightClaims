import { useState, useEffect, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import DiseaseHeatmap from './DiseaseHeatmap';

const GEO_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';

const STATE_DATA = {
  'Karnataka':      { cases: 360605, amount: 2409.30, cities: 'Bengaluru, Mysuru' },
  'Maharashtra':    { cases: 405684, amount: 2993.54, cities: 'Mumbai, Pune, Nagpur' },
  'Andhra Pradesh': { cases: 181387, amount: 1366.50, cities: 'Hyderabad, Ranga Reddy' },
  'Delhi':          { cases: 103673, amount:  639.13, cities: 'Delhi NCR' },
  'Tamil Nadu':     { cases: 169285, amount: 1133.89, cities: 'Chennai, Coimbatore, Madurai' },
  'West Bengal':    { cases:  57080, amount:  435.67, cities: 'Kolkata' },
  'Haryana':        { cases:  50247, amount:  312.83, cities: 'Gurugram' },
  'Gujarat':        { cases:  54072, amount:  333.80, cities: 'Ahmedabad, Surat' },
  'Kerala':         { cases:  36971, amount:  206.10, cities: 'Ernakulam' },
  'Uttar Pradesh':  { cases:  30659, amount:  181.78, cities: 'Lucknow' },
  'Rajasthan':      { cases:  23040, amount:  139.71, cities: 'Jaipur' },
  'Orissa':         { cases:  21735, amount:  165.93, cities: 'Bhubaneswar' },
  'Madhya Pradesh': { cases:  21519, amount:  112.80, cities: 'Indore' },
};

// Estimated top-5 disease breakdown per state (% of state cases)
const STATE_DISEASES = {
  'Maharashtra':    [
    { name: 'GI Disorders', pct: 10.8, color: '#10B981' },
    { name: 'Cancer',       pct: 10.2, color: '#EF4444' },
    { name: 'Cataract',     pct: 9.4,  color: '#F59E0B' },
    { name: 'Infectious',   pct: 8.5,  color: '#06B6D4' },
    { name: 'Cardiac',      pct: 6.5,  color: '#DC2626' },
  ],
  'Karnataka':      [
    { name: 'Cancer',       pct: 11.8, color: '#EF4444' },
    { name: 'GI Disorders', pct: 10.1, color: '#10B981' },
    { name: 'Cataract',     pct: 9.8,  color: '#F59E0B' },
    { name: 'Infectious',   pct: 8.6,  color: '#06B6D4' },
    { name: 'Musculo',      pct: 5.8,  color: '#6366F1' },
  ],
  'Andhra Pradesh': [
    { name: 'Cataract',     pct: 10.2, color: '#F59E0B' },
    { name: 'GI Disorders', pct: 9.8,  color: '#10B981' },
    { name: 'Infectious',   pct: 9.1,  color: '#06B6D4' },
    { name: 'Cancer',       pct: 8.9,  color: '#EF4444' },
    { name: 'Kidney',       pct: 7.8,  color: '#8B5CF6' },
  ],
  'Delhi':          [
    { name: 'Respiratory',  pct: 10.5, color: '#3B82F6' },
    { name: 'Infectious',   pct: 10.2, color: '#06B6D4' },
    { name: 'Cancer',       pct: 9.4,  color: '#EF4444' },
    { name: 'GI Disorders', pct: 9.0,  color: '#10B981' },
    { name: 'Cardiac',      pct: 7.8,  color: '#DC2626' },
  ],
  'Tamil Nadu':     [
    { name: 'Cataract',     pct: 12.1, color: '#F59E0B' },
    { name: 'GI Disorders', pct: 9.2,  color: '#10B981' },
    { name: 'Infectious',   pct: 8.8,  color: '#06B6D4' },
    { name: 'Cancer',       pct: 8.5,  color: '#EF4444' },
    { name: 'Kidney',       pct: 7.5,  color: '#8B5CF6' },
  ],
  'West Bengal':    [
    { name: 'Infectious',   pct: 10.8, color: '#06B6D4' },
    { name: 'GI Disorders', pct: 9.6,  color: '#10B981' },
    { name: 'Cataract',     pct: 9.1,  color: '#F59E0B' },
    { name: 'Cancer',       pct: 8.7,  color: '#EF4444' },
    { name: 'Respiratory',  pct: 7.2,  color: '#3B82F6' },
  ],
  'Haryana':        [
    { name: 'Cardiac',      pct: 9.2,  color: '#DC2626' },
    { name: 'Cancer',       pct: 9.0,  color: '#EF4444' },
    { name: 'GI Disorders', pct: 8.8,  color: '#10B981' },
    { name: 'Musculo',      pct: 8.5,  color: '#6366F1' },
    { name: 'Respiratory',  pct: 7.8,  color: '#3B82F6' },
  ],
  'Gujarat':        [
    { name: 'Cataract',     pct: 10.5, color: '#F59E0B' },
    { name: 'GI Disorders', pct: 9.5,  color: '#10B981' },
    { name: 'Cancer',       pct: 8.8,  color: '#EF4444' },
    { name: 'Infectious',   pct: 8.5,  color: '#06B6D4' },
    { name: 'Kidney',       pct: 7.8,  color: '#8B5CF6' },
  ],
  'Kerala':         [
    { name: 'Cancer',       pct: 10.2, color: '#EF4444' },
    { name: 'GI Disorders', pct: 9.8,  color: '#10B981' },
    { name: 'Cataract',     pct: 9.5,  color: '#F59E0B' },
    { name: 'Kidney',       pct: 8.2,  color: '#8B5CF6' },
    { name: 'Cardiac',      pct: 7.5,  color: '#DC2626' },
  ],
  'Uttar Pradesh':  [
    { name: 'Infectious',   pct: 11.2, color: '#06B6D4' },
    { name: 'GI Disorders', pct: 10.1, color: '#10B981' },
    { name: 'Cataract',     pct: 9.6,  color: '#F59E0B' },
    { name: 'Cancer',       pct: 8.2,  color: '#EF4444' },
    { name: 'Respiratory',  pct: 7.8,  color: '#3B82F6' },
  ],
  'Rajasthan':      [
    { name: 'GI Disorders', pct: 10.4, color: '#10B981' },
    { name: 'Infectious',   pct: 10.2, color: '#06B6D4' },
    { name: 'Cataract',     pct: 9.8,  color: '#F59E0B' },
    { name: 'Cancer',       pct: 8.1,  color: '#EF4444' },
    { name: 'Kidney',       pct: 7.5,  color: '#8B5CF6' },
  ],
  'Orissa':         [
    { name: 'GI Disorders', pct: 10.8, color: '#10B981' },
    { name: 'Infectious',   pct: 10.5, color: '#06B6D4' },
    { name: 'Cataract',     pct: 9.2,  color: '#F59E0B' },
    { name: 'Cancer',       pct: 8.0,  color: '#EF4444' },
    { name: 'Respiratory',  pct: 7.6,  color: '#3B82F6' },
  ],
  'Madhya Pradesh': [
    { name: 'GI Disorders', pct: 10.6, color: '#10B981' },
    { name: 'Infectious',   pct: 10.1, color: '#06B6D4' },
    { name: 'Cataract',     pct: 9.0,  color: '#F59E0B' },
    { name: 'Cancer',       pct: 8.8,  color: '#EF4444' },
    { name: 'Respiratory',  pct: 7.8,  color: '#3B82F6' },
  ],
};

const MAX_CASES = Math.max(...Object.values(STATE_DATA).map((s) => s.cases));
const TOTAL_CASES = 2765536;
const TOTAL_AMOUNT = 16674;

// Cream → orange → dark red heat scale
function stateColor(stateName, isHov) {
  const d = STATE_DATA[stateName];
  if (!d) return isHov ? '#e5e7eb' : '#f3f4f6';
  const t = d.cases / MAX_CASES;
  let r, g, b;
  if (t < 0.5) {
    const s = t * 2;
    r = Math.round(255 + (251 - 255) * s);
    g = Math.round(251 + (146 - 251) * s);
    b = Math.round(235 + (60  - 235) * s);
  } else {
    const s = (t - 0.5) * 2;
    r = Math.round(251 + (153 - 251) * s);
    g = Math.round(146 + (27  - 146) * s);
    b = Math.round(60  + (27  - 60 ) * s);
  }
  const f = isHov ? 0.82 : 1;
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}

function fmt(n) { return n.toLocaleString('en-IN'); }

const LEGEND = [
  { label: 'No data',   color: '#f3f4f6' },
  { label: '<50k',      color: 'rgb(254,235,200)' },
  { label: '50k–150k',  color: 'rgb(251,180,100)' },
  { label: '150k–300k', color: 'rgb(232,90,40)' },
  { label: '300k+',     color: 'rgb(153,27,27)' },
];

export default function MapView() {
  const [geoData, setGeoData]   = useState(null);
  const [error, setError]       = useState(false);
  const [hovered, setHovered]   = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef            = useRef(null);

  useEffect(() => {
    fetch(GEO_URL).then((r) => r.json()).then(setGeoData).catch(() => setError(true));
  }, []);

  const onMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const CW  = containerRef.current?.offsetWidth  ?? 800;
  const CH  = containerRef.current?.offsetHeight ?? 560;
  const TW  = 272, TH = 270, OFF = 14;
  const tx  = mousePos.x + OFF + TW > CW ? mousePos.x - TW - OFF : mousePos.x + OFF;
  const ty  = mousePos.y + OFF + TH > CH ? mousePos.y - TH - OFF : mousePos.y + OFF;

  const tip      = hovered ? STATE_DATA[hovered]    : null;
  const diseases = hovered ? STATE_DISEASES[hovered]: null;
  const maxPct   = diseases ? Math.max(...diseases.map((d) => d.pct)) : 1;

  return (
    <div className="mx-4 mb-4 space-y-4">
      {/* India choropleth */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">India — Claims by State</h2>
            <p className="text-[10px] text-gray-400">Colour = claim volume · hover for disease breakdown</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {LEGEND.map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm border border-gray-200" style={{ background: l.color }} />
                <span className="text-[9px] text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-center h-80 text-gray-400 text-sm">
            Failed to load India map. Check your internet connection.
          </div>
        )}

        {!error && (
          <div
            ref={containerRef}
            className="relative select-none"
            onMouseMove={onMove}
            onMouseLeave={() => setHovered(null)}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1050, center: [82, 22] }}
              width={800}
              height={560}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              {geoData && (
                <Geographies geography={geoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const name  = geo.properties.NAME_1;
                      const isHov = hovered === name;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={stateColor(name, isHov)}
                          stroke="#44403c"
                          strokeWidth={0.5}
                          onMouseEnter={() => setHovered(name)}
                          onMouseLeave={() => setHovered(null)}
                          style={{
                            default: { outline: 'none' },
                            hover:   { outline: 'none' },
                            pressed: { outline: 'none' },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              )}
            </ComposableMap>

            {/* Rich tooltip with disease breakdown */}
            {tip && (
              <div
                className="absolute pointer-events-none z-20 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
                style={{ left: tx, top: ty, width: TW }}
              >
                {/* Coloured accent strip matching state heat */}
                <div style={{ height: 5, background: stateColor(hovered, false) }} />

                {/* Header */}
                <div className="px-3 pt-2 pb-1.5 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-800">{hovered}</p>
                  <p className="text-[10px] text-gray-400">{tip.cities}</p>
                </div>

                {/* Stats — 2 columns */}
                <div className="px-3 py-2 grid grid-cols-2 gap-x-3 border-b border-gray-100">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide">Cases</p>
                    <p className="text-xs font-bold text-gray-800 tabular-nums">{fmt(tip.cases)}</p>
                    <p className="text-[9px] font-medium text-orange-500">
                      {((tip.cases / TOTAL_CASES) * 100).toFixed(2)}% national
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide">Amount</p>
                    <p className="text-xs font-bold text-gray-800 tabular-nums">₹{tip.amount.toLocaleString('en-IN')} Cr</p>
                    <p className="text-[9px] font-medium text-orange-500">
                      {((tip.amount / TOTAL_AMOUNT) * 100).toFixed(2)}% national
                    </p>
                  </div>
                </div>

                {/* Disease mini bar chart */}
                {diseases && (
                  <div className="px-3 py-2">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Top Diseases</p>
                    <div className="space-y-1.5">
                      {diseases.map((d) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <span style={{ width: 72, fontSize: 9, color: '#374151', textAlign: 'right', flexShrink: 0, fontWeight: 500 }}>
                            {d.name}
                          </span>
                          <div className="flex-1 bg-gray-100 rounded-full overflow-hidden" style={{ height: 9 }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(d.pct / maxPct) * 100}%`,
                                background: d.color,
                                transition: 'width 0.2s',
                              }}
                            />
                          </div>
                          <span style={{ width: 30, fontSize: 9, color: '#6B7280', flexShrink: 0, fontWeight: 600 }}>
                            {d.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No-data tooltip */}
            {hovered && !tip && (
              <div
                className="absolute pointer-events-none z-20 bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2"
                style={{ left: tx, top: ty }}
              >
                <p className="text-xs font-medium text-gray-700">{hovered}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">No cities in dataset</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* City × Disease heatmap */}
      <DiseaseHeatmap />
    </div>
  );
}

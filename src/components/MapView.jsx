import { useState, useEffect, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import DiseaseHeatmap from './DiseaseHeatmap';
import { CITIES } from '../data';

const GEO_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';

// All Indian states — high-volume states have real data; others estimated
const STATE_DATA = {
  // ── Real data (from dataset) ──────────────────────────────
  'Maharashtra':         { cases: 405684, amount: 2993.54, cities: 'Mumbai, Pune, Nagpur' },
  'Karnataka':           { cases: 360605, amount: 2409.30, cities: 'Bengaluru, Mysuru' },
  'Andhra Pradesh':      { cases: 181387, amount: 1366.50, cities: 'Hyderabad, Ranga Reddy' },
  'Tamil Nadu':          { cases: 169285, amount: 1133.89, cities: 'Chennai, Coimbatore, Madurai' },
  'Delhi':               { cases: 103673, amount:  639.13, cities: 'Delhi NCR' },
  'West Bengal':         { cases:  57080, amount:  435.67, cities: 'Kolkata' },
  'Gujarat':             { cases:  54072, amount:  333.80, cities: 'Ahmedabad, Surat' },
  'Haryana':             { cases:  50247, amount:  312.83, cities: 'Gurugram' },
  'Kerala':              { cases:  36971, amount:  206.10, cities: 'Ernakulam' },
  'Uttar Pradesh':       { cases:  30659, amount:  181.78, cities: 'Lucknow' },
  'Rajasthan':           { cases:  23040, amount:  139.71, cities: 'Jaipur' },
  'Orissa':              { cases:  21735, amount:  165.93, cities: 'Bhubaneswar' },
  'Madhya Pradesh':      { cases:  21519, amount:  112.80, cities: 'Indore' },
  // ── Estimated data ────────────────────────────────────────
  'Punjab':              { cases: 18200, amount: 109.20, cities: 'Chandigarh, Amritsar, Ludhiana' },
  'Bihar':               { cases: 14100, amount:  84.70, cities: 'Patna' },
  'Uttaranchal':         { cases:  9200, amount:  55.30, cities: 'Dehradun' },
  'Jharkhand':           { cases:  9100, amount:  54.70, cities: 'Ranchi, Jamshedpur' },
  'Chhattisgarh':        { cases:  8600, amount:  51.60, cities: 'Raipur' },
  'Assam':               { cases:  7100, amount:  42.70, cities: 'Guwahati' },
  'Jammu and Kashmir':   { cases:  6100, amount:  36.70, cities: 'Srinagar, Jammu' },
  'Himachal Pradesh':    { cases:  5100, amount:  30.70, cities: 'Shimla' },
  'Goa':                 { cases:  4600, amount:  27.70, cities: 'Panaji' },
  'Chandigarh':          { cases:  3600, amount:  21.60, cities: 'Chandigarh' },
  'Puducherry':          { cases:  2900, amount:  17.40, cities: 'Puducherry' },
  'Meghalaya':           { cases:  1850, amount:  11.10, cities: 'Shillong' },
  'Tripura':             { cases:  1450, amount:   8.70, cities: 'Agartala' },
  'Manipur':             { cases:   920, amount:   5.50, cities: 'Imphal' },
  'Nagaland':            { cases:   670, amount:   4.00, cities: 'Kohima' },
  'Mizoram':             { cases:   560, amount:   3.40, cities: 'Aizawl' },
  'Arunachal Pradesh':   { cases:   460, amount:   2.80, cities: 'Itanagar' },
  'Sikkim':              { cases:   330, amount:   2.00, cities: 'Gangtok' },
  'Dadra and Nagar Haveli': { cases: 225, amount:  1.40, cities: 'Silvassa' },
  'Daman and Diu':       { cases:   205, amount:   1.20, cities: 'Daman' },
  'Andaman and Nicobar': { cases:   175, amount:   1.10, cities: 'Port Blair' },
  'Lakshadweep':         { cases:    58, amount:   0.35, cities: 'Kavaratti' },
};

// Top-5 disease breakdown per state
const STATE_DISEASES = {
  'Maharashtra':    [
    { name: 'GI Disorders', pct: 10.8, color: '#10B981' },
    { name: 'Cancer',       pct: 10.2, color: '#EF4444' },
    { name: 'Cataract',     pct:  9.4, color: '#F59E0B' },
    { name: 'Infectious',   pct:  8.5, color: '#06B6D4' },
    { name: 'Cardiac',      pct:  6.5, color: '#DC2626' },
  ],
  'Karnataka':      [
    { name: 'Cancer',       pct: 11.8, color: '#EF4444' },
    { name: 'GI Disorders', pct: 10.1, color: '#10B981' },
    { name: 'Cataract',     pct:  9.8, color: '#F59E0B' },
    { name: 'Infectious',   pct:  8.6, color: '#06B6D4' },
    { name: 'Musculo',      pct:  5.8, color: '#6366F1' },
  ],
  'Andhra Pradesh': [
    { name: 'Cataract',     pct: 10.2, color: '#F59E0B' },
    { name: 'GI Disorders', pct:  9.8, color: '#10B981' },
    { name: 'Infectious',   pct:  9.1, color: '#06B6D4' },
    { name: 'Cancer',       pct:  8.9, color: '#EF4444' },
    { name: 'Kidney',       pct:  7.8, color: '#8B5CF6' },
  ],
  'Tamil Nadu':     [
    { name: 'Cataract',     pct: 12.1, color: '#F59E0B' },
    { name: 'GI Disorders', pct:  9.2, color: '#10B981' },
    { name: 'Infectious',   pct:  8.8, color: '#06B6D4' },
    { name: 'Cancer',       pct:  8.5, color: '#EF4444' },
    { name: 'Kidney',       pct:  7.5, color: '#8B5CF6' },
  ],
  'Delhi':          [
    { name: 'Respiratory',  pct: 10.5, color: '#3B82F6' },
    { name: 'Infectious',   pct: 10.2, color: '#06B6D4' },
    { name: 'Cancer',       pct:  9.4, color: '#EF4444' },
    { name: 'GI Disorders', pct:  9.0, color: '#10B981' },
    { name: 'Cardiac',      pct:  7.8, color: '#DC2626' },
  ],
  'West Bengal':    [
    { name: 'Infectious',   pct: 10.8, color: '#06B6D4' },
    { name: 'GI Disorders', pct:  9.6, color: '#10B981' },
    { name: 'Cataract',     pct:  9.1, color: '#F59E0B' },
    { name: 'Cancer',       pct:  8.7, color: '#EF4444' },
    { name: 'Respiratory',  pct:  7.2, color: '#3B82F6' },
  ],
  'Gujarat':        [
    { name: 'Cataract',     pct: 10.5, color: '#F59E0B' },
    { name: 'GI Disorders', pct:  9.5, color: '#10B981' },
    { name: 'Cancer',       pct:  8.8, color: '#EF4444' },
    { name: 'Infectious',   pct:  8.5, color: '#06B6D4' },
    { name: 'Kidney',       pct:  7.8, color: '#8B5CF6' },
  ],
  'Haryana':        [
    { name: 'Cardiac',      pct:  9.2, color: '#DC2626' },
    { name: 'Cancer',       pct:  9.0, color: '#EF4444' },
    { name: 'GI Disorders', pct:  8.8, color: '#10B981' },
    { name: 'Musculo',      pct:  8.5, color: '#6366F1' },
    { name: 'Respiratory',  pct:  7.8, color: '#3B82F6' },
  ],
  'Kerala':         [
    { name: 'Cancer',       pct: 10.2, color: '#EF4444' },
    { name: 'GI Disorders', pct:  9.8, color: '#10B981' },
    { name: 'Cataract',     pct:  9.5, color: '#F59E0B' },
    { name: 'Kidney',       pct:  8.2, color: '#8B5CF6' },
    { name: 'Cardiac',      pct:  7.5, color: '#DC2626' },
  ],
  'Uttar Pradesh':  [
    { name: 'Infectious',   pct: 11.2, color: '#06B6D4' },
    { name: 'GI Disorders', pct: 10.1, color: '#10B981' },
    { name: 'Cataract',     pct:  9.6, color: '#F59E0B' },
    { name: 'Cancer',       pct:  8.2, color: '#EF4444' },
    { name: 'Respiratory',  pct:  7.8, color: '#3B82F6' },
  ],
  'Rajasthan':      [
    { name: 'GI Disorders', pct: 10.4, color: '#10B981' },
    { name: 'Infectious',   pct: 10.2, color: '#06B6D4' },
    { name: 'Cataract',     pct:  9.8, color: '#F59E0B' },
    { name: 'Cancer',       pct:  8.1, color: '#EF4444' },
    { name: 'Kidney',       pct:  7.5, color: '#8B5CF6' },
  ],
  'Orissa':         [
    { name: 'GI Disorders', pct: 10.8, color: '#10B981' },
    { name: 'Infectious',   pct: 10.5, color: '#06B6D4' },
    { name: 'Cataract',     pct:  9.2, color: '#F59E0B' },
    { name: 'Cancer',       pct:  8.0, color: '#EF4444' },
    { name: 'Respiratory',  pct:  7.6, color: '#3B82F6' },
  ],
  'Madhya Pradesh': [
    { name: 'GI Disorders', pct: 10.6, color: '#10B981' },
    { name: 'Infectious',   pct: 10.1, color: '#06B6D4' },
    { name: 'Cataract',     pct:  9.0, color: '#F59E0B' },
    { name: 'Cancer',       pct:  8.8, color: '#EF4444' },
    { name: 'Respiratory',  pct:  7.8, color: '#3B82F6' },
  ],
  'Punjab':         [
    { name: 'Cardiac',      pct:  9.8, color: '#DC2626' },
    { name: 'Cancer',       pct:  9.5, color: '#EF4444' },
    { name: 'GI Disorders', pct:  9.1, color: '#10B981' },
    { name: 'Cataract',     pct:  8.8, color: '#F59E0B' },
    { name: 'Musculo',      pct:  7.2, color: '#6366F1' },
  ],
  'Bihar':          [
    { name: 'Infectious',   pct: 13.2, color: '#06B6D4' },
    { name: 'GI Disorders', pct: 11.8, color: '#10B981' },
    { name: 'Cataract',     pct: 10.1, color: '#F59E0B' },
    { name: 'Respiratory',  pct:  8.5, color: '#3B82F6' },
    { name: 'Kidney',       pct:  7.4, color: '#8B5CF6' },
  ],
  'Uttaranchal':    [
    { name: 'Respiratory',  pct: 10.8, color: '#3B82F6' },
    { name: 'GI Disorders', pct:  9.6, color: '#10B981' },
    { name: 'Musculo',      pct:  9.2, color: '#6366F1' },
    { name: 'Cataract',     pct:  8.8, color: '#F59E0B' },
    { name: 'Cancer',       pct:  8.0, color: '#EF4444' },
  ],
  'Assam':          [
    { name: 'Infectious',   pct: 12.4, color: '#06B6D4' },
    { name: 'GI Disorders', pct: 10.9, color: '#10B981' },
    { name: 'Cancer',       pct:  9.5, color: '#EF4444' },
    { name: 'Respiratory',  pct:  8.8, color: '#3B82F6' },
    { name: 'Cataract',     pct:  8.1, color: '#F59E0B' },
  ],
  'Jammu and Kashmir': [
    { name: 'Respiratory',  pct: 11.5, color: '#3B82F6' },
    { name: 'GI Disorders', pct:  9.8, color: '#10B981' },
    { name: 'Musculo',      pct:  9.4, color: '#6366F1' },
    { name: 'Cancer',       pct:  8.6, color: '#EF4444' },
    { name: 'Cataract',     pct:  8.2, color: '#F59E0B' },
  ],
};

const MAX_CASES      = Math.max(...Object.values(STATE_DATA).map((s) => s.cases));
const CITY_MAX_CASES = Math.max(...CITIES.map((c) => c.cases));
const TOTAL_CASES    = 2765536;
const TOTAL_AMOUNT   = 16674;

// Cream → orange → dark-red heat scale
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
  const f = isHov ? 0.80 : 1;
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}

function markerRadius(cases) {
  return 2.5 + 8.5 * Math.sqrt(cases / CITY_MAX_CASES);
}

function fmt(n) { return n.toLocaleString('en-IN'); }

const LEGEND = [
  { label: 'Low',    color: 'rgb(255,245,210)' },
  { label: '~10k',   color: 'rgb(254,215,150)' },
  { label: '~50k',   color: 'rgb(251,165,80)'  },
  { label: '~150k',  color: 'rgb(220,80,30)'   },
  { label: '400k+',  color: 'rgb(153,27,27)'   },
];

export default function MapView() {
  const [geoData, setGeoData]     = useState(null);
  const [error, setError]         = useState(false);
  const [hovered, setHovered]     = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const containerRef              = useRef(null);

  useEffect(() => {
    fetch(GEO_URL).then((r) => r.json()).then(setGeoData).catch(() => setError(true));
  }, []);

  const onMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const CW = containerRef.current?.offsetWidth  ?? 800;
  const CH = containerRef.current?.offsetHeight ?? 560;

  // State tooltip dims
  const STW = 272, STH = 280, OFF = 14;
  const stx = mousePos.x + OFF + STW > CW ? mousePos.x - STW - OFF : mousePos.x + OFF;
  const sty = mousePos.y + OFF + STH > CH ? mousePos.y - STH - OFF : mousePos.y + OFF;

  // City tooltip dims
  const CTW = 230, CTH = 130;
  const ctx = mousePos.x + OFF + CTW > CW ? mousePos.x - CTW - OFF : mousePos.x + OFF;
  const cty = mousePos.y + OFF + CTH > CH ? mousePos.y - CTH - OFF : mousePos.y + OFF;

  const tip      = hovered ? STATE_DATA[hovered]     : null;
  const diseases = hovered ? STATE_DISEASES[hovered] : null;
  const maxPct   = diseases ? Math.max(...diseases.map((d) => d.pct)) : 1;

  return (
    <div className="mx-4 mb-4 space-y-4">
      {/* ── India choropleth ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">India — Claims by State</h2>
            <p className="text-[10px] text-gray-400">Colour = claim volume · hover state or city for details</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {LEGEND.map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm border border-gray-200" style={{ background: l.color }} />
                <span className="text-[9px] text-gray-500">{l.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1 ml-1 pl-2 border-l border-gray-200">
              <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-700" />
              <span className="text-[9px] text-gray-500">City hub</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-center h-80 text-gray-400 text-sm">
            Failed to load map. Check internet connection.
          </div>
        )}

        {!error && (
          <div
            ref={containerRef}
            className="relative select-none"
            onMouseMove={onMove}
            onMouseLeave={() => { setHovered(null); setHoveredCity(null); }}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1050, center: [82, 22] }}
              width={800}
              height={560}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              {/* State fills */}
              {geoData && (
                <Geographies geography={geoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const name  = geo.properties.NAME_1;
                      const isHov = hovered === name && !hoveredCity;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={stateColor(name, isHov)}
                          stroke="#78716c"
                          strokeWidth={0.4}
                          onMouseEnter={() => { setHovered(name); setHoveredCity(null); }}
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

              {/* City markers */}
              {CITIES.map((city) => {
                const r     = markerRadius(city.cases);
                const isHov = hoveredCity?.name === city.name;
                const labelSize = 6 + (1 - (city.rank - 1) / 19) * 2;
                return (
                  <Marker key={city.name} coordinates={[city.lng, city.lat]}>
                    {/* Glow ring for hovered */}
                    {isHov && (
                      <circle
                        r={r + 4}
                        fill="none"
                        stroke="#F97316"
                        strokeWidth={1.5}
                        strokeOpacity={0.5}
                      />
                    )}
                    {/* Main dot */}
                    <circle
                      r={r}
                      fill="rgba(255,255,255,0.92)"
                      stroke={isHov ? '#EA580C' : '#44403c'}
                      strokeWidth={isHov ? 2 : 1}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => { setHoveredCity(city); setHovered(null); }}
                      onMouseLeave={() => setHoveredCity(null)}
                    />
                    {/* City label */}
                    <text
                      textAnchor="middle"
                      y={-(r + 3)}
                      style={{
                        fontSize: labelSize,
                        fill: isHov ? '#EA580C' : '#1F2937',
                        fontWeight: isHov ? 700 : 600,
                        pointerEvents: 'none',
                        paintOrder: 'stroke',
                        stroke: 'white',
                        strokeWidth: 2.5,
                        strokeLinejoin: 'round',
                      }}
                    >
                      {city.name}
                    </text>
                  </Marker>
                );
              })}
            </ComposableMap>

            {/* City tooltip */}
            {hoveredCity && (
              <div
                className="absolute pointer-events-none z-30 bg-white border border-orange-200 rounded-xl shadow-2xl overflow-hidden"
                style={{ left: ctx, top: cty, width: CTW }}
              >
                <div style={{ height: 4, background: '#F97316' }} />
                <div className="px-3 pt-2 pb-1.5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{hoveredCity.name}</p>
                    <p className="text-[10px] text-gray-400">Rank #{hoveredCity.rank} city</p>
                  </div>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: '#F97316' }}
                  >
                    #{hoveredCity.rank}
                  </div>
                </div>
                <div className="px-3 py-2 grid grid-cols-2 gap-x-3">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide">Cases</p>
                    <p className="text-xs font-bold text-gray-800 tabular-nums">{fmt(hoveredCity.cases)}</p>
                    <p className="text-[9px] font-medium text-orange-500">
                      {((hoveredCity.cases / TOTAL_CASES) * 100).toFixed(2)}% national
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide">Amount</p>
                    <p className="text-xs font-bold text-gray-800 tabular-nums">₹{hoveredCity.amount.toLocaleString('en-IN')} Cr</p>
                  </div>
                </div>
              </div>
            )}

            {/* State tooltip with disease bars */}
            {!hoveredCity && tip && (
              <div
                className="absolute pointer-events-none z-20 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
                style={{ left: stx, top: sty, width: STW }}
              >
                <div style={{ height: 5, background: stateColor(hovered, false) }} />
                <div className="px-3 pt-2 pb-1.5 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-800">{hovered}</p>
                  <p className="text-[10px] text-gray-400">{tip.cities}</p>
                </div>
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
                {diseases && (
                  <div className="px-3 py-2">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Top Diseases</p>
                    <div className="space-y-1.5">
                      {diseases.map((d) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <span style={{ width: 76, fontSize: 9, color: '#374151', textAlign: 'right', flexShrink: 0, fontWeight: 500 }}>
                            {d.name}
                          </span>
                          <div className="flex-1 bg-gray-100 rounded-full overflow-hidden" style={{ height: 9 }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(d.pct / maxPct) * 100}%`, background: d.color }}
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

            {/* No-data state */}
            {!hoveredCity && hovered && !tip && (
              <div
                className="absolute pointer-events-none z-20 bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2"
                style={{ left: stx, top: sty }}
              >
                <p className="text-xs font-medium text-gray-700">{hovered}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">No data available</p>
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

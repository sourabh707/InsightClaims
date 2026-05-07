import { useState, useEffect, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';

// Aggregated by state (GeoJSON uses old names: Orissa, Uttaranchal; no Telangana)
const STATE_DATA = {
  'Karnataka':       { cases: 360605, amount: 2409.30, cities: 'Bengaluru, Mysuru' },
  'Maharashtra':     { cases: 405684, amount: 2993.54, cities: 'Mumbai, Pune, Nagpur' },
  'Andhra Pradesh':  { cases: 181387, amount: 1366.50, cities: 'Hyderabad, Ranga Reddy' },
  'Delhi':           { cases: 103673, amount:  639.13, cities: 'Delhi NCR' },
  'Tamil Nadu':      { cases: 169285, amount: 1133.89, cities: 'Chennai, Coimbatore, Madurai' },
  'West Bengal':     { cases:  57080, amount:  435.67, cities: 'Kolkata' },
  'Haryana':         { cases:  50247, amount:  312.83, cities: 'Gurugram' },
  'Gujarat':         { cases:  54072, amount:  333.80, cities: 'Ahmedabad, Surat' },
  'Kerala':          { cases:  36971, amount:  206.10, cities: 'Ernakulam' },
  'Uttar Pradesh':   { cases:  30659, amount:  181.78, cities: 'Lucknow' },
  'Rajasthan':       { cases:  23040, amount:  139.71, cities: 'Jaipur' },
  'Orissa':          { cases:  21735, amount:  165.93, cities: 'Bhubaneswar' },
  'Madhya Pradesh':  { cases:  21519, amount:  112.80, cities: 'Indore' },
};

const MAX_CASES = Math.max(...Object.values(STATE_DATA).map((s) => s.cases)); // 405684
const TOTAL_CASES = 2765536;
const TOTAL_AMOUNT = 16674;

// Interpolate light-blue → dark-blue by ratio
function stateColor(stateName, hovered) {
  const d = STATE_DATA[stateName];
  if (!d) return hovered ? '#e2e8f0' : '#f1f5f9';
  const t = d.cases / MAX_CASES;
  // #dbeafe (219,234,254) → #1e40af (30,64,175)
  const r = Math.round(219 + (30  - 219) * t);
  const g = Math.round(234 + (64  - 234) * t);
  const b = Math.round(254 + (175 - 254) * t);
  const factor = hovered ? 0.85 : 1;
  return `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(b * factor)})`;
}

function fmt(n) { return n.toLocaleString('en-IN'); }

// Legend steps
const LEGEND = [
  { label: 'No data',  color: '#f1f5f9' },
  { label: '<50k',     color: stateColor('_50k') || 'rgb(205,220,252)' },
  { label: '50k–150k', color: 'rgb(155,189,243)' },
  { label: '150k–300k',color: 'rgb(90,140,220)' },
  { label: '300k+',    color: 'rgb(30,64,175)' },
];

export default function MapView() {
  const [geoData, setGeoData]     = useState(null);
  const [error, setError]         = useState(false);
  const [hovered, setHovered]     = useState(null); // state name
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

  // Flip tooltip so it stays inside container
  const CW = containerRef.current?.offsetWidth ?? 800;
  const CH = containerRef.current?.offsetHeight ?? 560;
  const TW = 240, TH = 170, OFF = 14;
  const tx = mousePos.x + OFF + TW > CW ? mousePos.x - TW - OFF : mousePos.x + OFF;
  const ty = mousePos.y + OFF + TH > CH ? mousePos.y - TH - OFF : mousePos.y + OFF;

  const tip = hovered ? STATE_DATA[hovered] : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mx-4 mb-4">
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">India — Claims by State</h2>
          <p className="text-[10px] text-gray-400">Colour intensity = approved cases · hover state for details</p>
        </div>
        {/* Inline legend */}
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
                    const name = geo.properties.NAME_1;
                    const isHov = hovered === name;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={stateColor(name, isHov)}
                        stroke="#000000"
                        strokeWidth={0.4}
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

          {/* Tooltip near cursor */}
          {tip && (
            <div
              className="absolute pointer-events-none z-20 bg-white border border-gray-200 rounded-xl shadow-xl"
              style={{ left: tx, top: ty, width: TW }}
            >
              <div className="px-3 pt-2.5 pb-1.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{hovered}</p>
                <p className="text-[10px] text-gray-400">{tip.cities}</p>
              </div>
              <div className="px-3 py-2 space-y-2">
                {/* Cases */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-[10px] font-medium text-gray-600">Cases</p>
                    <p className="text-[9px] text-gray-400">Total approved claims</p>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 tabular-nums">{fmt(tip.cases)}</p>
                </div>
                {/* Share of cases */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-[10px] font-medium text-gray-600">Share</p>
                    <p className="text-[9px] text-gray-400">of {fmt(TOTAL_CASES)} total</p>
                  </div>
                  <p className="text-xs font-semibold text-[#185FA5] tabular-nums">
                    {((tip.cases / TOTAL_CASES) * 100).toFixed(2)}%
                  </p>
                </div>
                {/* Amount */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-[10px] font-medium text-gray-600">Amount</p>
                    <p className="text-[9px] text-gray-400">Approved payout</p>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 tabular-nums">₹{tip.amount.toLocaleString('en-IN')} Cr</p>
                </div>
                {/* Amt share */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-[10px] font-medium text-gray-600">Amt Share</p>
                    <p className="text-[9px] text-gray-400">of ₹{fmt(TOTAL_AMOUNT)} Cr national</p>
                  </div>
                  <p className="text-xs font-semibold text-[#185FA5] tabular-nums">
                    {((tip.amount / TOTAL_AMOUNT) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* No-data note for uncoloured states */}
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
  );
}

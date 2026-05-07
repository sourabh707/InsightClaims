import { useState, useEffect, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import DiseaseHeatmap from './DiseaseHeatmap';

const GEO_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';

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

const MAX_CASES = Math.max(...Object.values(STATE_DATA).map((s) => s.cases));
const TOTAL_CASES = 2765536;
const TOTAL_AMOUNT = 16674;

// Cream → orange → dark red heat scale (matches heatmap grid)
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

  const CW = containerRef.current?.offsetWidth ?? 800;
  const CH = containerRef.current?.offsetHeight ?? 560;
  const TW = 240, TH = 170, OFF = 14;
  const tx = mousePos.x + OFF + TW > CW ? mousePos.x - TW - OFF : mousePos.x + OFF;
  const ty = mousePos.y + OFF + TH > CH ? mousePos.y - TH - OFF : mousePos.y + OFF;

  const tip = hovered ? STATE_DATA[hovered] : null;

  return (
    <div className="mx-4 mb-4 space-y-4">
      {/* India choropleth map */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">India — Claims by State</h2>
            <p className="text-[10px] text-gray-400">Colour intensity = approved cases · hover state for details</p>
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
                      const name = geo.properties.NAME_1;
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

            {tip && (
              <div
                className="absolute pointer-events-none z-20 bg-white border border-orange-100 rounded-xl shadow-xl"
                style={{ left: tx, top: ty, width: TW }}
              >
                <div className="px-3 pt-2.5 pb-1.5 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{hovered}</p>
                  <p className="text-[10px] text-gray-400">{tip.cities}</p>
                </div>
                <div className="px-3 py-2 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-[10px] font-medium text-gray-600">Cases</p>
                      <p className="text-[9px] text-gray-400">Total approved claims</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 tabular-nums">{fmt(tip.cases)}</p>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-[10px] font-medium text-gray-600">Share</p>
                      <p className="text-[9px] text-gray-400">of {fmt(TOTAL_CASES)} total</p>
                    </div>
                    <p className="text-xs font-semibold text-orange-600 tabular-nums">
                      {((tip.cases / TOTAL_CASES) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-[10px] font-medium text-gray-600">Amount</p>
                      <p className="text-[9px] text-gray-400">Approved payout</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 tabular-nums">₹{tip.amount.toLocaleString('en-IN')} Cr</p>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-[10px] font-medium text-gray-600">Amt Share</p>
                      <p className="text-[9px] text-gray-400">of ₹{fmt(TOTAL_AMOUNT)} Cr national</p>
                    </div>
                    <p className="text-xs font-semibold text-orange-600 tabular-nums">
                      {((tip.amount / TOTAL_AMOUNT) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

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

      {/* Disease heatmap — city × disease breakdown below the map */}
      <DiseaseHeatmap />
    </div>
  );
}

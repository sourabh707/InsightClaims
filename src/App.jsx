import { useState } from 'react';
import SummaryCards from './components/SummaryCards';
import MapView from './components/MapView';
import DiseaseView from './components/DiseaseView';
import AmountBands from './components/AmountBands';
import Insights from './components/Insights';
const TABS = [
  { id: 'map',     label: 'Map View' },
  { id: 'disease', label: 'Disease View' },
  { id: 'bands',   label: 'Amount Bands' },
  { id: 'insights',label: 'Insights' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-[#185FA5] text-white px-5 py-2.5 shadow-md flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Logo mark: shield + pulse */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M16 2L4 7v8c0 7 5.2 13.5 12 15 6.8-1.5 12-8 12-15V7L16 2z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <polyline points="7,16 10.5,16 12,11 14.5,21 17,13 19,18 21,18 24,16" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <div>
            <h1 className="text-base font-bold leading-tight tracking-tight">InsightClaims</h1>
            <span className="text-blue-200 text-xs">31 disease groups · 2,463 cities</span>
          </div>
        </div>

        {/* Settled Date range */}
        <div className="flex items-center gap-2">
          <span className="text-blue-200 text-[11px] font-medium whitespace-nowrap">Settled Date</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 bg-white/15 border border-white/30 rounded px-2 py-1">
              <span className="text-white text-xs font-medium tabular-nums">4/1/2025</span>
              <svg className="w-3.5 h-3.5 text-blue-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span className="text-blue-200 text-xs">–</span>
            <div className="flex items-center gap-1.5 bg-white/15 border border-white/30 rounded px-2 py-1">
              <span className="text-white text-xs font-medium tabular-nums">12/31/2025</span>
              <svg className="w-3.5 h-3.5 text-blue-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Tabs */}
      <div className="px-4 mb-3">
        <div className="flex flex-wrap gap-0.5 bg-white rounded-lg border border-gray-200 shadow-sm p-0.5 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#185FA5] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'map'     && <MapView />}
      {activeTab === 'disease' && <DiseaseView />}
      {activeTab === 'bands'   && <AmountBands />}
      {activeTab === 'insights'&& <Insights />}
    </div>
  );
}

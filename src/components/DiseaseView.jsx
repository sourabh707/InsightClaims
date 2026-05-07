import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { DISEASES } from '../data';

const TOP10_CASES = [
  { name: 'Cataract', cases: 261215 },
  { name: 'GI Disorders', cases: 253102 },
  { name: 'Infectious Diseases', cases: 248109 },
  { name: 'Cancer', cases: 243797 },
  { name: 'Kidney Disorders', cases: 197199 },
  { name: 'Respiratory', cases: 193764 },
  { name: 'Caesarean', cases: 165696 },
  { name: 'Injuries/Fractures', cases: 150979 },
  { name: 'Cardiac', cases: 124667 },
  { name: 'Musculoskeletal', cases: 121023 },
].reverse();

const TOP10_AMOUNT = [
  { name: 'Cancer', amount: 1623 },
  { name: 'GI Disorders', amount: 1584 },
  { name: 'Cardiac', amount: 1589 },
  { name: 'Musculoskeletal', amount: 1405 },
  { name: 'Injuries', amount: 1273 },
  { name: 'Respiratory', amount: 1189 },
  { name: 'Infectious', amount: 1150 },
  { name: 'Caesarean', amount: 877 },
  { name: 'Cataract', amount: 867 },
  { name: 'Neuro', amount: 787 },
].reverse();

// 10-color palette — ordered from muted (lowest bar) to vivid (highest bar)
const PALETTE = [
  '#818CF8', '#A78BFA', '#F472B6', '#FB7185',
  '#FB923C', '#FBBF24', '#34D399', '#22D3EE',
  '#60A5FA', '#185FA5',
];

const COLS = [
  { key: 'name', label: 'Disease' },
  { key: 'cases', label: 'Cases' },
  { key: 'casePct', label: 'Cases %' },
  { key: 'amount', label: 'Amount (Cr)' },
  { key: 'amountPct', label: 'Amount %' },
  { key: 'pkgCount', label: 'Pkg Count' },
  { key: 'pkgOutgo', label: 'Pkg Outgo (Cr)' },
];

function fmt(n) {
  if (n === null || n === undefined) return '—';
  if (typeof n === 'number') return n.toLocaleString('en-IN');
  return n;
}

export default function DiseaseView() {
  const [sortKey, setSortKey] = useState('cases');
  const [sortDir, setSortDir] = useState('desc');

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sorted = [...DISEASES].sort((a, b) => {
    const av = a[sortKey] ?? -Infinity;
    const bv = b[sortKey] ?? -Infinity;
    if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  const topVal = sorted[0]?.[sortKey];

  const casesTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-2 text-xs">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p className="text-[#185FA5]">{payload[0].value.toLocaleString('en-IN')} cases</p>
      </div>
    );
  };

  const amtTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-2 text-xs">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p className="text-[#185FA5]">₹{payload[0].value.toLocaleString('en-IN')} Cr</p>
      </div>
    );
  };

  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cases chart */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Top 10 Diseases by Approved Cases</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TOP10_CASES} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
              <Tooltip content={casesTooltip} />
              <Bar dataKey="cases" radius={[0, 4, 4, 0]}>
                {TOP10_CASES.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Amount chart */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Top 10 Diseases by Approved Amount (₹ Cr)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TOP10_AMOUNT} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => '₹' + v} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
              <Tooltip content={amtTooltip} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {TOP10_AMOUNT.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-3">
          <h3 className="text-xs font-semibold text-gray-700">All 31 Disease Groups</h3>
          <p className="text-[10px] text-gray-400">Click column headers to sort</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <span className="ml-1 text-[#185FA5]">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => {
                const isTop = d[sortKey] === topVal && d[sortKey] !== null;
                return (
                  <tr
                    key={d.name}
                    className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${isTop ? 'bg-blue-50' : i % 2 === 0 ? '' : 'bg-gray-50/30'}`}
                  >
                    <td className={`px-3 py-1.5 text-xs font-medium ${isTop ? 'text-[#185FA5]' : 'text-gray-800'}`}>{d.name}</td>
                    <td className="px-3 py-1.5 text-xs text-gray-700">{fmt(d.cases)}</td>
                    <td className="px-3 py-1.5 text-xs text-gray-500">{d.casePct.toFixed(2)}%</td>
                    <td className="px-3 py-1.5 text-xs text-gray-700">₹{d.amount.toFixed(2)}</td>
                    <td className="px-3 py-1.5 text-xs text-gray-500">{d.amountPct.toFixed(2)}%</td>
                    <td className="px-3 py-1.5 text-xs text-gray-700">{fmt(d.pkgCount)}</td>
                    <td className="px-3 py-1.5 text-xs text-gray-700">{d.pkgOutgo !== null ? '₹' + d.pkgOutgo.toFixed(2) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

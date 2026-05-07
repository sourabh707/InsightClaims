import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { AMOUNT_BANDS } from '../data';

const insights = [
  '₹25k–₹50k is the most common band (27.6% of all cases)',
  '₹1L–₹2L band contributes the most money (21.3%) despite just 9.1% of cases',
  'Top 4 high-value bands (above ₹1L) = only 5.6% of cases but 47.7% of total amount',
];

function casesTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-2 text-xs">
      <p className="font-semibold">{payload[0].payload.band}</p>
      <p className="text-[#185FA5]">{payload[0].value.toLocaleString('en-IN')} cases</p>
    </div>
  );
}

function amtTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-2 text-xs">
      <p className="font-semibold">{payload[0].payload.band}</p>
      <p className="text-[#185FA5]">₹{payload[0].value.toLocaleString('en-IN')} Cr</p>
    </div>
  );
}

const maxCases = Math.max(...AMOUNT_BANDS.map((b) => b.cases));
const maxAmt = Math.max(...AMOUNT_BANDS.map((b) => b.amount));

export default function AmountBands() {
  return (
    <div className="px-4 pb-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cases by band */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Cases by Claim Amount Band</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={AMOUNT_BANDS} margin={{ left: 5, right: 8, top: 0, bottom: 55 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="band" tick={{ fontSize: 9 }} angle={-40} textAnchor="end" interval={0} />
              <YAxis tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} tick={{ fontSize: 10 }} />
              <Tooltip content={casesTooltip} />
              <Bar dataKey="cases" radius={[3, 3, 0, 0]}>
                {AMOUNT_BANDS.map((b, i) => (
                  <Cell key={i} fill={b.cases === maxCases ? '#185FA5' : '#93b8d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Amount by band */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Approved Amount (₹ Cr) by Band</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={AMOUNT_BANDS} margin={{ left: 5, right: 8, top: 0, bottom: 55 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="band" tick={{ fontSize: 9 }} angle={-40} textAnchor="end" interval={0} />
              <YAxis tickFormatter={(v) => '₹' + v} tick={{ fontSize: 10 }} />
              <Tooltip content={amtTooltip} />
              <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                {AMOUNT_BANDS.map((b, i) => (
                  <Cell key={i} fill={b.amount === maxAmt ? '#185FA5' : '#93b8d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights callout */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
        <h3 className="text-xs font-semibold text-[#185FA5] mb-2">Key Insights — Claim Value Distribution</h3>
        <ul className="space-y-1.5">
          {insights.map((ins) => (
            <li key={ins} className="flex items-start gap-2 text-xs text-gray-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#185FA5] shrink-0" />
              {ins}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const cards = [
  { label: 'Total Cases', value: '27,65,536', sub: 'Apr 2025 – Jan 2026' },
  { label: 'Total Amount', value: '₹16,674 Cr', sub: 'Approved claims' },
  { label: 'Cities Covered', value: '2,463', sub: '31 disease groups' },
  { label: 'Top City', value: 'Bengaluru', sub: '12.39% of all cases' },
  { label: 'Costliest Disease', value: 'Cardiac', sub: '₹1,041 Cr pkg outgo' },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 px-4 py-2">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{c.label}</p>
          <p className="text-base font-bold text-[#185FA5] mt-0.5">{c.value}</p>
          <p className="text-[10px] text-gray-400">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

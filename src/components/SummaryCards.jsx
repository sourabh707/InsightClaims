const cards = [
  {
    label: 'Total Cases',
    value: '27,65,536',
    sub: 'Apr 2025 – Jan 2026',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    label: 'Total Amount',
    value: '₹16,674 Cr',
    sub: 'Approved claims',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    label: 'Cities Covered',
    value: '2,463',
    sub: '31 disease groups',
    color: '#0D9488',
    bg: '#F0FDF9',
    border: '#99F6E4',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    label: 'Top City',
    value: 'Bengaluru',
    sub: '12.39% of all cases',
    color: '#B45309',
    bg: '#FFFBEB',
    border: '#FDE68A',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    label: 'Costliest Disease',
    value: 'Cardiac',
    sub: '₹1,041 Cr pkg outgo',
    color: '#DC2626',
    bg: '#FFF1F2',
    border: '#FECDD3',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
      </svg>
    ),
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 px-4 py-2">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg px-3 py-2 shadow-sm border"
          style={{ background: c.bg, borderColor: c.border }}
        >
          <div className="flex items-center gap-1.5 mb-1" style={{ color: c.color, opacity: 0.75 }}>
            {c.icon}
            <p className="text-[10px] font-semibold uppercase tracking-wide">{c.label}</p>
          </div>
          <p className="text-base font-bold leading-tight" style={{ color: c.color }}>{c.value}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

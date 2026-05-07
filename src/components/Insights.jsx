const cards = [
  {
    icon: '🏙️',
    heading: 'City Concentration',
    bullets: [
      'Top 10 cities drive 54% of all cases',
      'Bengaluru alone is 12.4% of cases and 13.9% of amount',
      'Mumbai and Bengaluru together = over 21% of total claims',
      'Metro cities consistently show higher per-case claim values',
    ],
  },
  {
    icon: '🏥',
    heading: 'Disease Burden',
    bullets: [
      'Cardiac has highest package outgo ratio — ₹1,041 Cr on just 4.5% of cases',
      'Cataract leads by volume (9.47%) but is low cost per case',
      'Cancer ranks 4th in cases but 1st in amount — chronic high-cost burden',
      'Kidney disorders: high cases (7.15%) but low amount (3.38%) — recurring low-value dialysis claims',
    ],
  },
  {
    icon: '💰',
    heading: 'Claim Value Distribution',
    bullets: [
      '66% of cases are below ₹50k',
      '47.7% of total amount comes from claims above ₹1L',
      'Average claim value = ₹6,029',
      'High-value claims (above ₹2L) are only 5.6% of cases but drive nearly half the total payout',
    ],
  },
];

export default function Insights() {
  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.heading} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{card.icon}</span>
              <h3 className="font-semibold text-gray-800 text-sm">{card.heading}</h3>
            </div>
            <ul className="space-y-2">
              {card.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#185FA5] shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

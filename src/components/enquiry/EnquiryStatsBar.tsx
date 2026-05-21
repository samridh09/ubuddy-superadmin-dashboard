import { StatItem, EnquiryStatsBarProps } from "@/types/components/EnquiryStatsBar";

'use client';

export function EnquiryStatsBar({
  total,
  pending,
  followUp,
  converted,
  rejected,
  className = '',
}: EnquiryStatsBarProps) {
  const stats: StatItem[] = [
    { label: 'Total', value: total, color: 'blue' },
    { label: 'Pending / New', value: pending, color: 'amber' },
    { label: 'Follow Up', value: followUp, color: 'purple' },
    { label: 'Converted', value: converted, color: 'green' },
    { label: 'Rejected', value: rejected, color: 'red' },
  ];

  return (
    <div className={`flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 ${className}`}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border shadow-sm bg-${stat.color}-50/50 border-${stat.color}-100/50`}
        >
          <span className={`text-xl font-black leading-none text-${stat.color}-700`}>
            {stat.value}
          </span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight whitespace-nowrap">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

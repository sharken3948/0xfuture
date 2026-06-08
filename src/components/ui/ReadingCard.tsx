interface ReadingCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function ReadingCard({ title, subtitle, children, className = '' }: ReadingCardProps) {
  return (
    <div
      className={`rounded-2xl border border-[#c4a25a]/20 [border-top:2px_solid_rgba(196,162,90,0.65)] bg-[#1a0d2e] p-4 backdrop-blur-sm reading-card ${className}`}
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-[#c4a25a]">{title}</h3>
        {subtitle && <p className="text-xs text-[#a78bfa]/70 mt-0.5" style={{ wordBreak: 'break-all' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

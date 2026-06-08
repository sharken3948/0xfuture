export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="w-10 h-10 rounded-full border-2 border-[#c4a25a]/25 border-t-[#c4a25a] animate-spin" />
      {label && <p className="text-sm text-[#a78bfa]/70 animate-pulse">{label}</p>}
    </div>
  );
}

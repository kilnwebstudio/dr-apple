export function CategoryChip({ label }) {
  return (
    <span
      className="absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[11px] font-medium text-ink/80"
      style={{
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        border: '0.5px solid rgba(255, 255, 255, 0.6)',
        boxShadow:
          '0 1px 3px rgba(0,0,0,0.08), 0 0.0 0.5px rgba(0,0,0,0.04), inset 0 0.5px 0 rgba(255,255,255,0.5)',
      }}
    >
      {label}
    </span>
  );
}

export function Spinner({ className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block h-5 w-5 rounded-full border-2 border-ink/15 border-t-ink/70 animate-spin360 ${className}`}
    />
  );
}

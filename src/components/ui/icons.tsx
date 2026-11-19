export function ArrowRight({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function ArrowUpRight({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M6 14 14 6m0 0H7.5M14 6v6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function Plus({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
export function Drop({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="-12 -16 24 30" className={className} aria-hidden="true">
      <path d="M0 -15 C 5 -6 10 0 10 6 A 10 10 0 1 1 -10 6 C -10 0 -5 -6 0 -15 Z" fill="currentColor" />
    </svg>
  );
}

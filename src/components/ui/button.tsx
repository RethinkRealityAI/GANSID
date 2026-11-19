import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from './icons';

type Variant = 'primary' | 'dark' | 'light' | 'ghost' | 'ghost-light';
type Size = 'md' | 'lg';

const base =
  'group inline-flex items-center gap-3 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary: 'bg-red text-white hover:bg-crimson shadow-[0_10px_30px_-12px_rgb(215_38_46/0.7)]',
  dark: 'bg-ink text-white hover:bg-ink-2',
  light: 'bg-white text-ink hover:bg-blush',
  ghost: 'text-ink ring-1 ring-ink/15 hover:ring-ink/40 hover:bg-ink/[0.03]',
  'ghost-light': 'text-white ring-1 ring-white/35 hover:ring-white hover:bg-white/10',
};

const sizes: Record<Size, string> = {
  md: 'h-11 pl-5 pr-2 text-[0.9375rem]',
  lg: 'h-14 pl-7 pr-2.5 text-base',
};

const chip: Record<Variant, string> = {
  primary: 'bg-white/15',
  dark: 'bg-white/12',
  light: 'bg-ink text-white',
  ghost: 'bg-ink text-white',
  'ghost-light': 'bg-white text-ink',
};

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const external = href.startsWith('http');
  const Icon = external ? ArrowUpRight : ArrowRight;
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <span
        className={`grid place-items-center rounded-full ${size === 'lg' ? 'size-9' : 'size-7'} ${chip[variant]} transition-transform duration-300 group-hover:translate-x-0.5`}
      >
        <Icon className="size-4" />
      </span>
    </>
  );
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 font-semibold underline decoration-current/25 underline-offset-[6px] transition-colors hover:decoration-current ${className}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

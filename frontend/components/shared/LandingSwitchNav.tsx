'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/noi-dung', label: 'Trang Nội Dung' },
  { href: '/tham-gia', label: 'Tham Gia Quiz' },
];

export default function LandingSwitchNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'border-mln-red/30 bg-black/75 backdrop-blur-xl'
          : 'border-white/8 bg-black/35 backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/noi-dung" className="text-sm font-bold tracking-wide text-mln-cream">
          MLN122
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
            {ITEMS.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition sm:px-4 ${
                    active
                      ? 'bg-linear-to-br from-mln-red to-mln-red-dark text-white shadow-lg shadow-mln-red/25'
                      : 'text-mln-dim hover:bg-white/10 hover:text-mln-cream'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link href="/noi-dung/mindmap" className="hidden rounded-xl bg-linear-to-br from-mln-gold/70 to-mln-red/80 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-black/25 transition hover:brightness-110 sm:inline-flex ml-2">
            Mindmap
          </Link>

          <Link
            href="/dashboard"
            className="hidden rounded-xl bg-linear-to-br from-mln-gold/70 to-mln-red/80 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-black/25 transition hover:brightness-110 sm:inline-flex mx-2"
          >
            Tạo Phòng
          </Link>
        </div>
      </div>
    </nav>
  );
}
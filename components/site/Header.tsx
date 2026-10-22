'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav } from '@/content/site';
import { ComposeButton } from './Compose';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openRef.current) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`} data-header="">
      <div className="wrap header-inner">
        <Link className="brand" href="/" aria-label="Cirvola home">
          <img className="brand-mark" src="/images/logos/cirvola-wordmark.png" alt="Cirvola" width="900" height="283" />
        </Link>
        <button
          ref={toggle}
          className="nav-toggle"
          type="button"
          aria-expanded={open ? 'true' : 'false'}
          aria-controls="site-nav"
          data-nav-toggle=""
          onClick={() => setOpen(!open)}
        >
          <span className="nav-toggle-bars" aria-hidden="true"></span>
          <span className="sr-only">Menu</span>
        </button>
        <nav
          className={`site-nav${open ? ' is-open' : ''}`}
          id="site-nav"
          aria-label="Main"
          onClick={(e) => {
            if ((e.target as Element).closest('a, button')) setOpen(false);
          }}
        >
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={item.href === pathname ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ComposeButton className="btn btn-primary btn-sm">Request a programme</ComposeButton>
        </nav>
      </div>
    </header>
  );
}

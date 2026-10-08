/**
 * ScrollToTop — floating button that appears after scrolling down.
 * Uses GSAP for entrance/exit animation.
 * Based on: scroll-experience skill
 */

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { gsap } from 'gsap';

const RADIUS = 21;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!btnRef.current) return;
    if (visible) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' },
      );
    } else {
      gsap.to(btnRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [visible]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      aria-label="Kembali ke atas"
      className="group fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-lg transition-colors hover:bg-ink-soft sm:bottom-24 sm:right-6"
      style={{ opacity: 0, transform: 'scale(0)' }}
    >
      {/* Scroll progress ring */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 0.15s linear' }}
        />
      </svg>
      <ArrowUp className="relative h-5 w-5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5" />
    </button>
  );
};

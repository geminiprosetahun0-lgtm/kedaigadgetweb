/**
 * ScrollToTop — floating button that appears after scrolling down.
 * Uses GSAP for entrance/exit animation.
 * Based on: scroll-experience skill
 */

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { gsap } from 'gsap';

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
      className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper shadow-lg transition-colors hover:bg-ink-soft sm:bottom-24 sm:right-6"
      style={{ opacity: 0, transform: 'scale(0)' }}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

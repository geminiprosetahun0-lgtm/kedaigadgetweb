import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor — a crisp inner dot plus a trailing ring that eases behind
 * it. The ring grows and fills when hovering any interactive element, and
 * pulses on click. Disabled on touch devices / reduced-motion.
 *
 * Inspired by reactbits.dev cursor micro-interactions.
 */
export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return fine && !reduced;
  });
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let ringX = -100;
    let ringY = -100;
    let targetX = -100;
    let targetY = -100;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      const el = e.target as HTMLElement | null;
      setActive(
        !!el?.closest('a[href], button, [role="button"], input, select, textarea, [role="dialog"], .kg-spotlight, .kg-tilt-hover'),
      );
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const loop = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="kg-cursor-root">
      <div ref={dotRef} className={`kg-cursor-dot ${pressed ? 'is-pressed' : ''}`} />
      <div ref={ringRef} className={`kg-cursor-ring ${active ? 'is-active' : ''} ${pressed ? 'is-pressed' : ''}`} />
    </div>
  );
};

export default Cursor;

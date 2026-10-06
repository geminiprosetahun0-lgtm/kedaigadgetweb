import { useEffect, useState } from 'react';

export type ModalPhase = 'closed' | 'open';

if (typeof document !== 'undefined' && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-reveal');
}

/**
 * Keeps a modal mounted through its exit transition.
 * Returns `visible` (render it) and `phase` ('closed' = pre-enter / exiting,
 * 'open' = fully shown). Toggle classes on `phase` and let CSS do the rest.
 */
export function usePresence(open: boolean, duration = 340) {
  const [visible, setVisible] = useState(open);
  const [phase, setPhase] = useState<ModalPhase>(open ? 'open' : 'closed');

  useEffect(() => {
    if (open) {
      setVisible(true);
      setPhase('closed');
      let innerFrame = 0;
      const outerFrame = requestAnimationFrame(() => {
        innerFrame = requestAnimationFrame(() => setPhase('open'));
      });
      return () => {
        cancelAnimationFrame(outerFrame);
        cancelAnimationFrame(innerFrame);
      };
    }
    setPhase('closed');
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [open, duration]);

  return { visible, phase };
}

/**
 * One-shot scroll reveal. Elements with `.kg-reveal` fade + lift in the first
 * time they cross the viewport, staggered by position within each batch so a
 * row always cascades left-to-right. Re-run when `deps` change so freshly
 * mounted nodes (e.g. filtered cards) get observed too.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.round(a.boundingClientRect.top - b.boundingClientRect.top) ||
              a.boundingClientRect.left - b.boundingClientRect.left,
          );
        entering.forEach((entry, index) => {
          const el = entry.target as HTMLElement;
          el.style.setProperty('--stagger', `${Math.min(index, 5) * 70}ms`);
          el.classList.add('is-revealed');
          observer.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0 },
    );
    document.querySelectorAll('.kg-reveal:not(.is-revealed)').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** rAF-throttled scroll progress (0..1) + "scrolled past top" flag. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setScrolled(window.scrollY > 4);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { progress, scrolled };
}

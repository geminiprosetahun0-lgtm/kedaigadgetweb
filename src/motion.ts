import { useEffect, useState, useRef, useCallback } from 'react';

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

/* =================================================================== */
/* ReactBits-inspired hooks                                           */
/* =================================================================== */

/**
 * useSpotlight — tracks mouse position over an element and writes the
 * relative position to CSS vars `--mx` / `--my` (in %). Pair with the
 * `.kg-spotlight` class for a radial glow that follows the cursor.
 *
 * Inspired by reactbits.dev "Spotlight Card".
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  }, []);

  return { ref, onMouseMove };
}

/**
 * useMagnetic — element subtly follows the cursor while hovered, springs
 * back on leave. Pair with a button/icon for a premium micro-interaction.
 *
 * Inspired by reactbits.dev "Magnetic Button".
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(strength = 0.3) {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

/**
 * useTilt — 3D tilt that follows cursor. Writes `rotateX` / `rotateY`
 * inline styles. Pair with `.kg-tilt` class for preserve-3d children.
 *
 * Inspired by reactbits.dev "Tilt Card".
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(max = 8) {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * max * 2;
      const ry = (px - 0.5) * max * 2;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    },
    [max],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

/**
 * useCountUp — animates a number from 0 to `end` when the element
 * scrolls into view (one-shot). Returns the current display value.
 *
 * Inspired by reactbits.dev "Counter".
 */
export function useCountUp(end: number, duration = 1500, start = 0) {
  const [value, setValue] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            // easeOutExpo
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            setValue(Math.round(start + (end - start) * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, start]);

  return { ref, value };
}

/**
 * useTextSplit — splits a string into per-character spans with a
 * CSS var `--char-i` set for staggered animation delay. Pair with
 * `.kg-text-animate` class.
 *
 * Inspired by reactbits.dev "Text Animate".
 */
export function useTextSplit(text: string) {
  return text.split('').map((char, i) => ({
    char: char === ' ' ? '\u00A0' : char,
    key: `${char}-${i}`,
    style: { '--char-i': i } as React.CSSProperties,
  }));
}

/**
 * useRipple — creates a ripple element at click position. Pair with
 * `.kg-ripple-host` class on the button.
 *
 * Inspired by reactbits.dev "Click Effects".
 */
export function useRipple() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; size: number; key: number }>>([]);

  const onClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const key = Date.now();
    setRipples((prev) => [...prev, { x, y, size, key }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== key));
    }, 600);
  }, []);

  return { ripples, onClick };
}

/* =================================================================== */
/* Global micro-interactions (event delegation — no per-node hooks)     */
/* =================================================================== */

/**
 * useMicroInteractions — installs ONE set of document-level listeners that
 * power every micro-interaction on the page without needing a hook per node:
 *
 *  - Spotlight glow:  writes `--mx` / `--my` on `.kg-spotlight:hover`.
 *  - 3D tilt:         writes `--rx` / `--ry` on `.kg-tilt-hover:hover`.
 *  - Ripple on click: spawns `.kg-ripple` inside any button / link / card.
 *
 * Use event delegation so dynamically-rendered nodes (filtered product
 * cards, modals) are covered automatically.
 */
export function useMicroInteractions(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { x, y } = pending;
      pending = null;

      const el = document.elementFromPoint(x, y);
      if (!el) return;

      const spot = el.closest('.kg-spotlight') as HTMLElement | null;
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${((x - r.left) / r.width) * 100}%`);
        spot.style.setProperty('--my', `${((y - r.top) / r.height) * 100}%`);
      }

      const tilt = el.closest('.kg-tilt-hover') as HTMLElement | null;
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (x - r.left) / r.width;
        const py = (y - r.top) / r.height;
        tilt.style.setProperty('--rx', `${(0.5 - py) * 7}deg`);
        tilt.style.setProperty('--ry', `${(px - 0.5) * 7}deg`);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onMouseOut = (e: MouseEvent) => {
      const to = e.relatedTarget as Node | null;
      if (to) return;
      document
        .querySelectorAll('.kg-tilt-hover')
        .forEach((n) => (n as HTMLElement).style.setProperty('--rx', '0deg'));
      document
        .querySelectorAll('.kg-tilt-hover')
        .forEach((n) => (n as HTMLElement).style.setProperty('--ry', '0deg'));
    };

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        'button, a[href], [role="button"], .kg-ripple-host',
      ) as HTMLElement | null;
      if (!target || target.classList.contains('kg-no-ripple')) return;

      // Keep layout stable: only force `position: relative` when static,
      // and clean it up after the ripple finishes.
      const wasStatic = getComputedStyle(target).position === 'static';
      if (wasStatic) target.style.position = 'relative';
      target.classList.add('kg-ripple-host');

      const r = target.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const ripple = document.createElement('span');
      ripple.className = 'kg-ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - r.left - size / 2}px`;
      ripple.style.top = `${e.clientY - r.top - size / 2}px`;
      target.appendChild(ripple);
      window.setTimeout(() => {
        ripple.remove();
        target.classList.remove('kg-ripple-host');
        if (wasStatic) target.style.position = '';
      }, 650);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('click', onClick);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);
}

/**
 * useScrollSpy — highlights the nav link of the section currently in view.
 * Returns the active anchor id (e.g. "katalog"). Sections are matched by
 * their `id`; pass the list of ids to watch.
 */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  return active;
}

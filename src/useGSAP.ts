/**
 * useGSAP — GSAP integration hooks for Kedai Gadget
 * Based on: gsap-web, gsap-scrolltrigger, gsap-timeline skills
 *
 * Enhancements ON TOP of existing CSS + React hooks in motion.ts —
 * no conflicts, no plugin deps beyond ScrollTrigger.
 */

import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Cinematic hero entrance timeline (complements .kg-fade-up CSS). */
export function useGSAPHero<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

      tl.from('h1', { opacity: 0, y: 60, duration: 1 }, 0.1);
      tl.from('h1 + p, .max-w-xl', { opacity: 0, y: 30, duration: 0.7 }, '-=0.5');
      tl.from('a[href="#katalog"], a[href="#tukar-tambah"]', {
        opacity: 0, y: 30, scale: 0.9, stagger: 0.12, duration: 0.5,
      }, '-=0.3');
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

/** Parallax scroll for background layers (scrubbed). */
export function useGSAPParallax<T extends HTMLElement = HTMLElement>(speed = 0.3) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current!.closest('section') || ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/** Batched staggered entrance for grouped elements (spring easing). */
export function useGSAPStagger<T extends HTMLElement = HTMLElement>(selector: string) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.selector(ref)(selector);
      if (!items.length) return;

      gsap.set(items, { opacity: 0, y: 50, scale: 0.95 });

      ScrollTrigger.batch(items, {
        start: 'top 88%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, ease: 'back.out(1.4)', stagger: 0.1, overwrite: true,
          }),
        once: true,
      });
    }, ref);

    return () => ctx.revert();
  }, [selector]);

  return ref;
}

/** Count-up driven by ScrollTrigger (smoother than plain rAF version). */
export function useGSAPCounter(
  end: number,
  options: { duration?: number; suffix?: string; prefix?: string } = {},
) {
  const { duration = 2, suffix = '', prefix = '' } = options;
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const obj = { val: 0 };
    const el = ref.current;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: end, duration, ease: 'power2.out',
            onUpdate: () => {
              el.textContent = prefix + Math.floor(obj.val).toLocaleString('id-ID') + suffix;
            },
          });
        },
      });
    });

    return () => ctx.revert();
  }, [end, duration, suffix, prefix]);

  return { ref };
}

/** Hide navbar on scroll down, reveal on scroll up. */
export function useGSAPNavbarHide<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const header = ref.current;
    let lastScroll = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > 300 && y > lastScroll) {
        gsap.to(header, { yPercent: -100, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      } else {
        gsap.to(header, { yPercent: 0, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      }
      lastScroll = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      gsap.killTweensOf(header);
    };
  }, []);

  return ref;
}

/** ScrollTrigger.refresh() after deps change (filtered cards, modals). */
export function useGSAPRefresh(deps: unknown[] = []) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!prefersReducedMotion()) ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Smooth anchor scrolling (native — no ScrollToPlugin dependency). */
export function useGSAPSmoothAnchor() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const dest = document.querySelector(href);
      if (!dest) return;

      e.preventDefault();
      const top = dest.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}

/** Organic random floating motion for decorative elements. */
export function useGSAPFloating<T extends HTMLElement = HTMLElement>(selector: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.selector(ref)(selector).forEach((el: Element, i: number) => {
        gsap.to(el, {
          y: 'random(-15, 15)',
          duration: 'random(3, 5)',
          repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3,
        });
      });
    }, ref);

    return () => ctx.revert();
  }, [selector]);

  return ref;
}

export { gsap, ScrollTrigger };

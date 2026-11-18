// Scroll reveal and a subtle image parallax (wiki websites.md: data-reveal + IntersectionObserver, no
// animation library). No layout reads in the scroll loop beyond one getBoundingClientRect per parallax
// element per frame.

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function revealAll(elements: Element[]): void {
  elements.forEach((el) => el.classList.add('is-visible'));
}

/** Upper bound of the stagger: three steps, so no item waits longer than three times --reveal-stagger. */
const MAX_STAGGER_STEPS = 3;

/** Items whose tops differ by less than this sit in one row and enter together. */
const ROW_TOLERANCE_PX = 8;

function initReveal(): void {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (elements.length === 0) return;

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealAll(elements);
    return;
  }

  // Stagger only group members that enter the viewport together side by side, e.g. a row of three
  // cards on desktop. Stacked items (every list on a phone, FAQ rows on any width) never wait for
  // their neighbours, and an item further down never inherits a delay from its position in the list.
  const observer = new IntersectionObserver(
    (entries) => {
      const rows = new Map<Element, { top: number; step: number }>();
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        const group = target.closest('[data-reveal-group]');
        if (group) {
          const top = entry.boundingClientRect.top;
          const row = rows.get(group);
          const sameRow = row !== undefined && Math.abs(row.top - top) < ROW_TOLERANCE_PX;
          const step = sameRow ? row.step + 1 : 0;
          target.style.setProperty('--reveal-index', String(Math.min(step, MAX_STAGGER_STEPS)));
          rows.set(group, { top: sameRow ? row.top : top, step });
        }
        target.classList.add('is-visible');
        observer.unobserve(target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  elements.forEach((el) => observer.observe(el));

  // Keyboard focus outruns the reveal: every reveal ancestor of the focused element shows at once,
  // including one whose transition is already running.
  document.addEventListener('focusin', (event) => {
    let el = (event.target as Element | null)?.closest<HTMLElement>('[data-reveal]');
    while (el) {
      el.style.setProperty('--reveal-index', '0');
      el.classList.add('is-visible');
      observer.unobserve(el);
      el.getAnimations().forEach((animation) => animation instanceof CSSTransition && animation.finish());
      el = el.parentElement?.closest<HTMLElement>('[data-reveal]') ?? null;
    }
  });
}

function initParallax(): void {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  // No parallax on touch screens: the picture holds still while the visitor looks at it.
  if (elements.length === 0 || reducedMotion.matches || window.matchMedia('(pointer: coarse)').matches) return;

  let ticking = false;
  let stopped = false;

  const update = () => {
    if (stopped) return;
    const viewport = window.innerHeight;
    for (const el of elements) {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > viewport) continue;
      const strength = Number(el.dataset.parallax) || 0.06;
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      el.style.transform = `translate3d(0, ${(progress * strength * -100).toFixed(2)}%, 0)`;
    }
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Honour a reduced motion preference switched on while the page is open.
  reducedMotion.addEventListener('change', (event) => {
    if (!event.matches) return;
    stopped = true;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    elements.forEach((el) => el.style.removeProperty('transform'));
  });
}

initReveal();
initParallax();
reducedMotion.addEventListener('change', (event) => {
  if (event.matches) revealAll(Array.from(document.querySelectorAll('[data-reveal]')));
});
document.documentElement.classList.add('motion-ready');

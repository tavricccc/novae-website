import { animate } from 'motion/mini';

const SELECTOR = [
  '.chapter-copy',
  '.chapter-visual',
  '.capability-ledger',
  '.workflow-rail',
  '.status-ledger',
  '.pwa-ledger',
  '.roles-ledger',
  '.config-dimensions',
  '.config-stage',
  '.device-stage',
  '.cta-section > *'
].join(',');

const EASE = [0.16, 1, 0.3, 1];

function isInViewport(node) {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

export function initializeReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  document.querySelectorAll('.hero-copy > *').forEach((node, index) => {
    animate(
      node,
      { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0px)'] },
      { duration: 0.72, delay: 0.08 + index * 0.065, ease: EASE }
    );
  });
  animate(
    '.hero-stage',
    { opacity: [0, 1], transform: ['translateX(22px)', 'translateX(0px)'] },
    { duration: 0.9, delay: 0.15, ease: EASE }
  );
  animate('.site-header', { opacity: [0, 1] }, { duration: 0.48, ease: EASE });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        animate(
          entry.target,
          { opacity: 1, transform: 'translateY(0px)' },
          { duration: 0.76, ease: EASE }
        ).then(() => {
          entry.target.style.removeProperty('will-change');
        });
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
  );

  document.querySelectorAll(SELECTOR).forEach((node) => {
    if (isInViewport(node)) return;
    node.style.opacity = '0';
    node.style.transform = 'translateY(24px)';
    node.style.willChange = 'opacity, transform';
    observer.observe(node);
  });
}

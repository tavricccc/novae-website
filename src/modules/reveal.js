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

export function initializeParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const stages = [...document.querySelectorAll('[data-parallax-stage]')];
  stages.forEach((stage) => {
    const layers = [...stage.querySelectorAll('[data-parallax-depth]')];
    const reset = () => layers.forEach((layer) => {
      layer.style.setProperty('--parallax-x', '0px');
      layer.style.setProperty('--parallax-y', '0px');
    });
    stage.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.parallaxDepth || 1);
        layer.style.setProperty('--parallax-x', `${x * 16 * depth}px`);
        layer.style.setProperty('--parallax-y', `${y * 13 * depth}px`);
      });
    });
    stage.addEventListener('pointerleave', reset);
  });
}

function isInViewport(node) {
  const rect = node.getBoundingClientRect();
  // Slightly generous so near-fold content does not start hidden.
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

/**
 * Scroll-in animation without the common FOUC:
 * never force opacity:0 on content already on screen (that flashes white/empty).
 */
export function initializeReveal() {
  const targets = [...document.querySelectorAll(SELECTOR)];
  if (!targets.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        requestAnimationFrame(() => entry.target.classList.add('reveal-visible'));
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
  );

  targets.forEach((node) => {
    if (isInViewport(node)) return;
    node.classList.add('reveal');
    observer.observe(node);
  });
}

/** Language replacement should never replay a scroll animation. */
export function revealNewContent(root = document) {
  root.querySelectorAll(SELECTOR).forEach((node) => {
    node.classList.remove('reveal');
    node.classList.add('reveal-visible');
  });
}

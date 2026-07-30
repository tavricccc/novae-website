import './styles/index.js';
import { initializeLanguage } from './modules/i18n.js';
import { initializeLandingRender } from './modules/landing-render.js';
import { hydrateIcons } from './modules/icons.js';
import { initializeReveal } from './modules/reveal.js';
import { initializeInterfaceDemos } from './modules/mock-interface.js';
import { initializePressFeedback } from './modules/press-feedback.js';

// Language first so list render + demos read the preferred locale.
initializeLanguage();
initializePressFeedback();
initializeLandingRender();
initializeInterfaceDemos();
hydrateIcons();
initializeReveal();

const heroSpace = document.querySelector('[data-hero-space]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = navigator.connection?.saveData === true;
const constrainedCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
if (heroSpace && !reducedMotion && !saveData && !constrainedCpu) {
  const loadHeroSpace = () => {
    import('./modules/hero-space.js')
      .then(({ mountHeroSpace }) => mountHeroSpace(heroSpace))
      .catch(() => {
        heroSpace.dataset.heroSpaceUnavailable = 'true';
      });
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadHeroSpace, { timeout: 900 });
  } else {
    window.setTimeout(loadHeroSpace, 240);
  }
}

// Reveal body after first paint of preferred language (see index.html boot script).
requestAnimationFrame(() => {
  document.documentElement.classList.add('is-ready');
  document.documentElement.classList.remove('lang-boot-hide');
});

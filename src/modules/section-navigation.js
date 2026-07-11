export function initializeSectionNavigation() {
  const root = document.querySelector('[data-section-nav]');
  const toggle = root?.querySelector('[data-section-nav-toggle]');
  if (!root || !(toggle instanceof HTMLButtonElement)) return;

  const links = [...root.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter((section) => section instanceof HTMLElement);

  toggle.addEventListener('click', () => {
    const open = root.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(pointer: coarse)').matches) {
        root.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        link.blur();
      }
    });
  });

  if (typeof IntersectionObserver === 'undefined') return;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    },
    { rootMargin: '-25% 0px -55%', threshold: [0, 0.15, 0.35] }
  );
  sections.forEach((section) => observer.observe(section));
}

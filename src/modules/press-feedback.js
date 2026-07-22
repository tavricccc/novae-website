const selector = 'button:not(:disabled),a[href]:not([aria-disabled="true"]),[role="button"]:not([aria-disabled="true"])';
const active = new Map();

export function initializePressFeedback() {
  document.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const element = event.target instanceof Element ? event.target.closest(selector) : null;
    if (!element) return;
    element.classList.add('is-pressing');
    active.set(event.pointerId, { element, startedAt: performance.now(), x: event.clientX, y: event.clientY });
  }, { capture: true, passive: true });

  document.addEventListener('pointermove', (event) => {
    const press = active.get(event.pointerId);
    if (!press || Math.hypot(event.clientX - press.x, event.clientY - press.y) <= 12) return;
    press.element.classList.remove('is-pressing');
    active.delete(event.pointerId);
  }, { capture: true, passive: true });

  const release = (event, immediate = false) => {
    const press = active.get(event.pointerId);
    if (!press) return;
    active.delete(event.pointerId);
    const remaining = immediate ? 0 : Math.max(0, 120 - (performance.now() - press.startedAt));
    window.setTimeout(() => {
      const stillPressed = [...active.values()].some((value) => value.element === press.element);
      if (!stillPressed) press.element.classList.remove('is-pressing');
    }, remaining);
  };

  document.addEventListener('pointerup', (event) => release(event), { capture: true, passive: true });
  document.addEventListener('pointercancel', (event) => release(event, true), { capture: true, passive: true });
}

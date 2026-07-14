function activateRule(root, key, focus = false) {
  const tabs = [...root.querySelectorAll('[data-rule-tab]')];
  const panels = [...root.querySelectorAll('[data-rule-panel]')];
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.dataset.ruleTab === key));

  tabs.forEach((tab, index) => {
    const active = index === activeIndex;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
    tab.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.rulePanel !== tabs[activeIndex]?.dataset.ruleTab;
  });

  const progress = root.querySelector('[data-rule-progress]');
  if (progress) {
    progress.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(tabs.length).padStart(2, '0')}`;
  }
  if (focus) tabs[activeIndex]?.focus();
}

export function initializeRuleStudio() {
  document.querySelectorAll('[data-rule-studio]').forEach((root) => {
    if (root._ruleStudioClick) root.removeEventListener('click', root._ruleStudioClick);
    if (root._ruleStudioKeydown) root.removeEventListener('keydown', root._ruleStudioKeydown);

    root._ruleStudioClick = (event) => {
      const tab = event.target.closest('[data-rule-tab]');
      if (!tab || !root.contains(tab)) return;
      activateRule(root, tab.dataset.ruleTab);
    };

    root._ruleStudioKeydown = (event) => {
      const tab = event.target.closest('[data-rule-tab]');
      if (!tab || !['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      const tabs = [...root.querySelectorAll('[data-rule-tab]')];
      const currentIndex = tabs.indexOf(tab);
      let nextIndex = currentIndex;
      if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
      else nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      event.preventDefault();
      activateRule(root, tabs[nextIndex].dataset.ruleTab, true);
    };

    root.addEventListener('click', root._ruleStudioClick);
    root.addEventListener('keydown', root._ruleStudioKeydown);
    activateRule(root, root.querySelector('[data-rule-tab]')?.dataset.ruleTab);
  });
}

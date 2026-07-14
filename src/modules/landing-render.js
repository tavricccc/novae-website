import { getCatalog, getLanguage } from './i18n.js';
import { initializeRuleStudio } from './rule-studio.js';

function renderFeatures(catalog) {
  const root = document.querySelector('[data-render="features"]');
  if (!root) return;
  root.innerHTML = catalog.features.cards
    .map(
      (card) => `<article class="capability-card">
      <div class="feature-icon"><i class="ti ti-${card.icon}" aria-hidden="true"></i></div>
      <h3>${card.title}</h3>
      <p>${card.body}</p>
    </article>`
    )
    .join('');
}

function renderWorkflow(catalog) {
  const steps = document.querySelector('[data-render="workflow-steps"]');
  if (steps) {
    steps.innerHTML = catalog.workflow.steps
      .map(
        (step) => `<li><span>${step.n}</span><div><strong>${step.title}</strong><p>${step.body}</p></div></li>`
      )
      .join('');
  }
  const statuses = document.querySelector('[data-render="workflow-statuses"]');
  if (statuses) {
    statuses.innerHTML = catalog.workflow.statuses
      .map((s) => `<div><strong>${s.title}</strong><span>${s.body}</span></div>`)
      .join('');
  }
}

function renderConfig(catalog) {
  const dimensions = catalog.config.studio.dimensions;
  const dimensionList = document.querySelector('[data-render="config-dimensions"]');
  if (dimensionList) {
    dimensionList.innerHTML = dimensions
      .map(
        (item, index) => `<button type="button" data-rule-tab="${item.key}" role="tab"
          aria-selected="${index === 0 ? 'true' : 'false'}" aria-controls="rule-panel-${item.key}"
          class="${index === 0 ? 'active' : ''}">
          <span><i class="ti ti-${item.icon}" aria-hidden="true"></i></span>
          <strong>${item.label}</strong><small>${String(index + 1).padStart(2, '0')}</small>
        </button>`
      )
      .join('');
  }

  const panelHost = document.querySelector('[data-render="config-dimension-panels"]');
  if (panelHost) {
    panelHost.innerHTML = dimensions
      .map(
        (item, index) => `<article id="rule-panel-${item.key}" class="config-dimension-panel"
          data-rule-panel="${item.key}" role="tabpanel" ${index === 0 ? '' : 'hidden'}>
          <span class="config-dimension-panel__icon"><i class="ti ti-${item.icon}" aria-hidden="true"></i></span>
          <h3>${item.title}</h3><p>${item.body}</p>
          <div class="config-option-grid">${item.options
            .map((option) => `<div><i class="ti ti-check" aria-hidden="true"></i><strong>${option.title}</strong><p>${option.body}</p></div>`)
            .join('')}</div>
        </article>`
      )
      .join('');
  }

}

function renderArchitecture(catalog) {
  const nodes = document.querySelector('[data-render="arch-nodes"]');
  if (!nodes) return;
  nodes.innerHTML = catalog.architecture.nodes
    .map(
      (node) => `<article class="arch-node">
      <small>${node.small}</small>
      <strong>${node.title}</strong>
      <em>${node.em}</em>
    </article>`
    )
    .join('');
}

function renderPwa(catalog) {
  const root = document.querySelector('[data-render="pwa-cards"]');
  if (!root) return;
  root.innerHTML = catalog.pwa.cards
    .map(
      (card) => `<article>
      <span class="pwa-icon"><i class="ti ti-${card.icon}" aria-hidden="true"></i></span>
      <div>
        <h3>${card.title}</h3>
        <p>${card.body}</p>
      </div>
    </article>`
    )
    .join('');
}

function renderRoles(catalog) {
  const roles = document.querySelector('[data-render="roles"]');
  if (roles) {
    roles.innerHTML = catalog.roles.cards
      .map(
        (card) => `<article>
        <h3>${card.title}</h3>
        <ul>${card.items.map((item) => `<li>${item}</li>`).join('')}</ul>
      </article>`
      )
      .join('');
  }
  const more = document.querySelector('[data-render="more-features"]');
  if (more) {
    more.innerHTML = catalog.roles.more
      .map(
        (card) => `<article>
        <h3>${card.title}</h3>
        <p>${card.body}</p>
      </article>`
      )
      .join('');
  }
}

function renderFit(catalog) {
  const yes = document.querySelector('[data-render="fit-yes"]');
  if (yes) {
    yes.innerHTML = catalog.fit.yes.map((item) => `<li>${item}</li>`).join('');
  }
  const no = document.querySelector('[data-render="fit-no"]');
  if (no) {
    no.innerHTML = catalog.fit.no.map((item) => `<li>${item}</li>`).join('');
  }
}

function renderHeroFacts(catalog) {
  const root = document.querySelector('[data-render="hero-facts"]');
  if (!root) return;
  root.innerHTML = catalog.hero.facts
    .map((fact) => `<li><strong>${fact.label}</strong><span>${fact.text}</span></li>`)
    .join('');
}

export function renderLandingLists() {
  const catalog = getCatalog(getLanguage());
  renderHeroFacts(catalog);
  renderFeatures(catalog);
  renderWorkflow(catalog);
  renderConfig(catalog);
  renderArchitecture(catalog);
  renderPwa(catalog);
  renderRoles(catalog);
  renderFit(catalog);
  initializeRuleStudio();
}

export function initializeLandingRender() {
  renderLandingLists();
  document.addEventListener('novae:language', () => {
    renderLandingLists();
  });
}

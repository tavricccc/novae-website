import './styles/index.js';
import './styles/category-builder.css';
import { applySiteLinks } from './config/site.js';
import {
  buildDownloadConfig,
  createEmptyCategory,
  deriveCategorySummary,
  normalizeImportedConfig,
  validateCategoryConfig,
} from './modules/category-config.js';

const root = document.querySelector('[data-category-builder]');
applySiteLinks(document, 'zh');
const state = {
  categories: [createEmptyCategory()],
  activeIndex: 0,
  step: 0,
  view: 'form',
  showValidation: false,
};

const WIZARD_STEPS = [
  { label: '命名', description: '先決定使用者會看到什麼名稱。', fields: ['id', 'label'] },
  { label: '可見範圍', description: '選擇誰可以看到這類提案。', fields: ['readAccess'] },
  { label: '作者', description: '決定有權閱讀的人是否看得到作者。', fields: ['authorVisible'] },
  { label: '附議', description: '獨立設定是否附議、需要幾人與開放幾天。', fields: ['support.enabled', 'support.goal', 'support.deadlineDays'] },
  { label: '回應期限', description: '設定管理單位多久內需要回應。', fields: ['responseDeadlineDays'] },
  { label: '確認下載', description: '最後檢查一次，再產生設定檔。', fields: [] },
];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
  }[character]));
}

function activeCategory() {
  return state.categories[state.activeIndex];
}

function errorsFor(index = state.activeIndex) {
  return validateCategoryConfig(state).filter((error) => error.index === index);
}

function fieldError(field) {
  if (!state.showValidation) return '';
  return errorsFor().find((error) => error.field === field)?.message || '';
}

function choice(field, value, title, description, selected, disabled = false) {
  return `<button type="button" data-choice-field="${field}" data-choice-value="${value}" class="builder-choice ${selected ? 'active' : ''}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}>
    <span class="builder-choice__mark"><i class="ti ti-check" aria-hidden="true"></i></span><span><strong>${title}</strong><small>${description}</small></span>
  </button>`;
}

function errorsForStep(step = state.step) {
  if (step === WIZARD_STEPS.length - 1) return errorsFor();
  const fields = WIZARD_STEPS[step].fields;
  return errorsFor().filter((error) => fields.includes(error.field));
}

function stepForField(field) {
  const index = WIZARD_STEPS.findIndex((step) => step.fields.includes(field));
  return index >= 0 ? index : 0;
}

function canOpenStep(step) {
  if (step <= state.step) return true;
  return Array.from({ length: step }, (_, index) => errorsForStep(index)).every((errors) => errors.length === 0);
}

function renderCategoryList() {
  root.querySelector('[data-category-count]').textContent = String(state.categories.length);
  root.querySelector('[data-file-status]').textContent = `${state.categories.length} 個分類`;
  root.querySelector('[data-category-list]').innerHTML = state.categories.map((category, index) => {
    const errors = errorsFor(index);
    const status = errors.length
      ? state.showValidation ? `<b>${errors.length}</b>` : '<i></i>'
      : '<i class="is-valid ti ti-check"></i>';
    return `<button type="button" data-select-category="${index}" class="${index === state.activeIndex ? 'active' : ''}">
      <span class="builder-category-icon">${String(index + 1).padStart(2, '0')}</span>
      <span><strong>${escapeHtml(category.label || '未命名分類')}</strong><small>${escapeHtml(category.id || '尚未設定 ID')}</small></span>
      <span class="builder-category-status">${status}</span>
    </button>`;
  }).join('');
}

function errorSummary(errors) {
  if (!state.showValidation || !errors.length) return '';
  return `<div class="builder-error-summary" role="alert" tabindex="-1" data-form-error-summary>
    <strong>這個分類還有 ${errors.length} 項需要完成</strong>
    <ul>${errors.map((error) => `<li><button type="button" data-focus-error="${error.field}">${escapeHtml(error.message)}</button></li>`).join('')}</ul>
  </div>`;
}

function inputField(field, label, value, options = {}) {
  const error = fieldError(field);
  return `<label class="builder-field ${error ? 'has-error' : ''}" data-field-help="${escapeHtml(options.help)}">
    <span>${label}${options.unit ? `<em>${options.unit}</em>` : ''}</span>
    <input ${options.type === 'number' ? 'type="number" min="1" step="1" inputmode="numeric"' : ''} data-field="${field}" value="${escapeHtml(value)}" placeholder="${options.placeholder || ''}" autocomplete="off" />
    <small>${error || options.help}</small>
  </label>`;
}

function impactContent(category) {
  const summary = deriveCategorySummary(category);
  return `<header><span>這個分類目前會如何運作</span><small>依上方設定自動整理</small></header><dl>
    <div><dt>閱讀</dt><dd>${summary.visibility}</dd></div><div><dt>作者</dt><dd>${category.authorVisible === true ? '顯示作者' : category.authorVisible === false ? '隱藏作者' : '尚未選擇'}</dd></div>
    <div><dt>附議</dt><dd>${summary.support}</dd></div><div><dt>回應</dt><dd>${summary.response}</dd></div><div><dt>附件與留言</dt><dd>${summary.derived}</dd></div>
  </dl>`;
}

function wizardStepContent(category) {
  const ownerOnly = category.readAccess === 'owner-admin';
  if (state.step === 0) {
    return `<div class="builder-step-card">
      <div class="builder-step-intro"><span>步驟 1</span><h3>這個分類要叫什麼？</h3><p>使用者會在新增提案和篩選列表時看到這個名稱。</p></div>
      <div class="builder-fields">
        ${inputField('label', '顯示名稱', category.label, { placeholder: '例如：公共議題', help: '使用自然、容易理解的名稱。' })}
        ${inputField('id', '分類 ID', category.id, { placeholder: 'public-issues', help: '使用小寫英數與連字號；發布後不建議變更。' })}
      </div>
    </div>`;
  }
  if (state.step === 1) {
    return `<div class="builder-step-card">
      <div class="builder-step-intro"><span>步驟 2</span><h3>誰可以看到這類提案？</h3><p>${fieldError('readAccess') || '所有選項都需要使用校內 Google 帳號登入。'}</p></div>
      <div class="builder-choices builder-choices--three">
        ${choice('readAccess', 'school', '校內所有人', '送出後立即出現在校內列表', category.readAccess === 'school')}
        ${choice('readAccess', 'reviewed-school', '審核後公開', '核准前只有作者與管理員看得到', category.readAccess === 'reviewed-school')}
        ${choice('readAccess', 'owner-admin', '只有作者與管理員', '適合申訴或需要保密的內容', ownerOnly)}
      </div>
    </div>`;
  }
  if (state.step === 2) {
    return `<div class="builder-step-card">
      <div class="builder-step-intro"><span>步驟 3</span><h3>要顯示提案者嗎？</h3><p>${fieldError('authorVisible') || (ownerOnly ? '私密分類固定顯示作者，方便管理端聯繫。' : '這只影響有權閱讀內容的人；系統仍會安全保存作者關聯。')}</p></div>
      <section class="builder-question"><header><h4>顯示提案者姓名嗎？</h4><p>${fieldError('authorVisible') || (ownerOnly ? '私密分類固定顯示作者，方便管理端聯繫。' : '隱藏只影響前台；系統仍保留作者關聯。')}</p></header><div class="builder-choices">
        ${choice('authorVisible', 'true', '顯示作者', '讀者可以看到作者名稱', category.authorVisible === true)}
        ${choice('authorVisible', 'false', '隱藏作者', '讀者不會看到作者名稱', category.authorVisible === false, ownerOnly)}
      </div></section>
    </div>`;
  }
  if (state.step === 3) {
    return `<div class="builder-step-card">
      <div class="builder-step-intro"><span>步驟 4</span><h3>這個分類需要附議嗎？</h3><p>這是每個分類自己的設定。開啟後，你可以自行決定門檻人數與開放天數。</p></div>
      <section class="builder-question"><header><h4>提案要先累積附議嗎？</h4><p>${fieldError('support.enabled') || '不開放附議時，提案會在建立或審核通過後直接進入處理流程。'}</p></header><div class="builder-choices">
        ${choice('support.enabled', 'false', '不需要', '建立後直接進入處理', category.support.enabled === false)}
        ${choice('support.enabled', 'true', '需要附議', '達標後才進入處理', category.support.enabled === true)}
      </div></section>
      ${category.support.enabled === true ? `<section class="builder-question builder-question--nested"><header><h4>設定人數與天數</h4><p>兩個數字都可以自行設定，而且必須是正整數。達標會提前成功；期限內未達標則自動結束。</p></header><div class="builder-fields">
        ${inputField('support.goal', '需要多少人附議', category.support.goal, { type: 'number', unit: '人', placeholder: '例如 50', help: '對應真實設定的 support.goal。' })}
        ${inputField('support.deadlineDays', '開放附議幾天', category.support.deadlineDays, { type: 'number', unit: '天', placeholder: '例如 14', help: '對應真實設定的 support.deadlineDays。' })}
      </div></section>` : ''}
    </div>`;
  }
  if (state.step === 4) {
    return `<div class="builder-step-card builder-step-card--focused">
      <div class="builder-step-intro"><span>步驟 5</span><h3>希望多久內得到回應？</h3><p>這也是每個分類獨立設定。可以留空不限制；若有附議，會從附議達標後開始計算。</p></div>
      <div class="builder-fields builder-fields--single">${inputField('responseDeadlineDays', '回應期限', category.responseDeadlineDays, { type: 'number', unit: '天', placeholder: '留空表示不限制', help: '常見設定為 7、14 或 30 天。' })}</div>
      <div class="builder-fixed-rule"><i class="ti ti-lock" aria-hidden="true"></i><div><strong>系統會自動處理的規則</strong><p>所有分類都需要校內帳號登入；附件與留言權限會依閱讀範圍套用，不需要另外設定。</p></div></div>
    </div>`;
  }
  const errors = errorsFor();
  return `<div class="builder-step-card builder-step-card--summary">
    <div class="builder-step-intro"><span>步驟 6</span><h3>${errors.length ? '還差一點就完成了' : '設定完成，可以下載了'}</h3><p>${errors.length ? `還有 ${errors.length} 個必要項目未完成，點擊下方提示即可回去補上。` : '確認下面的人數、期限與權限符合預期，再下載 JSON 放入專案。'}</p></div>
    ${errorSummary(errors)}
    <aside class="builder-impact" data-impact>${impactContent(category)}</aside>
    <section class="builder-apply-guide" aria-labelledby="builder-apply-title">
      <header><span>下載後還要做什麼</span><h4 id="builder-apply-title">把設定提交到 GitHub，部署才會生效</h4><p>下載本身不會改到 App。選一種方式把檔案更新到你的 Novae fork。</p></header>
      <div class="builder-apply-options">
        <article><span>推薦，不需本機工具</span><h5>直接在 GitHub 網頁更新</h5><ol><li>打開 fork 裡的 <code>config/issue-categories.config.json</code></li><li>選擇編輯，把下載檔內容完整貼上</li><li>選 <strong>Commit changes</strong> 提交到 <code>main</code></li><li>到 Actions 等後端與前端 workflow 都變成綠色</li></ol><p>在 GitHub 網頁按 Commit 就已經寫入遠端，不需要再另外 push。</p></article>
        <article><span>已經有 clone 專案</span><h5>用 Git 提交與 push</h5><ol><li>用下載檔覆蓋同一路徑</li><li>在 repository 根目錄執行：</li></ol><pre><code>git add .\ngit commit -m "Update issue categories"\ngit push origin main</code></pre><p>push 後同樣到 GitHub Actions 確認兩個部署完成。</p></article>
      </div>
      <a href="./docs/deployment-guide.html">查看最後發布與驗收教學 <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
    </section>
    <div class="builder-finish-actions">
      <button class="button button-secondary" type="button" data-editor-tab="source"><i class="ti ti-code" aria-hidden="true"></i>查看 JSON</button>
      <button class="button button-dark" type="button" data-download-config><i class="ti ti-download" aria-hidden="true"></i>檢查並下載</button>
    </div>
  </div>`;
}

function renderEditor() {
  const category = activeCategory();
  const stepErrors = errorsForStep();
  const progress = Math.round(((state.step + 1) / WIZARD_STEPS.length) * 100);
  root.querySelector('[data-category-editor]').innerHTML = `
    <header class="builder-editor__header">
      <div><span>分類 ${String(state.activeIndex + 1).padStart(2, '0')}</span><h2>${escapeHtml(category.label || '新的分類')}</h2><p>${WIZARD_STEPS[state.step].description}</p></div>
      <button type="button" data-delete-category ${state.categories.length === 1 ? 'disabled' : ''}><i class="ti ti-trash" aria-hidden="true"></i>刪除分類</button>
    </header>
    <nav class="builder-steps" aria-label="設定步驟">
      ${WIZARD_STEPS.map((step, index) => `<button type="button" data-wizard-step="${index}" class="${index === state.step ? 'active' : ''} ${index < state.step && errorsForStep(index).length === 0 ? 'complete' : ''}" aria-current="${index === state.step ? 'step' : 'false'}" ${canOpenStep(index) ? '' : 'disabled'}><span>${index + 1}</span><strong>${step.label}</strong></button>`).join('')}
      <i aria-hidden="true"><b style="width:${progress}%"></b></i>
    </nav>
    ${state.step < WIZARD_STEPS.length - 1 ? errorSummary(stepErrors) : ''}
    ${wizardStepContent(category)}
    <footer class="builder-step-actions">
      <button class="button button-secondary" type="button" data-previous-step ${state.step === 0 ? 'disabled' : ''}><i class="ti ti-arrow-left" aria-hidden="true"></i>上一步</button>
      ${state.step < WIZARD_STEPS.length - 1 ? `<button class="button button-dark" type="button" data-next-step>下一步<i class="ti ti-arrow-right" aria-hidden="true"></i></button>` : '<span></span>'}
    </footer>`;
}

function renderSource() {
  const errors = validateCategoryConfig(state);
  const summary = root.querySelector('[data-validation-summary]');
  summary.hidden = !state.showValidation || !errors.length;
  root.querySelector('[data-error-list]').innerHTML = errors.length ? `<ul>${errors.map((error) => `<li><button type="button" data-jump-error-index="${error.index}" data-jump-error-field="${error.field}"><strong>${escapeHtml(state.categories[error.index]?.label || `分類 ${error.index + 1}`)}</strong><span>${escapeHtml(error.message)}</span></button></li>`).join('')}</ul>` : '';
  root.querySelector('[data-json-preview]').textContent = JSON.stringify(buildDownloadConfig(state), null, 2);
  const badge = root.querySelector('[data-validity-badge]');
  badge.textContent = state.showValidation ? errors.length ? `${errors.length} 項未完成` : '可以下載' : '草稿';
  badge.classList.toggle('is-valid', state.showValidation && errors.length === 0);
}

function renderView() {
  root.querySelectorAll('[data-editor-tab]').forEach((tab) => {
    const active = tab.dataset.editorTab === state.view;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  root.querySelectorAll('[data-editor-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.editorPanel !== state.view;
  });
}

function renderAll() {
  renderCategoryList();
  renderEditor();
  renderSource();
  renderView();
}

function setNestedValue(category, path, rawValue) {
  const value = ['true', 'false'].includes(rawValue) ? rawValue === 'true' : rawValue;
  if (path.includes('.')) {
    const [group, field] = path.split('.');
    category[group][field] = value;
  } else category[path] = value;
  if (category.readAccess === 'owner-admin') category.authorVisible = true;
  if (path === 'support.enabled' && value === false) category.support = { enabled: false, goal: '', deadlineDays: '' };
}

function focusField(field) {
  requestAnimationFrame(() => {
    const target = root.querySelector(`[data-field="${field}"]`) || root.querySelector(`[data-choice-field="${field}"]`);
    target?.focus();
    target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
}

root.addEventListener('click', (event) => {
  const actionable = event.target.closest([
    '[data-select-category]',
    '[data-editor-tab]',
    '[data-wizard-step]',
    '[data-choice-field]',
    '[data-add-category]',
    '[data-delete-category]',
    '[data-next-step]',
    '[data-previous-step]',
    '[data-focus-error]',
    '[data-jump-error-index]',
    '[data-download-config]',
  ].join(','));
  if (!actionable) return;

  const select = event.target.closest('[data-select-category]');
  if (select) {
    state.activeIndex = Number(select.dataset.selectCategory);
    state.step = 0;
    state.view = 'form';
  }
  const tab = event.target.closest('[data-editor-tab]');
  if (tab) state.view = tab.dataset.editorTab;
  const wizardStep = event.target.closest('[data-wizard-step]');
  if (wizardStep) {
    state.step = Number(wizardStep.dataset.wizardStep);
    state.view = 'form';
  }
  const choiceButton = event.target.closest('[data-choice-field]');
  if (choiceButton && !choiceButton.disabled) setNestedValue(activeCategory(), choiceButton.dataset.choiceField, choiceButton.dataset.choiceValue);
  if (event.target.closest('[data-add-category]')) {
    state.categories.push(createEmptyCategory());
    state.activeIndex = state.categories.length - 1;
    state.step = 0;
    state.view = 'form';
  }
  if (event.target.closest('[data-delete-category]') && state.categories.length > 1) {
    state.categories.splice(state.activeIndex, 1);
    state.activeIndex = Math.max(0, state.activeIndex - 1);
    state.step = 0;
  }
  let stepFocusField = '';
  if (event.target.closest('[data-next-step]')) {
    const errors = errorsForStep();
    if (errors.length) {
      state.showValidation = true;
      stepFocusField = errors[0].field;
    } else {
      state.step = Math.min(WIZARD_STEPS.length - 1, state.step + 1);
    }
  }
  if (event.target.closest('[data-previous-step]')) state.step = Math.max(0, state.step - 1);
  const focusError = event.target.closest('[data-focus-error]');
  const jumpError = event.target.closest('[data-jump-error-index]');
  if (focusError) {
    state.step = stepForField(focusError.dataset.focusError);
    state.view = 'form';
  }
  if (jumpError) {
    state.activeIndex = Number(jumpError.dataset.jumpErrorIndex);
    state.step = stepForField(jumpError.dataset.jumpErrorField);
    state.view = 'form';
  }
  if (event.target.closest('[data-download-config]')) downloadConfig();
  renderAll();
  if (stepFocusField) focusField(stepFocusField);
  if (focusError) focusField(focusError.dataset.focusError);
  if (jumpError) focusField(jumpError.dataset.jumpErrorField);
});

root.addEventListener('input', (event) => {
  const input = event.target.closest('[data-field]');
  if (!input) return;
  setNestedValue(activeCategory(), input.dataset.field, input.value);
  const inlineError = state.showValidation
    ? errorsFor().find((error) => error.field === input.dataset.field)?.message || ''
    : '';
  const field = input.closest('.builder-field');
  field?.classList.toggle('has-error', Boolean(inlineError));
  if (field) field.querySelector('small').textContent = inlineError || field.dataset.fieldHelp;
  renderCategoryList();
  renderSource();
  const impact = root.querySelector('[data-impact]');
  if (impact) impact.innerHTML = impactContent(activeCategory());
});

root.querySelector('[data-import-config]').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const imported = normalizeImportedConfig(JSON.parse(await file.text()));
    state.categories = imported.categories;
    state.activeIndex = 0;
    state.step = 0;
    state.view = 'form';
    state.showValidation = false;
    root.querySelector('[data-builder-message]').textContent = `已開啟 ${file.name}，修改完成後可下載新版。`;
    renderAll();
  } catch (error) {
    root.querySelector('[data-builder-message]').textContent = error instanceof Error ? error.message : '無法讀取設定檔。';
  } finally {
    event.target.value = '';
  }
});

function downloadConfig() {
  const errors = validateCategoryConfig(state);
  const message = root.querySelector('[data-builder-message]');
  state.showValidation = true;
  if (errors.length) {
    state.activeIndex = Math.max(0, errors[0].index);
    state.step = stepForField(errors[0].field);
    state.view = 'form';
    message.textContent = `請先完成 ${errors.length} 項設定；已帶你到第一個需要修改的位置。`;
    focusField(errors[0].field);
    return;
  }
  const blob = new Blob([`${JSON.stringify(buildDownloadConfig(state), null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'issue-categories.config.json';
  link.click();
  URL.revokeObjectURL(url);
  message.textContent = '設定檔已下載。請覆蓋 config/issue-categories.config.json，提交並 push 到 GitHub；部署成功後才會生效。';
}

renderAll();

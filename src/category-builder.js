import './styles/index.css';
import './styles/category-builder.css';
import {
  buildDownloadConfig,
  createEmptyCategory,
  deriveCategorySummary,
  normalizeImportedConfig,
  validateCategoryConfig,
} from './modules/category-config.js';

const root = document.querySelector('[data-category-builder]');
const state = {
  categories: [createEmptyCategory()],
  activeIndex: 0,
  view: 'form',
  showValidation: false,
};

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
    <span class="builder-choice__mark"></span><span><strong>${title}</strong><small>${description}</small></span>
  </button>`;
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

function renderEditor() {
  const category = activeCategory();
  const ownerOnly = category.readAccess === 'owner-admin';
  const errors = errorsFor();
  root.querySelector('[data-category-editor]').innerHTML = `
    <header class="builder-editor__header">
      <div><span>分類 ${String(state.activeIndex + 1).padStart(2, '0')}</span><h2>${escapeHtml(category.label || '未命名分類')}</h2><p>設定這個分類在提案建立、閱讀、附議與回應流程中的行為。</p></div>
      <button type="button" data-delete-category ${state.categories.length === 1 ? 'disabled' : ''}><i class="ti ti-trash" aria-hidden="true"></i>刪除分類</button>
    </header>
    ${errorSummary(errors)}
    <div class="builder-section">
      <header><span>基本資料</span><p>這兩個欄位用來識別分類並顯示在主程式中。</p></header>
      <div class="builder-fields">
        ${inputField('id', '分類 ID', category.id, { placeholder: 'public-issues', help: '小寫英數與連字號；發布後不建議變更。' })}
        ${inputField('label', '顯示名稱', category.label, { placeholder: '公共議題', help: '顯示於新增入口、列表與分類選單。' })}
      </div>
    </div>
    <div class="builder-section">
      <header><span>閱讀範圍</span><p>${fieldError('readAccess') || '所有選項都需要先以校內 Google 帳號登入。'}</p></header>
      <div class="builder-choices builder-choices--three">
        ${choice('readAccess', 'school', '校內可讀', '建立後立即出現在校內列表', category.readAccess === 'school')}
        ${choice('readAccess', 'reviewed-school', '審核後校內可讀', '核准前只有作者與管理員可讀', category.readAccess === 'reviewed-school')}
        ${choice('readAccess', 'owner-admin', '作者與管理員', '不出現在校內列表', ownerOnly)}
      </div>
    </div>
    <div class="builder-section builder-section--split">
      <div><header><span>作者顯示</span><p>${fieldError('authorVisible') || (ownerOnly ? '私密分類會固定顯示作者，供管理端聯繫。' : '只影響有權閱讀者看到的前台資訊。')}</p></header><div class="builder-choices">
        ${choice('authorVisible', 'true', '顯示作者', '讀者可以看到作者名稱', category.authorVisible === true)}
        ${choice('authorVisible', 'false', '隱藏作者', '讀者看不到作者名稱', category.authorVisible === false, ownerOnly)}
      </div></div>
      <div><header><span>附議機制</span><p>${fieldError('support.enabled') || '決定是否先累積支持人數再進入處理。'}</p></header><div class="builder-choices">
        ${choice('support.enabled', 'false', '不需要附議', '建立後直接進入處理', category.support.enabled === false)}
        ${choice('support.enabled', 'true', '需要附議', '達標後才進入處理', category.support.enabled === true)}
      </div></div>
    </div>
    ${category.support.enabled === true ? `<div class="builder-section builder-section--nested"><header><span>附議條件</span><p>只有開啟附議時才需要這兩個數值。</p></header><div class="builder-fields">
      ${inputField('support.goal', '門檻', category.support.goal, { type: 'number', unit: '人', help: '達到此人數後視為附議成功。' })}
      ${inputField('support.deadlineDays', '期限', category.support.deadlineDays, { type: 'number', unit: '天', help: '期限內未達標會自動結束。' })}
    </div></div>` : ''}
    <div class="builder-section">
      <header><span>回應期限</span><p>留空表示不限制；開啟附議時會從達標後開始計算。</p></header>
      <div class="builder-fields builder-fields--single">${inputField('responseDeadlineDays', '回應期限', category.responseDeadlineDays, { type: 'number', unit: '天', placeholder: '不設定', help: '填入正整數，或留空表示不限制。' })}</div>
    </div>
    <aside class="builder-impact" data-impact>${impactContent(category)}</aside>`;
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
  const select = event.target.closest('[data-select-category]');
  if (select) state.activeIndex = Number(select.dataset.selectCategory);
  const tab = event.target.closest('[data-editor-tab]');
  if (tab) state.view = tab.dataset.editorTab;
  const choiceButton = event.target.closest('[data-choice-field]');
  if (choiceButton && !choiceButton.disabled) setNestedValue(activeCategory(), choiceButton.dataset.choiceField, choiceButton.dataset.choiceValue);
  if (event.target.closest('[data-add-category]')) {
    state.categories.push(createEmptyCategory());
    state.activeIndex = state.categories.length - 1;
    state.view = 'form';
  }
  if (event.target.closest('[data-delete-category]') && state.categories.length > 1) {
    state.categories.splice(state.activeIndex, 1);
    state.activeIndex = Math.max(0, state.activeIndex - 1);
  }
  const focusError = event.target.closest('[data-focus-error]');
  const jumpError = event.target.closest('[data-jump-error-index]');
  if (jumpError) {
    state.activeIndex = Number(jumpError.dataset.jumpErrorIndex);
    state.view = 'form';
  }
  if (event.target.closest('[data-download-config]')) downloadConfig();
  renderAll();
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
  message.textContent = '設定檔已下載，請覆蓋 config/issue-categories.config.json。';
}

renderAll();

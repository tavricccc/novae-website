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
const state = { categories: [createEmptyCategory()], activeIndex: 0 };

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
  }[character]));
}

function activeCategory() {
  return state.categories[state.activeIndex];
}

function fieldError(field) {
  return validateCategoryConfig(state).find((error) => error.index === state.activeIndex && error.field === field)?.message || '';
}

function choiceButton(field, value, label, selected, disabled = false) {
  return `<button type="button" data-choice-field="${field}" data-choice-value="${value}" class="${selected ? 'active' : ''}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}>${label}</button>`;
}

function renderCategoryList() {
  const list = root.querySelector('[data-category-list]');
  root.querySelector('[data-category-count]').textContent = String(state.categories.length);
  list.innerHTML = state.categories.map((category, index) => `<button type="button" data-select-category="${index}" class="${index === state.activeIndex ? 'active' : ''}">
    <span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(category.label || '未命名分類')}</strong><small>${escapeHtml(category.id || '尚未設定 ID')}</small>
  </button>`).join('');
}

function renderEditor() {
  const category = activeCategory();
  const editor = root.querySelector('[data-category-editor]');
  const ownerOnly = category.readAccess === 'owner-admin';
  editor.innerHTML = `<div class="builder-editor__head"><div><small>分類 ${String(state.activeIndex + 1).padStart(2, '0')}</small><h2>${escapeHtml(category.label || '設定新分類')}</h2></div><button type="button" data-delete-category ${state.categories.length === 1 ? 'disabled' : ''}>刪除分類</button></div>
    <div class="builder-field-grid">
      <label class="builder-field"><span>分類 ID</span><input data-field="id" value="${escapeHtml(category.id)}" placeholder="例如 public-issues" autocomplete="off" /><small>${fieldError('id') || '小寫英數與連字號；上線後不要重複使用。'}</small></label>
      <label class="builder-field"><span>顯示名稱</span><input data-field="label" value="${escapeHtml(category.label)}" placeholder="例如 公共議題" autocomplete="off" /><small>${fieldError('label') || '顯示在新增入口與提案列表。'}</small></label>
    </div>
    <section class="builder-rule-card"><div class="builder-rule-card__title"><span>01</span><div><h3>閱讀範圍</h3><p>${fieldError('readAccess') || '所有選項都要求符合校內網域的 Google 帳號登入。'}</p></div></div><div class="builder-choice-grid builder-choice-grid--three">
      ${choiceButton('readAccess', 'school', '校內可讀', category.readAccess === 'school')}
      ${choiceButton('readAccess', 'reviewed-school', '審核後校內可讀', category.readAccess === 'reviewed-school')}
      ${choiceButton('readAccess', 'owner-admin', '作者與管理員', ownerOnly)}
    </div></section>
    <section class="builder-rule-card"><div class="builder-rule-card__title"><span>02</span><div><h3>作者顯示</h3><p>${fieldError('authorVisible') || (ownerOnly ? '作者與管理員範圍會強制顯示作者，供案件聯繫與權限判斷。' : '隱藏只影響有權閱讀者看到的前台資訊。')}</p></div></div><div class="builder-choice-grid">
      ${choiceButton('authorVisible', 'true', '顯示作者', category.authorVisible === true)}
      ${choiceButton('authorVisible', 'false', '隱藏作者', category.authorVisible === false, ownerOnly)}
    </div></section>
    <section class="builder-rule-card"><div class="builder-rule-card__title"><span>03</span><div><h3>附議機制</h3><p>${fieldError('support.enabled') || '開啟時需同時設定正整數門檻與期限。'}</p></div></div><div class="builder-choice-grid">
      ${choiceButton('support.enabled', 'false', '關閉附議', category.support.enabled === false)}
      ${choiceButton('support.enabled', 'true', '開啟附議', category.support.enabled === true)}
    </div>${category.support.enabled === true ? `<div class="builder-field-grid builder-field-grid--compact">
      <label class="builder-field"><span>附議門檻（人）</span><input type="number" min="1" step="1" data-field="support.goal" value="${escapeHtml(category.support.goal)}" /><small>${fieldError('support.goal') || '必須是正整數。'}</small></label>
      <label class="builder-field"><span>附議期限（天）</span><input type="number" min="1" step="1" data-field="support.deadlineDays" value="${escapeHtml(category.support.deadlineDays)}" /><small>${fieldError('support.deadlineDays') || '未達標時會自動結束。'}</small></label>
    </div>` : ''}</section>
    <section class="builder-rule-card"><div class="builder-rule-card__title"><span>04</span><div><h3>回應期限</h3><p>留空代表不設定期限；開啟附議時會從達標後起算。</p></div></div><label class="builder-field builder-field--short"><span>回應期限（天）</span><input type="number" min="1" step="1" data-field="responseDeadlineDays" value="${escapeHtml(category.responseDeadlineDays)}" placeholder="留空＝無期限" /><small>${fieldError('responseDeadlineDays') || '正整數或留空。'}</small></label></section>`;
}

function renderPreview() {
  const errors = validateCategoryConfig(state);
  const output = buildDownloadConfig(state);
  const category = activeCategory();
  const summary = deriveCategorySummary(category);
  const badge = root.querySelector('[data-validity-badge]');
  badge.textContent = errors.length ? `${errors.length} 項待完成` : '可以下載';
  badge.classList.toggle('is-valid', errors.length === 0);
  root.querySelector('[data-derived-preview]').innerHTML = `<dl><div><dt>閱讀</dt><dd>${summary.visibility}</dd></div><div><dt>附議</dt><dd>${summary.support}</dd></div><div><dt>回應</dt><dd>${summary.response}</dd></div><div><dt>衍生權限</dt><dd>${summary.derived}</dd></div></dl>`;
  root.querySelector('[data-json-preview]').textContent = JSON.stringify(output, null, 2);
}

function renderAll() {
  renderCategoryList();
  renderEditor();
  renderPreview();
}

function setNestedValue(category, path, rawValue) {
  const value = ['true', 'false'].includes(rawValue) ? rawValue === 'true' : rawValue;
  if (path.includes('.')) {
    const [group, field] = path.split('.');
    category[group][field] = value;
  } else category[path] = value;
  if (category.readAccess === 'owner-admin') category.authorVisible = true;
  if (path === 'support.enabled' && value === false) {
    category.support.goal = '';
    category.support.deadlineDays = '';
  }
}

root.addEventListener('click', (event) => {
  const select = event.target.closest('[data-select-category]');
  if (select) state.activeIndex = Number(select.dataset.selectCategory);
  const choice = event.target.closest('[data-choice-field]');
  if (choice && !choice.disabled) setNestedValue(activeCategory(), choice.dataset.choiceField, choice.dataset.choiceValue);
  if (event.target.closest('[data-add-category]')) {
    state.categories.push(createEmptyCategory());
    state.activeIndex = state.categories.length - 1;
  }
  if (event.target.closest('[data-delete-category]') && state.categories.length > 1) {
    state.categories.splice(state.activeIndex, 1);
    state.activeIndex = Math.max(0, state.activeIndex - 1);
  }
  if (event.target.closest('[data-download-config]')) downloadConfig();
  renderAll();
});

root.addEventListener('input', (event) => {
  const input = event.target.closest('[data-field]');
  if (!input) return;
  setNestedValue(activeCategory(), input.dataset.field, input.value);
  renderCategoryList();
  renderPreview();
});

root.querySelector('[data-import-config]').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const imported = normalizeImportedConfig(JSON.parse(await file.text()));
    state.categories = imported.categories;
    state.activeIndex = 0;
    root.querySelector('[data-builder-message]').textContent = `已載入 ${file.name}。`;
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
  if (errors.length) {
    message.textContent = `還有 ${errors.length} 項設定需要完成。`;
    return;
  }
  const blob = new Blob([`${JSON.stringify(buildDownloadConfig(state), null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'issue-categories.config.json';
  link.click();
  URL.revokeObjectURL(url);
  message.textContent = '設定檔已下載，可覆蓋 config/issue-categories.config.json。';
}

renderAll();

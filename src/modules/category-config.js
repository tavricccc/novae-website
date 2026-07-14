const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const READ_ACCESS_VALUES = new Set(['school', 'reviewed-school', 'owner-admin']);

export function createEmptyCategory() {
  return {
    id: '',
    label: '',
    readAccess: '',
    authorVisible: null,
    support: {
      enabled: null,
      goal: '',
      deadlineDays: '',
    },
    responseDeadlineDays: '',
  };
}

function positiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0;
}

export function normalizeImportedConfig(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.categories) || raw.categories.length === 0) {
    throw new Error('檔案必須包含至少一個 categories 項目。');
  }

  return {
    categories: raw.categories.map((source) => {
      const category = createEmptyCategory();
      category.id = typeof source?.id === 'string' ? source.id : '';
      category.label = typeof source?.label === 'string' ? source.label : '';
      category.readAccess = READ_ACCESS_VALUES.has(source?.readAccess) ? source.readAccess : '';
      category.authorVisible = typeof source?.authorVisible === 'boolean' ? source.authorVisible : null;
      category.support.enabled = typeof source?.support?.enabled === 'boolean' ? source.support.enabled : null;
      category.support.goal = source?.support?.goal ?? '';
      category.support.deadlineDays = source?.support?.deadlineDays ?? '';
      category.responseDeadlineDays = source?.responseDeadlineDays ?? '';
      if (category.readAccess === 'owner-admin') category.authorVisible = true;
      return category;
    }),
  };
}

export function validateCategoryConfig(config) {
  const errors = [];
  const ids = new Set();

  if (!config.categories.length) {
    errors.push({ index: -1, field: 'categories', message: '至少需要一個分類。' });
  }

  config.categories.forEach((category, index) => {
    if (!ID_PATTERN.test(category.id)) {
      errors.push({ index, field: 'id', message: 'ID 只能使用小寫英數與連字號。' });
    } else if (ids.has(category.id)) {
      errors.push({ index, field: 'id', message: '分類 ID 不可重複。' });
    }
    ids.add(category.id);

    if (!category.label.trim()) errors.push({ index, field: 'label', message: '請輸入顯示名稱。' });
    if (!READ_ACCESS_VALUES.has(category.readAccess)) {
      errors.push({ index, field: 'readAccess', message: '請選擇閱讀範圍。' });
    }
    if (typeof category.authorVisible !== 'boolean') {
      errors.push({ index, field: 'authorVisible', message: '請選擇是否顯示作者。' });
    }
    if (typeof category.support.enabled !== 'boolean') {
      errors.push({ index, field: 'support.enabled', message: '請選擇是否開放附議。' });
    }
    if (category.support.enabled === true) {
      if (!positiveInteger(category.support.goal)) {
        errors.push({ index, field: 'support.goal', message: '附議門檻必須是正整數。' });
      }
      if (!positiveInteger(category.support.deadlineDays)) {
        errors.push({ index, field: 'support.deadlineDays', message: '附議期限必須是正整數。' });
      }
    }
    if (category.responseDeadlineDays !== '' && category.responseDeadlineDays !== null && !positiveInteger(category.responseDeadlineDays)) {
      errors.push({ index, field: 'responseDeadlineDays', message: '回應期限必須是正整數或留空。' });
    }
  });

  return errors;
}

export function buildDownloadConfig(config) {
  return {
    categories: config.categories.map((category) => ({
      id: category.id.trim(),
      label: category.label.trim(),
      readAccess: category.readAccess,
      authorVisible: category.readAccess === 'owner-admin' ? true : category.authorVisible,
      support: category.support.enabled
        ? {
            enabled: true,
            goal: Number(category.support.goal),
            deadlineDays: Number(category.support.deadlineDays),
          }
        : { enabled: false },
      responseDeadlineDays: category.responseDeadlineDays === '' || category.responseDeadlineDays === null
        ? null
        : Number(category.responseDeadlineDays),
    })),
  };
}

export function deriveCategorySummary(category) {
  const visibility = {
    school: '校內登入者可讀',
    'reviewed-school': '審核後校內可讀',
    'owner-admin': '僅作者與管理員',
  }[category.readAccess] || '尚未選擇';
  const support = category.support.enabled === true
    ? `${category.support.deadlineDays || '—'} 天內達到 ${category.support.goal || '—'} 人`
    : category.support.enabled === false ? '不開放附議' : '尚未選擇';
  const response = category.responseDeadlineDays
    ? `${category.support.enabled ? '附議達標' : '建立'}後 ${category.responseDeadlineDays} 天內回應`
    : '不設定回應期限';
  const derived = category.readAccess === 'owner-admin'
    ? '附件與留言維持私密'
    : category.readAccess === 'reviewed-school'
      ? '審核通過後開放校內留言'
      : category.readAccess === 'school' ? '附件與留言限校內' : '等待閱讀範圍';
  return { visibility, support, response, derived };
}

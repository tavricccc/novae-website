export const SITE_LINKS = Object.freeze({
  github: 'https://github.com/tavricccc/novae',
  license: 'https://github.com/tavricccc/novae/blob/main/LICENSE',
  docsHome: Object.freeze({ zh: './docs/', en: './docs/en/' }),
  docsDeploy: Object.freeze({
    zh: './docs/quick-start.html',
    en: './docs/en/quick-start.html',
  }),
  docsConfig: Object.freeze({
    zh: './docs/configuration.html',
    en: './docs/en/configuration.html',
  }),
  docsSecurity: Object.freeze({
    zh: './docs/security.html',
    en: './docs/en/security.html',
  }),
});

export function resolveSiteLink(key, language = 'zh') {
  const value = SITE_LINKS[key];
  if (typeof value === 'string') return value;
  return value?.[language === 'en' ? 'en' : 'zh'] || '';
}

export function applySiteLinks(root = document, language = 'zh') {
  root.querySelectorAll('[data-site-href]').forEach((node) => {
    const value = resolveSiteLink(node.dataset.siteHref, language);
    if (value) node.setAttribute('href', value);
  });
}

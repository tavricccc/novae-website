import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEPLOYMENT_NAV_EN,
  DEPLOYMENT_NAV_ZH,
  NAV_EN,
  NAV_ZH,
  flattenNav,
} from '../content/docs-navigation.mjs';
import { resolveSiteLink } from '../src/config/site.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function compareShape(left, right, location = 'root') {
  const errors = [];
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return [`${location}: locale value types differ`];
    if (left.length !== right.length) errors.push(`${location}: locale arrays have different lengths`);
    for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
      errors.push(...compareShape(left[index], right[index], `${location}[${index}]`));
    }
    return errors;
  }
  const leftObject = left !== null && typeof left === 'object';
  const rightObject = right !== null && typeof right === 'object';
  if (leftObject || rightObject) {
    if (!leftObject || !rightObject) return [`${location}: locale value types differ`];
    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();
    for (const key of new Set([...leftKeys, ...rightKeys])) {
      if (!(key in left)) errors.push(`${location}.${key}: missing from Chinese catalog`);
      else if (!(key in right)) errors.push(`${location}.${key}: missing from English catalog`);
      else errors.push(...compareShape(left[key], right[key], `${location}.${key}`));
    }
    return errors;
  }
  if (typeof left !== typeof right) errors.push(`${location}: locale value types differ`);
  return errors;
}

function sourceFor(lang, id) {
  if (id === 'changelog') return 'content/changelog.md';
  if (id === 'README') return lang === 'zh' ? 'docs/README.md' : null;
  return `docs/${lang === 'en' ? 'en/' : ''}${id}.md`;
}

function validateNavigation() {
  const errors = [];
  const expectedSources = new Set();
  const configurations = [
    ['zh', NAV_ZH, DEPLOYMENT_NAV_ZH],
    ['en', NAV_EN, DEPLOYMENT_NAV_EN],
  ];
  for (const [lang, nav, deploymentNav] of configurations) {
    const ids = new Set();
    const files = new Set();
    for (const item of [...flattenNav(nav), ...deploymentNav]) {
      if (ids.has(item.id)) errors.push(`${lang} navigation repeats id: ${item.id}`);
      if (files.has(item.file)) errors.push(`${lang} navigation repeats file: ${item.file}`);
      ids.add(item.id);
      files.add(item.file);
      const source = sourceFor(lang, item.id);
      if (!source) continue;
      expectedSources.add(source.replaceAll('\\', '/'));
      if (!fs.existsSync(path.join(root, source))) errors.push(`${lang} navigation source is missing: ${source}`);
    }
  }

  const markdownFiles = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        markdownFiles.push(path.relative(root, absolute).replaceAll('\\', '/'));
      }
    }
  };
  visit(path.join(root, 'docs'));
  for (const file of markdownFiles) {
    if (!expectedSources.has(file)) errors.push(`documentation page is not in navigation: ${file}`);
  }
  return errors;
}

function validateSiteLinkKeys() {
  const errors = [];
  for (const file of ['index.html']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    for (const match of source.matchAll(/data-site-href="([^"]+)"/g)) {
      for (const language of ['zh', 'en']) {
        if (!resolveSiteLink(match[1], language)) errors.push(`${file}: unknown site link key ${match[1]}`);
      }
    }
  }
  return errors;
}

const zh = readJson('content/landing/zh.json');
const en = readJson('content/landing/en.json');
const errors = [
  ...compareShape(zh, en),
  ...validateNavigation(),
  ...validateSiteLinkKeys(),
];

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Content catalogs, documentation navigation, and site links are valid.');
}

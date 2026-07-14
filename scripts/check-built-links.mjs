import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const htmlFiles = [];

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(absolute);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(absolute);
  }
}

function targetFor(sourceFile, rawUrl) {
  const clean = rawUrl.split('#')[0].split('?')[0];
  if (!clean || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(clean)) return null;
  const decoded = decodeURIComponent(clean);
  const target = decoded.startsWith('/')
    ? path.join(dist, decoded.replace(/^\/+/, ''))
    : path.resolve(path.dirname(sourceFile), decoded);
  if (decoded.endsWith('/') || (fs.existsSync(target) && fs.statSync(target).isDirectory())) {
    return path.join(target, 'index.html');
  }
  return target;
}

if (!fs.existsSync(dist)) {
  console.error('dist/ is missing. Run the production build before checking links.');
  process.exit(1);
}

visit(dist);
const broken = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const target = targetFor(file, match[1]);
    if (target && !fs.existsSync(target)) {
      broken.push(`${path.relative(dist, file)} → ${match[1]}`);
    }
  }
}

if (broken.length) {
  console.error(`Broken built links:\n${[...new Set(broken)].map((item) => `- ${item}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Checked internal links in ${htmlFiles.length} built HTML pages.`);
}

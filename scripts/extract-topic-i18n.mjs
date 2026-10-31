/**
 * One-shot: extract EN/RW strings from topic page JS into i18n + layouts.
 * Run: node scripts/extract-topic-i18n.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { contraceptionPage } from '../src/content/contraceptionPage.js';
import { pregnancyPage } from '../src/content/pregnancyPage.js';
import { menstrualPage } from '../src/content/menstrualPage.js';
import { stiPage } from '../src/content/stiPage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKIP = new Set(['id', 'icon', 'variant', 'color', 'heroStyle', 'labelStyle', 'badgeStyle']);

const pages = {
  contraception: contraceptionPage,
  pregnancy: pregnancyPage,
  menstrual: menstrualPage,
  sti: stiPage,
};

function setNested(tree, parts, value) {
  let node = tree;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const p = parts[i];
    if (!node[p] || typeof node[p] !== 'object' || Array.isArray(node[p])) node[p] = {};
    node = node[p];
  }
  node[parts[parts.length - 1]] = value;
}

function convert(en, rw, parts, enTree, rwTree) {
  if (typeof en === 'string') {
    setNested(enTree, parts, en);
    setNested(rwTree, parts, typeof rw === 'string' ? rw : en);
    return `topic.${parts.join('.')}`;
  }
  if (Array.isArray(en)) {
    const useId = en[0] && typeof en[0] === 'object' && en[0].id;
    return en.map((item, i) => {
      const seg = useId ? String(item.id) : String(i);
      return convert(item, Array.isArray(rw) ? rw[i] : undefined, [...parts, seg], enTree, rwTree);
    });
  }
  if (en && typeof en === 'object') {
    const out = {};
    for (const key of Object.keys(en)) {
      if (SKIP.has(key)) {
        out[key] = en[key];
        continue;
      }
      out[key] = convert(en[key], rw?.[key], [...parts, key], enTree, rwTree);
    }
    return out;
  }
  return en;
}

const enTree = {};
const rwTree = {};
const layouts = {};

for (const [name, page] of Object.entries(pages)) {
  layouts[name] = convert(page.en, page.rw, [name], enTree, rwTree);
}

const outDir = path.join(__dirname, '../src/content');
fs.writeFileSync(
  path.join(outDir, 'topicLayouts.js'),
  `/** Structure + translation keys for topic pages. Text lives in i18n/topicStrings.js */\nexport const topicLayouts = ${JSON.stringify(layouts, null, 2)};\n`,
  'utf8',
);
fs.writeFileSync(
  path.join(path.join(__dirname, '../src/i18n'), 'topicStrings.js'),
  `/** Auto-extracted topic article copy (EN + RW). Editable via CMS / <T k="topic...." /> */\nexport const topicEn = ${JSON.stringify(enTree, null, 2)};\n\nexport const topicRw = ${JSON.stringify(rwTree, null, 2)};\n`,
  'utf8',
);
console.log('Wrote topicLayouts.js and topicStrings.js');

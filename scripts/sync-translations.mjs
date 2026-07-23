/**
 * Export src/i18n/translations.js → ../izere-backend/data/ui_translations.json
 * Run: npm run sync-translations
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dynamic import of translations object (en + rw trees only)
const mod = await import('../src/i18n/translations.js');
const translations = mod.translations;

if (!translations?.en || !translations?.rw) {
  console.error('Could not read translations.en / translations.rw from translations.js');
  process.exit(1);
}

const outPath = path.join(__dirname, '../../izere-backend/data/ui_translations.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(
  outPath,
  JSON.stringify({ en: translations.en, rw: translations.rw }, null, 2),
  'utf8',
);
console.log('Wrote', outPath);

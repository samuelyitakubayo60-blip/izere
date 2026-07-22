/** Pick stored DB content for the active site language (no Google Translate). */
export function getLocalizedContent(item, language) {
  if (!item) return '';
  if (language === 'rw' && item.content_rw) return item.content_rw;
  return item.content_en || item.content_rw || '';
}

export function getLocalizedTitle(item, language) {
  if (!item) return '';
  // Titles in seed data are English; body has content_rw
  return item.title;
}

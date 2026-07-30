import { pregnancyPage } from './pregnancyPage';
import { menstrualPage } from './menstrualPage';
import { stiPage } from './stiPage';
import { contraceptionPage } from './contraceptionPage';

const pages = {
  pregnancy: pregnancyPage,
  menstrual: menstrualPage,
  sti: stiPage,
  contraception: contraceptionPage,
};

export function getTopicPage(topicKey, lang) {
  const page = pages[topicKey];
  if (!page) return null;
  return page[lang] || page.en;
}

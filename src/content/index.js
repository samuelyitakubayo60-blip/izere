import { topicLayouts } from './topicLayouts.js';

export function getTopicPage(topicKey) {
  return topicLayouts[topicKey] || null;
}

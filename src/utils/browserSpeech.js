/** Browser TTS fallback when HF audio API is unavailable */
export function speakWithBrowser(text, language = 'en') {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
    utterance.lang = language === 'rw' ? 'rw-RW' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
}

export function pauseBrowserSpeech() {
  if (window.speechSynthesis?.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
    return true;
  }
  return false;
}

export function resumeBrowserSpeech() {
  if (window.speechSynthesis?.paused) {
    window.speechSynthesis.resume();
    return true;
  }
  return false;
}

export function stopBrowserSpeech() {
  window.speechSynthesis?.cancel();
}

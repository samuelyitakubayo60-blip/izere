/* =====================================================
   IBANGA HealthBot Rwanda — Main JS
   ===================================================== */

/* ── Accessibility Controls ── */
const body = document.body;

const highContrastBtn = document.getElementById('btn-high-contrast');
if (highContrastBtn) {
  highContrastBtn.addEventListener('click', () => {
    body.classList.toggle('high-contrast');
    highContrastBtn.textContent = body.classList.contains('high-contrast') ? '🔆 Normal' : '🔳 High Contrast';
  });
}

const largeFontBtn = document.getElementById('btn-large-font');
if (largeFontBtn) {
  largeFontBtn.addEventListener('click', () => {
    body.classList.toggle('simple-mode');
    largeFontBtn.textContent = body.classList.contains('simple-mode') ? '🔡 Normal Text' : '🔠 Large Text';
  });
}

/* ── Smooth Scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href !== '#') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

/* ── Navbar active on scroll ── */
// Only apply scroll-based active state to hash links within the same page
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const sections = [...navLinks].map(l => {
  const href = l.getAttribute('href');
  if (href && href !== '#') {
    return document.querySelector(href);
  }
  return null;
}).filter(Boolean);

if (sections.length > 0) {
  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach((section, i) => {
      if (section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[i].classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
  });
}

/* ── Intersection Observer for fade-in animations ── */
document.addEventListener('DOMContentLoaded', function() {
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => observer.observe(el));
  }
  
  // Initialize translation
  initTranslation();
});

/* ── Animated phone chat on hero ── */
(function animateHeroChat() {
  const msgs = [
    { type: 'bot', text: '🌿 Hello! I\'m IBANGA HealthBot. I can help you with health information.' },
    { type: 'user', text: 'What is PrEP?' },
    { type: 'bot', text: 'PrEP is medication that helps prevent HIV infection...' },
    { type: 'user', text: 'My period is late. Am I pregnant?' },
    { type: 'bot', text: 'Signs of pregnancy include a late period...' },
  ];
  const container = document.getElementById('hero-chat-body');
  if (!container) return;
  let i = 0;

  function addMsg() {
    if (i >= msgs.length) { i = 0; container.innerHTML = ''; }
    const m = msgs[i];
    const div = document.createElement('div');
    div.className = `pmsg ${m.type}`;
    div.innerHTML = m.text;
    div.style.opacity = '0';
    div.style.transform = 'translateY(8px)';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    requestAnimationFrame(() => {
      div.style.transition = 'opacity 0.4s, transform 0.4s';
      div.style.opacity = '1';
      div.style.transform = 'translateY(0)';
    });
    i++;
    if (i < msgs.length) setTimeout(addMsg, 1800);
    else setTimeout(() => { container.innerHTML = ''; i = 0; addMsg(); }, 3000);
  }

  setTimeout(addMsg, 800);
})();

/* ── Stat counter animation ── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target < 10 ? (target * eased).toFixed(1) : Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const statsSection = document.querySelector('.stats-bar');
if (statsSection) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); observer.disconnect(); }
  }, { threshold: 0.4 });
  observer.observe(statsSection);
}

/* ── Mobile nav close on link click ── */
const navCollapse = document.getElementById('navbarNav');
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (navCollapse && navCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});

/* ── Translation Dropdown ── */
function initTranslation() {
  const translateOptions = document.querySelectorAll('.translate-option');
  
  // Handle language selection
  translateOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      
      // Update active state
      translateOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      // Trigger Google Translate with retry logic
      function triggerTranslate() {
        if (window.google && window.google.translate) {
          const selectElement = document.querySelector('.goog-te-combo');
          if (selectElement) {
            selectElement.value = lang;
            selectElement.dispatchEvent(new Event('change'));
            console.log('Translation triggered for language:', lang);
          } else {
            console.log('Google Translate combo not found, retrying...');
            setTimeout(triggerTranslate, 500);
          }
        } else {
          console.log('Google Translate not ready, retrying...');
          setTimeout(triggerTranslate, 1000);
        }
      }
      
      triggerTranslate();
      
      // Store preference
      localStorage.setItem('preferred-language', lang);
    });
  });
  
  // Load saved language preference or default to Kinyarwanda
  const savedLang = localStorage.getItem('preferred-language') || 'rw';
  translateOptions.forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-lang') === savedLang);
  });
  
  // Auto-trigger Kinyarwanda on first load if no preference saved
  if (!localStorage.getItem('preferred-language')) {
    setTimeout(() => {
      const kinyarwandaOption = document.querySelector('.translate-option[data-lang="rw"]');
      if (kinyarwandaOption) {
        kinyarwandaOption.click();
      }
    }, 2000);
  }
}


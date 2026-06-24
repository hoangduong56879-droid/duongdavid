/* ===== SCRIPT.JS ===== */

// ===== PARTICLE SYSTEM =====
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.6 + 0.2};
      background: hsl(${Math.random() > 0.5 ? 270 : 195}, 80%, 65%);
    `;
    container.appendChild(p);
  }
})();

// ===== SCROLL REVEAL =====
(function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.toc-item, .stat-card, .overview-card, .step, .mini-idea-card, .fw-card, .check-item, .tool-item, .rm-week, .action-step'
  );

  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ===== ACTIVE NAV ON SCROLL (reading progress) =====
(function initReadingProgress() {
  // Inject progress bar
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #7c3aed, #06b6d4);
    z-index: 9999;
    transition: width 0.1s linear;
    width: 0%;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });
})();

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 60;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== COPY CODE ON CLICK =====
document.querySelectorAll('.code-block').forEach(block => {
  const pre = block.querySelector('pre');
  if (!pre) return;

  const btn = document.createElement('button');
  btn.textContent = '📋 Copy';
  btn.style.cssText = `
    position: absolute;
    top: 0.5rem;
    right: 0.8rem;
    background: rgba(124, 58, 237, 0.25);
    color: #a855f7;
    border: 1px solid rgba(124, 58, 237, 0.4);
    border-radius: 6px;
    padding: 0.25rem 0.7rem;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  `;

  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
      btn.textContent = '✅ Copied!';
      setTimeout(() => btn.textContent = '📋 Copy', 2000);
    });
  });

  const header = block.querySelector('.code-header');
  if (header) {
    header.style.position = 'relative';
    header.appendChild(btn);
  }
});

// ===== NUMBER COUNTER ANIMATION =====
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el = entry.target;
      const text = el.textContent.trim();

      // Only animate pure numbers
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      const suffix = text.replace(/[0-9.]/g, '');
      if (isNaN(num) || num === 0) return;

      let start = 0;
      const duration = 1200;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * num * 10) / 10;
        el.textContent = current % 1 === 0 ? current.toFixed(0) + suffix : current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ===== TOC FLOATING BUTTON =====
(function initFloatingTOC() {
  const fab = document.createElement('button');
  fab.innerHTML = '☰';
  fab.title = 'Mục lục';
  fab.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #06b6d4);
    color: #fff;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.5);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  fab.addEventListener('mouseenter', () => fab.style.transform = 'scale(1.1)');
  fab.addEventListener('mouseleave', () => fab.style.transform = 'scale(1)');
  fab.addEventListener('click', () => {
    const toc = document.getElementById('toc');
    if (toc) {
      const top = toc.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });

  document.body.appendChild(fab);

  // Hide fab near top
  window.addEventListener('scroll', () => {
    fab.style.opacity = window.scrollY > 300 ? '1' : '0';
    fab.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
  }, { passive: true });
  fab.style.opacity = '0';
})();

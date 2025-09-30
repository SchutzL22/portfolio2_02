// Interações e animações - Portfólio Lucas Schutz

// Utilitários
function select(selector, scope = document) { return scope.querySelector(selector); }
function selectAll(selector, scope = document) { return Array.from(scope.querySelectorAll(selector)); }

// Preloader
window.addEventListener('load', () => {
  const preloader = select('#preloader');
  setTimeout(() => preloader.classList.add('hidden'), 350);
});

// Menu responsivo
(function initMenu() {
  const toggle = select('#navToggle');
  const menu = select('#primaryMenu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('show');
  });
  selectAll('#primaryMenu a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Back to top
(function initBackToTop() {
  const btn = select('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 480) btn.classList.add('show'); else btn.classList.remove('show');
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Scroll reveal
(function initReveal() {
  const elements = selectAll('.reveal');
  if (!('IntersectionObserver' in window) || elements.length === 0) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  elements.forEach(el => io.observe(el));
})();

// Typing effect
(function initTyping() {
  const typed = select('.typed');
  if (!typed) return;
  const strings = JSON.parse(typed.getAttribute('data-strings') || '[]');
  let strIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const typeSpeed = 36;
  const deleteSpeed = 22;
  const holdMs = 1400;

  function tick() {
    const current = strings[strIndex] || '';
    if (!deleting) {
      charIndex++;
      typed.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        setTimeout(tick, holdMs);
        return;
      }
    } else {
      charIndex--;
      typed.textContent = current.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        strIndex = (strIndex + 1) % strings.length;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }
  tick();
})();

// Hero particles - Canvas
(function initParticles() {
  const canvas = select('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0;
  let particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    width = canvas.clientWidth; height = canvas.clientHeight;
    canvas.width = Math.floor(width * DPR); canvas.height = Math.floor(height * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: rand(0, width), y: rand(0, height),
      vx: rand(-0.35, 0.35), vy: rand(-0.35, 0.35),
      r: rand(1.0, 2.2), a: rand(0.3, 0.9)
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    // draw links
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y; const d = Math.hypot(dx, dy);
        if (d < 120) {
          const alpha = (1 - d / 120) * 0.5;
          ctx.strokeStyle = `rgba(91, 140, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    // draw particles and update
    for (const p of particles) {
      ctx.fillStyle = `rgba(0, 230, 255, ${p.a})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = width + 10; if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10; if (p.y > height + 10) p.y = -10;
    }
    requestAnimationFrame(step);
  }

  resize(); createParticles(); step();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

// Formulário de contato (mailto)
(function initContactForm() {
  const form = select('#contactForm');
  const status = select('#formStatus');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = select('#name').value.trim();
    const email = select('#email').value.trim();
    const message = select('#message').value.trim();
    if (!name || !email || !message) {
      status.textContent = 'Preencha todos os campos.';
      return;
    }
    const subject = encodeURIComponent(`Contato via Portfólio - ${name}`);
    const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`);
    window.location.href = `mailto:contato@lucasschutz.dev?subject=${subject}&body=${body}`;
    status.textContent = 'Abrindo seu cliente de email...';
    setTimeout(() => { status.textContent = ''; form.reset(); }, 2000);
  });
})();
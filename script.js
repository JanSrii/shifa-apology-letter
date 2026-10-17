/* =====================================================
   SCRIPT — Particles, Floating Hearts, Reveal
   ===================================================== */

/* ===========================
   PARTICLE SYSTEM
   =========================== */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(232,103,122,',
    'rgba(155,126,203,',
    'rgba(212,168,67,',
    'rgba(247,197,204,',
  ];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.r   = Math.random() * 2.5 + 0.5;
      this.vx  = (Math.random() - 0.5) * 0.4;
      this.vy  = (Math.random() - 0.5) * 0.4;
      this.a   = Math.random() * 0.6 + 0.15;
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life= Math.random() * 200 + 100;
      this.age = 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const fade = this.age < 20
        ? this.age / 20
        : this.age > this.life - 20
          ? (this.life - this.age) / 20
          : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + (this.a * fade) + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ===========================
   FLOATING HEARTS
   =========================== */
(function () {
  const container = document.getElementById('floating-hearts');
  const EMOJIS = ['❤️', '🌸', '💜', '🌷', '💛', '✨', '🤍', '💖'];

  function spawnHeart() {
    const el = document.createElement('span');
    el.classList.add('fheart');
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left     = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 1 + 0.7) + 'rem';
    const dur = Math.random() * 8 + 7;
    el.style.animationDuration  = dur + 's';
    el.style.animationDelay     = Math.random() * 3 + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 3) * 1000);
  }

  // Spawn 20 initially staggered
  for (let i = 0; i < 20; i++) {
    setTimeout(spawnHeart, i * 400);
  }
  setInterval(spawnHeart, 700);
})();

/* ===========================
   SCROLL REVEAL
   =========================== */
(function () {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ===========================
   HERO TITLE WORD ANIMATION
   =========================== */
(function () {
  const words = document.querySelectorAll('.hero-title .word');
  words.forEach((w, i) => {
    w.style.opacity = '0';
    w.style.transform = 'translateY(30px)';
    w.style.transition = `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`;
    setTimeout(() => {
      w.style.opacity = '1';
      w.style.transform = 'translateY(0)';
    }, 300 + i * 150);
  });
})();

/* ===========================
   LETTER MODAL
   =========================== */
(function () {
  const overlay   = document.getElementById('modal-overlay');
  const openBtn   = document.getElementById('open-letter-btn');
  const closeBtn  = document.getElementById('modal-close');

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

/* ===========================
   CURSOR SPARKLE TRAIL
   =========================== */
(function () {
  const SPARKS = ['✨', '🌸', '💫', '⭐', '🌷'];
  let last = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 80) return;
    last = now;
    const spark = document.createElement('span');
    spark.textContent = SPARKS[Math.floor(Math.random() * SPARKS.length)];
    spark.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top:  ${e.clientY}px;
      font-size: ${Math.random() * 12 + 10}px;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      animation: sparkFade 0.8s ease forwards;
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
  });

  // Inject sparkFade keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkFade {
      0%   { opacity:1; transform: translate(-50%,-50%) scale(1);   }
      100% { opacity:0; transform: translate(-50%,-90%) scale(0.3); }
    }
  `;
  document.head.appendChild(style);
})();

/* ===========================
   PARALLAX HERO VISUAL
   =========================== */
(function () {
  const img = document.getElementById('letter-img');
  if (!img) return;
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    img.style.transform = `translateY(0px) rotate(${dx * 3 - 1}deg) scale(1.02) perspective(600px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
  });
  window.addEventListener('mouseleave', () => {
    img.style.transform = '';
  });
})();

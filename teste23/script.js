/* =========================================================
   CONFIGURAÇÃO DO PORTFÓLIO
   ========================================================= */

const WHATSAPP_NUMBER = '5531971687019';
const WHATSAPP_MESSAGE = 'Olá! Vi seu portfólio e gostaria de falar sobre um criativo.';
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
document.querySelectorAll('[data-whatsapp]').forEach(a => a.href = waUrl);

const portfolioVideos = [
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949685/sample-01.mp4', poster:'',title:'UGC IA 01', subtitle:'Hook + retenção' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949684/sample-02.mp4', poster:'',title:'UGC IA 02', subtitle:'Direct Response' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949691/sample-03.mp4', poster:'',title:'UGC IA 03', subtitle:'Oferta + retenção' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949687/sample-04.mp4', poster:'',title:'UGC IA 04', subtitle:'Hook + prova' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949684/sample-05.mp4', poster:'',title:'UGC IA 05', subtitle:'Ad performance' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949685/sample-06.mp4', poster:'',title:'UGC IA 06', subtitle:'Creative testing' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949684/sample-07.mp4', poster:'',title:'UGC IA 07', subtitle:'UGC + storytelling' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949684/sample-07.mp4', poster:'',title:'UGC IA 08', subtitle:'Oferta direta' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949684/sample-07.mp4', poster:'',title:'UGC IA 09', subtitle:'Social proof' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949686/sample-10.mp4', poster:'',title:'UGC IA 10', subtitle:'Variação de hook' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949686/sample-11.mp4', poster:'',title:'UGC IA 11', subtitle:'Performance' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949689/sample-12.mp4', poster:'',title:'UGC IA 12', subtitle:'Storytelling' }
];

const categoryConfig = {
  ugc: { label:'UGC IA', subtitle:'UGC com IA', indexes:[0,1,2,3,4,5,6] },
  cinematic: { label:'IA CINEMATOGRÁFICO', subtitle:'Storytelling visual', indexes:[7,8,9,10,11,0,1] },
  reel: { label:'REEL VIRAL', subtitle:'Reel de performance', indexes:[2,4,6,8,10,1,3] },
  hardcopy: { label:'HARD COPY', subtitle:'Criativo direto', indexes:[3,5,7,9,11,2,4] }
};

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;

function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function createMediaElement(video) {
  if (video.type === 'vturb') {
    const wrap = document.createElement('div');
    wrap.className = 'vturb-media';
    wrap.dataset.vturbSrc = video.src;
    if (video.poster) wrap.style.backgroundImage = `url("${video.poster}")`;
    const iframe = document.createElement('iframe');
    iframe.src = video.src;
    iframe.title = video.title || 'Vídeo VTurb';
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.className = 'vturb-frame';
    wrap.appendChild(iframe);
    return wrap;
  }
  const el = document.createElement('video');
  el.muted = true;
  el.playsInline = true;
  el.loop = true;
  el.disablePictureInPicture = true;
  el.setAttribute('disablePictureInPicture', '');
  if (video.poster) el.poster = video.poster;

  if (!isMobile) {
    // DESKTOP ORIGINAL: carregamento e reprodução instantânea
    el.preload = 'metadata';
    el.autoplay = true;
    el.src = video.src;
  } else {
    // MOBILE OTIMIZADO: não aloca memória de vídeo até entrar na tela
    el.preload = 'none';
    el.dataset.src = video.src;
  }
  return el;
}

function card(video, label, index) {
  const el = document.createElement('article');
  el.className = `video-card media-${video.type}`;
  el.dataset.type = video.type;
  el.dataset.index = index;
  const media = createMediaElement(video);
  el.appendChild(media);
  if (video.type === 'mp4') {
    wireMp4(el, media);
  } else {
    el.classList.add('is-embedded');
  }
  const soundIndicator = document.createElement('div');
  soundIndicator.className = 'sound-indicator';
  soundIndicator.innerHTML = '🔊';
  soundIndicator.setAttribute('aria-hidden', 'true');
  el.appendChild(soundIndicator);

  const overlay = document.createElement('div');
  overlay.className = 'card-overlay';
  overlay.innerHTML = `<div class="card-cat"><span></span> ${escapeHtml(label)}</div><h3>${escapeHtml(video.title || 'Criativo')}</h3><p>${escapeHtml(video.subtitle || 'Criativo')}</p>`;
  el.appendChild(overlay);
  return el;
}

let userInteracted = false;
window.addEventListener('pointerdown', () => { userInteracted = true; }, { once:false, passive:true });
window.addEventListener('keydown', () => { userInteracted = true; }, { once:false });
window.addEventListener('touchstart', () => { userInteracted = true; }, { once:false, passive:true });

/* =========================================================
   CONTROLE GLOBAL DE ÁUDIO
   ========================================================= */
function pauseAllVideos() {
  document.querySelectorAll('.video-card video').forEach(v => {
    v.muted = true;
  });
  document.querySelectorAll('.video-card').forEach(c => {
    c.classList.remove('has-sound');
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseAllVideos();
});

/* =========================================================
   INTERSECTION OBSERVER PARA VÍDEOS
   ========================================================= */
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target.querySelector('video');
    if (!video) return;
    if (entry.isIntersecting) {
      if (isMobile && !video.src && video.dataset.src) {
        video.src = video.dataset.src;
        video.load();
      }
      video.play().catch(() => {});
    } else {
      video.pause();
      if (!isMobile) {
        video.muted = true;
        entry.target.classList.remove('has-sound');
      }
    }
  });
}, { threshold: isMobile ? 0.35 : 0.1, rootMargin: isMobile ? '60px' : '80px' });

function wireMp4(cardEl, video) {
  videoObserver.observe(cardEl);

  const ensurePlaying = () => {
    if (isMobile && !video.src && video.dataset.src) {
      video.src = video.dataset.src;
      video.load();
    }
    if (video.paused) video.play().catch(() => {});
  };

  const muteAllExcept = (exceptVideo) => {
    document.querySelectorAll('.video-card video').forEach(v => {
      if (v !== exceptVideo) v.muted = true;
    });
    document.querySelectorAll('.video-card').forEach(c => {
      if (c.querySelector('video') !== exceptVideo) c.classList.remove('has-sound');
    });
  };

  const toggleAudio = () => {
    userInteracted = true;
    ensurePlaying();
    if (video.muted) {
      muteAllExcept(video);
      video.muted = false;
      video.volume = 1;
      cardEl.classList.add('has-sound');
    } else {
      video.muted = true;
      cardEl.classList.remove('has-sound');
    }
  };

  // DESKTOP: hover original com som e cursor
  cardEl.addEventListener('mouseenter', () => {
    if (isTouchDevice) return;
    ensurePlaying();
    muteAllExcept(video);
    video.muted = false;
    video.volume = 1;
    cardEl.classList.add('has-sound');
  });

  cardEl.addEventListener('mouseleave', () => {
    if (isTouchDevice) return;
    video.muted = true;
    cardEl.classList.remove('has-sound');
  });

  cardEl.addEventListener('click', (e) => {
    if (e.target.closest('.arrow') || e.target.closest('button')) return;
    if (isTouchDevice) return;
    toggleAudio();
  });

  /* ===== MOBILE: TAP DETECTION ===== */
  if (isTouchDevice) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    cardEl.addEventListener('touchstart', (e) => {
      if (e.target.closest('.arrow')) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    cardEl.addEventListener('touchend', (e) => {
      if (e.target.closest('.arrow')) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const dt = Date.now() - touchStartTime;
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && dt < 300) {
        e.preventDefault();
        toggleAudio();
      }
    }, { passive: false });
  }
}

/* =========================================================
   CARROSSEL — CONFIGURAÇÕES & PRESETS ORIGINAIS
   ========================================================= */

const MOVEMENT_PRESETS = {
  continuousRight: { type: 'continuous-right', speed: 75 },
  continuousLeft: { type: 'continuous-left', speed: 75 },
  every3Cards: { type: 'step', direction: 'right', cardsPerStep: 3, intervalMs: 4200, durationMs: 900 },
  pingPong: { type: 'ping-pong', direction: 'right', cardsPerStep: 2, intervalMs: 2800, durationMs: 1100 },
  pauseStep: { type: 'pause-step', direction: 'left', cardsPerStep: 1, intervalMs: 5000, durationMs: 750, pauseMs: 1800 },
  fastSlow: { type: 'fast-slow', direction: 'right', speedMin: 10, speedMax: 48, cycleMs: 4200 },
  randomStep: { type: 'random-step', direction: 'right', minCards: 1, maxCards: 3, intervalMs: 3000, durationMs: 850 },
  wave: { type: 'wave', direction: 'left', speed: 34, waveMs: 5200 }
};

const CAROUSEL_SPEED = isTouchDevice ? 40 : 75;

const continuousRight = { type: 'continuous-right', speed: CAROUSEL_SPEED };
const continuousLeft  = { type: 'continuous-left',  speed: CAROUSEL_SPEED };

const CAROUSEL_MOVEMENTS = {
  featured:  { ...continuousRight, pauseOnHover: true },
  ugc:       continuousRight,
  cinematic: continuousLeft,
  reel:      continuousRight,
  hardcopy:  continuousLeft
};

function setupCarousel(shell, options = {}) {
  const track = shell.querySelector('.carousel-track');
  const prev = shell.querySelector('.prev');
  const next = shell.querySelector('.next');
  const infinite = options.infinite !== false;
  const movement = options.movement || MOVEMENT_PRESETS.continuousRight;

  let dragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let moved = false;
  let loopWidth = 0;
  let lastFrame = performance.now();
  let animationFrame = null;
  let movementTimer = null;
  let pauseTimer = null;
  let hoverPaused = false;
  let audioPaused = false;
  let direction = movement.direction === 'left' ? -1 : 1;
  let pingDirection = direction;
  let inViewport = true;
  let started = false;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const step = () => Math.max(track.clientWidth * 0.72, 260);

  const measureLoop = () => {
    if (!infinite) return;
    const sw = track.scrollWidth;
    if (sw > 0) loopWidth = sw / 3;
  };

  const normalizeLoop = () => {
    if (!infinite || !loopWidth) return;
    if (currentTranslate > 0) currentTranslate -= loopWidth;
    else if (currentTranslate < -loopWidth * 2) currentTranslate += loopWidth;
  };

  const applyTranslate = () => {
    track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
  };

  const moveBy = (amount, duration = 700) => {
    if (dragging) return;
    if (!infinite) {
      currentTranslate -= amount;
      applyTranslate();
      return;
    }
    const start = currentTranslate;
    const target = currentTranslate - amount;
    const t0 = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const anim = now => {
      if (dragging || hoverPaused || audioPaused || (isMobile && !inViewport)) return;
      const t = clamp((now - t0) / duration, 0, 1);
      currentTranslate = start + (target - start) * ease(t);
      normalizeLoop();
      applyTranslate();
      if (t < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  };

  prev?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); moveBy(-step(), 550); });
  next?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); moveBy(step(), 550); });

  /* ========== DRAG / ARRASTAR ========== */
  track.addEventListener('pointerdown', e => {
    if (e.target.closest('button') || e.target.closest('iframe')) return;
    dragging = true; moved = false; track.classList.add('dragging');
    startX = e.clientX;
    track.setPointerCapture?.(e.pointerId);
  });
  track.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) moved = true;
    currentTranslate += dx * 1.15;
    startX = e.clientX;
    normalizeLoop();
    applyTranslate();
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false; track.classList.remove('dragging'); normalizeLoop(); applyTranslate();
    if (moved) {
      setTimeout(() => { moved = false; }, 50);
      pauseAllVideos();
    }
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  window.addEventListener('pointerup', endDrag, { passive: true });

  /* ========== PAUSA NO HOVER DO CARD ========== */
  const bindHoverPause = () => {
    if (options.pauseOnHover === false) return;
    track.querySelectorAll('.video-card').forEach(c => {
      c.addEventListener('mouseenter', () => { hoverPaused = true; });
      c.addEventListener('mouseleave', () => { hoverPaused = false; lastFrame = performance.now(); });
    });
  };

  /* ========== PAUSA QUANDO ALGUM VÍDEO TEM SOM ========== */
  const checkAudioPause = () => {
    const hasSound = track.querySelector('.video-card.has-sound');
    audioPaused = !!hasSound;
  };
  setInterval(checkAudioPause, 200);

  const canMove = () => {
    if (isMobile && !inViewport) return false;
    return !dragging && !hoverPaused && !audioPaused && document.visibilityState === 'visible';
  };

  /* ========== MOVIMENTO CONTÍNUO VIA requestAnimationFrame ========== */
  const runContinuous = (getSpeed) => {
    const animate = now => {
      if (isMobile && !inViewport) {
        animationFrame = null;
        return;
      }
      const dt = Math.min(now - lastFrame, 40);
      lastFrame = now;
      if (canMove()) {
        const pxPerMs = getSpeed(now) / 1000;
        currentTranslate -= pxPerMs * dt;
        normalizeLoop();
        applyTranslate();
      }
      animationFrame = requestAnimationFrame(animate);
    };

    const resume = () => {
      if (!animationFrame && document.visibilityState === 'visible' && (!isMobile || inViewport)) {
        lastFrame = performance.now();
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isMobile) {
      inViewport = false;
      const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          inViewport = entry.isIntersecting;
          if (inViewport) resume();
          else if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
          }
        });
      }, { threshold: 0.05 });
      carouselObserver.observe(shell);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') resume();
    });

    resume();
  };

  /* ========== MOVIMENTO POR ETAPAS ========== */
  const runSteps = ({ cards, intervalMs, durationMs, dir = direction, pauseMs = 0 }) => {
    const run = () => {
      if (canMove()) moveBy(step() * cards * dir, durationMs);
      if (pauseMs) {
        pauseTimer = setTimeout(() => {
          movementTimer = setTimeout(run, Math.max(0, intervalMs - pauseMs));
        }, pauseMs);
      } else {
        movementTimer = setTimeout(run, intervalMs);
      }
    };
    movementTimer = setTimeout(run, intervalMs);
  };

  const startMovement = () => {
    if (started) return;
    started = true;

    switch (movement.type) {
      case 'continuous-right':
        runContinuous(() => Math.max(1, movement.speed ?? CAROUSEL_SPEED));
        break;
      case 'continuous-left':
        runContinuous(() => -Math.max(1, movement.speed ?? CAROUSEL_SPEED));
        break;
      case 'step':
        runSteps({
          cards: Math.max(1, movement.cardsPerStep ?? 1),
          intervalMs: Math.max(300, movement.intervalMs ?? 3500),
          durationMs: Math.max(150, movement.durationMs ?? 800),
          dir: movement.direction === 'left' ? -1 : 1
        });
        break;
      case 'ping-pong': {
        let pingDir = movement.direction === 'left' ? -1 : 1;
        runSteps({
          cards: Math.max(1, movement.cardsPerStep ?? 1),
          intervalMs: Math.max(300, movement.intervalMs ?? 2800),
          durationMs: Math.max(150, movement.durationMs ?? 1000),
          dir: pingDir
        });
        setInterval(() => { if (!dragging) pingDir *= -1; }, Math.max(300, movement.intervalMs ?? 2800));
        break;
      }
      case 'pause-step':
        runSteps({
          cards: Math.max(1, movement.cardsPerStep ?? 1),
          intervalMs: Math.max(600, movement.intervalMs ?? 5000),
          durationMs: Math.max(150, movement.durationMs ?? 750),
          dir: movement.direction === 'left' ? -1 : 1,
          pauseMs: Math.max(0, movement.pauseMs ?? 1500)
        });
        break;
      case 'fast-slow':
        runContinuous(now => {
          const min = movement.speedMin ?? 10;
          const max = movement.speedMax ?? 45;
          const cycle = Math.max(1000, movement.cycleMs ?? 4000);
          const wave = (Math.sin((now / cycle) * Math.PI * 2) + 1) / 2;
          return (min + (max - min) * wave) * (movement.direction === 'left' ? -1 : 1);
        });
        break;
      case 'random-step': {
        const runRandom = () => {
          if (canMove()) {
            const min = Math.max(1, movement.minCards ?? 1);
            const max = Math.max(min, movement.maxCards ?? 3);
            const cards = Math.floor(Math.random() * (max - min + 1)) + min;
            moveBy(step() * cards * (movement.direction === 'left' ? -1 : 1), movement.durationMs ?? 850);
          }
          movementTimer = setTimeout(runRandom, Math.max(500, movement.intervalMs ?? 3000));
        };
        movementTimer = setTimeout(runRandom, Math.max(500, movement.intervalMs ?? 3000));
        break;
      }
      case 'wave':
        runContinuous(now => {
          const base = Math.max(1, movement.speed ?? 34);
          const wave = 0.45 + 0.55 * ((Math.sin((now / Math.max(1000, movement.waveMs ?? 5200)) * Math.PI * 2) + 1) / 2);
          return base * wave * (movement.direction === 'left' ? -1 : 1);
        });
        break;
      default:
        runContinuous(() => CAROUSEL_SPEED);
    }
  };

  const initLoop = () => {
    measureLoop();
    if (infinite && loopWidth > 0) currentTranslate = -loopWidth;
    applyTranslate();
    bindHoverPause();
    startMovement();
  };

  if (track.scrollWidth > 0) initLoop();
  else requestAnimationFrame(() => { if (track.scrollWidth > 0) initLoop(); else setTimeout(initLoop, 200); });
  setTimeout(() => { if (!started) initLoop(); }, 500);
  setTimeout(() => { if (!started) initLoop(); }, 1200);

  window.addEventListener('resize', () => {
    if (!infinite) return;
    requestAnimationFrame(() => {
      const old = loopWidth;
      measureLoop();
      if (!old && loopWidth) {
        currentTranslate = -loopWidth;
        applyTranslate();
      }
      normalizeLoop();
      applyTranslate();
    });
  }, { passive: true });
}

function renderCarousel(shell, items, label, options = {}) {
  const track = shell.querySelector('.carousel-track');
  const repeated = [...items, ...items, ...items];
  repeated.forEach((video, i) => track.appendChild(card(video, label, i % items.length)));
  setupCarousel(shell, { ...options, infinite: true });
}

// =========================================================
// RENDERIZAÇÃO DOS CARROSSÉIS
// =========================================================

const featuredShell = document.querySelector('[data-carousel="featured"]');
renderCarousel(featuredShell, portfolioVideos.slice(0, 8), 'UGC IA', { movement: CAROUSEL_MOVEMENTS.featured });

Object.entries(categoryConfig).forEach(([key, cfg]) => {
  const category = document.querySelector(`[data-carousel="${key}"]`);
  const shell = category.querySelector('.carousel-shell');
  const items = cfg.indexes.map(i => ({ ...portfolioVideos[i], title: `${cfg.label} ${String(i + 1).padStart(2,'0')}` }));
  renderCarousel(shell, items, cfg.label, { movement: CAROUSEL_MOVEMENTS[key] });
});

/* =========================================================
   FAQ — ACCORDION
   ========================================================= */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          const ob = other.querySelector('.faq-question');
          const oa = other.querySelector('.faq-answer');
          if (ob) ob.setAttribute('aria-expanded', 'false');
          if (oa) oa.style.maxHeight = '0px';
        }
      });
      if (isOpen) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

/* =========================================================
   STATS — ANIMAÇÃO DE CONTAGEM
   ========================================================= */
(function initStatsCounter() {
  const statCards = document.querySelectorAll('.stat-orbit-card[data-count]');
  if (!statCards.length) return;

  const animateCount = (el, target, suffix, duration = 1600) => {
    const start = performance.now();
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutQuart(progress);
      const current = Math.floor(target * eased);
      if (suffix === '%') el.textContent = current + '%';
      else if (suffix === 'h') el.textContent = current + 'h';
      else el.textContent = '+' + current.toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const resetNumber = (el) => {
    let text = '+0';
    if (el.dataset.suffix === '%') text = '0%';
    else if (el.dataset.suffix === 'h') text = '0h';
    el.textContent = text;
  };

  statCards.forEach(card => {
    const el = card.querySelector('.stat-orbit-number');
    if (!el) return;
    let suffix = '';
    if (el.textContent.includes('%')) suffix = '%';
    else if (el.textContent.includes('h')) suffix = 'h';
    el.dataset.suffix = suffix;
  });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const spinObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        statCards.forEach(card => {
          const ring = card.querySelector('.stat-orbit-ring');
          if (ring) ring.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      });
    }, { threshold: 0.1 });
    spinObserver.observe(statsSection);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      const el = card.querySelector('.stat-orbit-number');
      const target = parseInt(card.dataset.count || '0', 10);
      if (!el || isNaN(target)) return;
      if (entry.isIntersecting) {
        if (!el.dataset.animating) {
          el.dataset.animating = 'true';
          animateCount(el, target, el.dataset.suffix || '');
        }
      } else {
        el.dataset.animating = '';
        resetNumber(el);
      }
    });
  }, { threshold: 0.2 });

  statCards.forEach(card => observer.observe(card));
})();
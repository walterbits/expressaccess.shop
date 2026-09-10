/* =========================================================
   CONFIGURAÇÃO DO PORTFÓLIO
   ========================================================= */

const WHATSAPP_NUMBER = '5531971687019';
const WHATSAPP_MESSAGE = 'Olá! Vi seu portfólio e gostaria de falar sobre um criativo.';
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
document.querySelectorAll('[data-whatsapp]').forEach(a => a.href = waUrl);

const portfolioVideos = [
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949685/sample-01.mp4', poster:'', title:'UGC IA 01', subtitle:'Hook + retenção' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949684/sample-02.mp4', poster:'', title:'UGC IA 02', subtitle:'Direct Response' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949691/sample-03.mp4', poster:'', title:'UGC IA 03', subtitle:'Oferta + retenção' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949687/sample-04.mp4', poster:'', title:'UGC IA 04', subtitle:'Hook + prova' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949684/sample-05.mp4', poster:'', title:'UGC IA 05', subtitle:'Ad performance' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949685/sample-06.mp4', poster:'', title:'UGC IA 06', subtitle:'Creative testing' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949684/sample-07.mp4', poster:'', title:'UGC IA 07', subtitle:'UGC + storytelling' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949684/sample-07.mp4', poster:'', title:'UGC IA 08', subtitle:'Oferta direta' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949684/sample-07.mp4', poster:'', title:'UGC IA 09', subtitle:'Social proof' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949686/sample-10.mp4', poster:'', title:'UGC IA 10', subtitle:'Variação de hook' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949686/sample-11.mp4', poster:'', title:'UGC IA 11', subtitle:'Performance' },
  { type:'mp4', src:'https://res.cloudinary.com/uubmrjld/video/upload/v1787949689/sample-12.mp4', poster:'', title:'UGC IA 12', subtitle:'Storytelling' }
];

const categoryConfig = {
  ugc: { label:'UGC IA', subtitle:'UGC com IA', indexes:[0,1,2,3,4,5,6] },
  cinematic: { label:'IA CINEMATOGRÁFICO', subtitle:'Storytelling visual', indexes:[7,8,9,10,11,0,1] },
  reel: { label:'REEL VIRAL', subtitle:'Reel de performance', indexes:[2,4,6,8,10,1,3] },
  hardcopy: { label:'HARD COPY', subtitle:'Criativo direto', indexes:[3,5,7,9,11,2,4] }
};

function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

/* =========================================================
   LAZY CREATION DE MÍDIA (Evita 100+ decodificadores ativos)
   ========================================================= */
function createMediaElement(video) {
  if (video.type === 'vturb') {
    const wrap = document.createElement('div');
    wrap.className = 'vturb-media';
    wrap.dataset.vturbSrc = video.src;
    if (video.poster) wrap.style.backgroundImage = `url("${video.poster}")`;
    const iframe = document.createElement('iframe');
    iframe.dataset.src = video.src;
    iframe.title = video.title || 'Vídeo VTurb';
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.className = 'vturb-frame';
    wrap.appendChild(iframe);
    return wrap;
  }

  const el = document.createElement('video');
  el.preload = 'none'; // Não baixa nada até estar no campo de visão
  el.muted = true;
  el.playsInline = true;
  el.loop = true;
  el.disablePictureInPicture = true;
  el.setAttribute('disablePictureInPicture', '');
  if (video.poster) el.poster = video.poster;
  el.dataset.src = video.src;
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

/* =========================================================
   CONTROLE GLOBAL DE ÁUDIO E OBSERVER DE VÍDEO
   ========================================================= */
let globalAudioActive = false;

function pauseAllVideos() {
  globalAudioActive = false;
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

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target.querySelector('video');
    if (!video) return;

    if (entry.isIntersecting) {
      // Atribui o src sob demanda ao entrar na tela
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
        video.load();
      }
      video.play().catch(() => {});
    } else {
      video.pause();
      video.muted = true;
      entry.target.classList.remove('has-sound');
    }
  });
}, { threshold: 0.1, rootMargin: '100px' });

function wireMp4(cardEl, video) {
  videoObserver.observe(cardEl);

  const ensurePlaying = () => {
    if (!video.src && video.dataset.src) {
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
    ensurePlaying();
    if (video.muted) {
      muteAllExcept(video);
      video.muted = false;
      video.volume = 1;
      cardEl.classList.add('has-sound');
      globalAudioActive = true;
    } else {
      video.muted = true;
      cardEl.classList.remove('has-sound');
      globalAudioActive = false;
    }
  };

  cardEl.addEventListener('mouseenter', () => {
    if (isTouchDevice) return;
    ensurePlaying();
    muteAllExcept(video);
    video.muted = false;
    video.volume = 1;
    cardEl.classList.add('has-sound');
    globalAudioActive = true;
  });

  cardEl.addEventListener('mouseleave', () => {
    if (isTouchDevice) return;
    video.muted = true;
    cardEl.classList.remove('has-sound');
    globalAudioActive = false;
  });

  cardEl.addEventListener('click', (e) => {
    if (e.target.closest('.arrow') || e.target.closest('button')) return;
    if (isTouchDevice) return;
    toggleAudio();
  });

  /* Touch / Mobile tap */
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
   CARROSSEL — RAF INTELIGENTE (PAUSA FORA DO VIEWPORT)
   ========================================================= */

const CAROUSEL_SPEED = isTouchDevice ? 38 : 70;

const CAROUSEL_MOVEMENTS = {
  featured:  { type: 'continuous-right', speed: CAROUSEL_SPEED, pauseOnHover: true },
  ugc:       { type: 'continuous-right', speed: CAROUSEL_SPEED },
  cinematic: { type: 'continuous-left',  speed: CAROUSEL_SPEED },
  reel:      { type: 'continuous-right', speed: CAROUSEL_SPEED },
  hardcopy:  { type: 'continuous-left',  speed: CAROUSEL_SPEED }
};

function setupCarousel(shell, options = {}) {
  const track = shell.querySelector('.carousel-track');
  const prev = shell.querySelector('.prev');
  const next = shell.querySelector('.next');
  const movement = options.movement || { type: 'continuous-right', speed: CAROUSEL_SPEED };

  let dragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let loopWidth = 0;
  let lastFrame = performance.now();
  let animationFrame = null;
  let hoverPaused = false;
  let inViewport = false;
  let started = false;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const step = () => Math.max(track.clientWidth * 0.72, 260);

  const measureLoop = () => {
    const sw = track.scrollWidth;
    if (sw > 0) loopWidth = sw / 3;
  };

  const normalizeLoop = () => {
    if (!loopWidth) return;
    if (currentTranslate > 0) currentTranslate -= loopWidth;
    else if (currentTranslate < -loopWidth * 2) currentTranslate += loopWidth;
  };

  const applyTranslate = () => {
    track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
  };

  const moveBy = (amount, duration = 600) => {
    if (dragging) return;
    const start = currentTranslate;
    const target = currentTranslate - amount;
    const t0 = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const anim = now => {
      if (dragging || hoverPaused || globalAudioActive) return;
      const t = clamp((now - t0) / duration, 0, 1);
      currentTranslate = start + (target - start) * ease(t);
      normalizeLoop();
      applyTranslate();
      if (t < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  };

  prev?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); moveBy(-step(), 500); });
  next?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); moveBy(step(), 500); });

  /* Drag / Arrastar */
  track.addEventListener('pointerdown', e => {
    if (e.target.closest('button') || e.target.closest('iframe')) return;
    dragging = true;
    startX = e.clientX;
    track.classList.add('dragging');
    track.setPointerCapture?.(e.pointerId);
  });

  track.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    currentTranslate += dx * 1.1;
    startX = e.clientX;
    normalizeLoop();
    applyTranslate();
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');
    normalizeLoop();
    applyTranslate();
  };

  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  window.addEventListener('pointerup', endDrag, { passive: true });

  if (options.pauseOnHover !== false) {
    track.querySelectorAll('.video-card').forEach(c => {
      c.addEventListener('mouseenter', () => { hoverPaused = true; });
      c.addEventListener('mouseleave', () => { hoverPaused = false; lastFrame = performance.now(); });
    });
  }

  const canMove = () => inViewport && !dragging && !hoverPaused && !globalAudioActive && document.visibilityState === 'visible';

  const runAnimation = () => {
    const isLeft = movement.type === 'continuous-left';
    const speed = movement.speed ?? CAROUSEL_SPEED;
    const dir = isLeft ? -1 : 1;

    const animate = (now) => {
      if (!inViewport || document.hidden) {
        animationFrame = null;
        return;
      }
      const dt = Math.min(now - lastFrame, 40);
      lastFrame = now;

      if (canMove()) {
        currentTranslate -= (speed / 1000) * dt * dir;
        normalizeLoop();
        applyTranslate();
      }
      animationFrame = requestAnimationFrame(animate);
    };

    const resume = () => {
      if (inViewport && !animationFrame && !document.hidden) {
        lastFrame = performance.now();
        animationFrame = requestAnimationFrame(animate);
      }
    };

    // Só consome ciclos de CPU/GPU quando este carrossel está visível
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        inViewport = entry.isIntersecting;
        if (inViewport) resume();
      });
    }, { rootMargin: '100px' });

    visibilityObserver.observe(shell);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') resume();
    });

    resume();
  };

  const initLoop = () => {
    if (started) return;
    started = true;
    measureLoop();
    if (loopWidth > 0) currentTranslate = -loopWidth;
    applyTranslate();
    runAnimation();
  };

  if (track.scrollWidth > 0) initLoop();
  else requestAnimationFrame(initLoop);

  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      measureLoop();
      normalizeLoop();
      applyTranslate();
    });
  }, { passive: true });
}

function renderCarousel(shell, items, label, options = {}) {
  const track = shell.querySelector('.carousel-track');
  const repeated = [...items, ...items, ...items];
  repeated.forEach((video, i) => track.appendChild(card(video, label, i % items.length)));
  setupCarousel(shell, options);
}

// Inicialização dos carrosséis
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

  const animateCount = (el, target, suffix, duration = 1400) => {
    const start = performance.now();
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const current = Math.floor(target * easeOutQuart(progress));
      if (suffix === '%') el.textContent = current + '%';
      else if (suffix === 'h') el.textContent = current + 'h';
      else el.textContent = '+' + current.toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  statCards.forEach(card => {
    const el = card.querySelector('.stat-orbit-number');
    if (!el) return;
    let suffix = '';
    if (el.textContent.includes('%')) suffix = '%';
    else if (el.textContent.includes('h')) suffix = 'h';
    el.dataset.suffix = suffix;
  });

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
      }
    });
  }, { threshold: 0.2 });

  statCards.forEach(card => observer.observe(card));
})();

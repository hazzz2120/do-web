const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* =========================================================
   LOADER
========================================================= */

const loader = $('#loader');
const loaderPct = $('#loaderPct');

let pct = 0;

const boot = setInterval(() => {
  pct = Math.min(100, pct + Math.floor(Math.random() * 12) + 5);

  if (loaderPct) {
    loaderPct.textContent = pct;
  }

  if (pct >= 100) {
    clearInterval(boot);

    setTimeout(() => {
      if (loader) {
        loader.style.opacity = '0';
      }
    }, 250);

    setTimeout(() => {
      if (loader) {
        loader.remove();
      }
    }, 800);
  }
}, 90);


/* =========================================================
   BACKGROUND PARTICLES / STARS
========================================================= */

const canvas = $('#space');

if (canvas) {
  const ctx = canvas.getContext('2d');

  let W;
  let H;
  let dpr;
  let stars = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = canvas.clientWidth;
    H = canvas.clientHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      a: Math.random() * 0.65 + 0.15,
      s: Math.random() * 0.18 + 0.02
    }));
  }

  resize();

  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      s.y -= s.s;

      if (s.y < -2) {
        s.y = H + 2;
      }

      ctx.globalAlpha =
        s.a * (0.55 + 0.45 * Math.sin(Date.now() / 900 + s.x));

      ctx.fillStyle = '#d8c7ff';

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }

  draw();
}


/* =========================================================
   CUSTOM CURSOR
========================================================= */

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;

let rx = mx;
let ry = my;

const dot = $('#cursorDot');
const ring = $('#cursorRing');
const label = $('#cursorLabel');

window.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;

  if (dot) {
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  }

  if (label) {
    label.style.left = mx + 'px';
    label.style.top = my + 'px';
  }
});

function cursorLoop() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;

  if (ring) {
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }

  requestAnimationFrame(cursorLoop);
}

cursorLoop();


/* Cursor hover effect */

$$('a, button, .tilt, .social-card').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    if (ring) {
      ring.style.width = '58px';
      ring.style.height = '58px';
    }

    if (label) {
      label.style.opacity = '1';
    }
  });

  el.addEventListener('mouseleave', () => {
    if (ring) {
      ring.style.width = '38px';
      ring.style.height = '38px';
    }

    if (label) {
      label.style.opacity = '0';
    }
  });
});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    threshold: 0.12
  }
);

$$('.reveal').forEach((el) => io.observe(el));


/* =========================================================
   SCROLL PROGRESS
========================================================= */

window.addEventListener('scroll', () => {
  const progress = $('#progress');
  const topbar = $('#topbar');

  const h = document.documentElement.scrollHeight - window.innerHeight;

  if (progress && h > 0) {
    progress.style.height = ((window.scrollY / h) * 100) + '%';
  }

  if (topbar) {
    topbar.style.boxShadow =
      window.scrollY > 40
        ? '0 16px 55px rgba(0,0,0,.34)'
        : 'inset 0 1px 0 rgba(255,255,255,.08),var(--shadow)';
  }
});


/* =========================================================
   3D CARD TILT
========================================================= */

$$('.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();

    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    card.style.transform = `
      perspective(900px)
      rotateY(${x * 9}deg)
      rotateX(${y * -9}deg)
      translateY(-4px)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

$$('.magnetic').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();

    const x =
      (e.clientX - (r.left + r.width / 2)) * 0.08;

    const y =
      (e.clientY - (r.top + r.height / 2)) * 0.08;

    el.style.transform = `translate(${x}px, ${y}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});


/* =========================================================
   SKILL SWITCHER
========================================================= */

const skills = {
  web: [
    'WEB',
    'HTML · CSS · JavaScript · UI interaction',
    '94%'
  ],

  design: [
    'DESIGN',
    'Visual systems · Typography · Layout · Figma',
    '89%'
  ],

  motion: [
    'MOTION',
    'Micro-interactions · Transitions · Motion language',
    '86%'
  ],

  photo: [
    'PHOTO',
    'Moodboard · Color · Visual storytelling',
    '82%'
  ],

  content: [
    'CONTENT',
    'Writing · Storytelling · Social media ideas',
    '80%'
  ]
};

$$('.skill-node').forEach((node) => {
  node.addEventListener('click', () => {
    const skill = skills[node.dataset.skill];

    if (!skill) return;

    $$('.skill-node').forEach((x) => {
      x.classList.remove('active');
    });

    node.classList.add('active');

    const title = $('#skillTitle');
    const text = $('#skillText');
    const percent = $('#skillPercent');
    const bar = $('#skillBar');

    if (title) {
      title.textContent = skill[0];
    }

    if (text) {
      text.textContent = skill[1];
    }

    if (percent) {
      percent.textContent = skill[2];
    }

    if (bar) {
      bar.style.width = skill[2];
    }
  });
});


/* =========================================================
   COPY LINK
========================================================= */

$$('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);

      const toast = $('#toast');

      if (toast) {
        toast.classList.add('show');

        setTimeout(() => {
          toast.classList.remove('show');
        }, 1500);
      }
    } catch (error) {
      console.error('Copy failed:', error);
    }
  });
});


/* =========================================================
   MUSIC PLAYER / VISUALIZER
========================================================= */

let playing = false;

const playBtn = $('#playBtn');

if (playBtn) {
  playBtn.addEventListener('click', () => {
    playing = !playing;

    playBtn.textContent = playing ? '❚❚' : '▶';

    $$('.wave i').forEach((bar, index) => {
      bar.style.animation = playing
        ? `bar .7s ease-in-out infinite alternate ${index * -0.08}s`
        : '';
    });
  });
}


/* Dynamic keyframes */

const style = document.createElement('style');

style.textContent = `
@keyframes bar {
  from {
    transform: scaleY(.35);
  }

  to {
    transform: scaleY(1.35);
  }
}
`;

document.head.appendChild(style);


/* =========================================================
   THEME EFFECT TOGGLE
========================================================= */

let alt = false;

const themeBtn = $('#themeBtn');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    alt = !alt;

    document.documentElement.style.setProperty(
      '--purple',
      alt ? '#22d3ee' : '#8b5cf6'
    );

    document.body.style.filter = alt
      ? 'hue-rotate(18deg)'
      : '';
  });
}


/* =========================================================
   SOUND BUTTON
========================================================= */

const soundBtn = $('#soundBtn');

if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    const toast = $('#toast');

    if (!toast) return;

    toast.textContent = 'Sound UI ready · add your audio file';

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      toast.textContent = 'Copied ✓';
    }, 1800);
  });
}


/* =========================================================
   CURRENT YEAR
========================================================= */

const year = $('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}


/* =========================================================
   CLICK RIPPLE
========================================================= */

window.addEventListener('click', (e) => {
  if (!e.target.closest('button, a')) {
    return;
  }

  const ripple = document.createElement('span');

  ripple.className = 'ripple';

  ripple.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    width: 10px;
    height: 10px;
    border: 1px solid rgba(220,190,255,.5);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 90;
    animation: ripple .7s ease-out forwards;
  `;

  document.body.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 700);
});


/* Ripple animation */

const rippleStyle = document.createElement('style');

rippleStyle.textContent = `
@keyframes ripple {
  to {
    width: 110px;
    height: 110px;
    opacity: 0;
  }
}
`;

document.head.appendChild(rippleStyle);
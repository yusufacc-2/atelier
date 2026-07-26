import './style.css';

// ─── PREVENT COPY, CUT, SELECTION & IMAGE DRAG ──────────────
document.addEventListener('copy', (e) => {
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
  }
});

document.addEventListener('cut', (e) => {
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
  }
});

document.addEventListener('selectstart', (e) => {
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
  }
});

document.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

// ─── NAVBAR SCROLL EFFECT ───────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ─── INTERSECTION OBSERVER — SCROLL REVEALS ─────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

// Apply reveal to all relevant elements
const revealSelectors = [
  '.meaning-inner > *',
  '.founders-title',
  '.founders-sub',
  '.edition-card',
  '.engraving-feature-banner',
  '.production-title',
  '.production-time',
  '.packaging-img-wrap',
  '.packaging-content',
  '.value-card',
  '.value-statement-banner',
  '.pricing-card',
  '.pricing-title',
  '.future-title',
  '.future-body',
  '.future-tagline',
  '.reserve-title',
  '.reserve-sub',
  '.reserve-form',
  '.philosophy-image-wrap',
  '.philosophy-content > *',
];

document.querySelectorAll(revealSelectors.join(', ')).forEach((el, i) => {
  el.classList.add('reveal');
  // Stagger siblings
  const siblings = Array.from(el.parentElement?.children || []);
  const idx = siblings.indexOf(el);
  if (idx > 0 && idx < 5) {
    el.classList.add(`reveal-delay-${idx}`);
  }
  revealObserver.observe(el);
});


// ─── PROCESS STEPS — STAGGERED REVEAL ───────────────────────
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const steps = document.querySelectorAll('.process-grid-card');
      steps.forEach((step, i) => {
        setTimeout(() => {
          step.classList.add('visible');
        }, i * 60);
      });
      stepObserver.disconnect();
    }
  });
}, { threshold: 0.1 });

const timeline = document.getElementById('process-timeline');
if (timeline) stepObserver.observe(timeline);


// ─── EDITION CARDS — HOVER INTERACTION ──────────────────────
document.querySelectorAll('.edition-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const bar = card.querySelector('.edition-bar-fill');
    if (bar) bar.style.width = '100%';
  });
  card.addEventListener('mouseleave', () => {
    const bar = card.querySelector('.edition-bar-fill');
    if (bar) bar.style.width = '0%';
  });

  card.addEventListener('click', () => {
    const num = card.querySelector('.edition-number')?.textContent?.trim().split(' ')[0];
    if (num) {
      const select = document.getElementById('reserve-edition');
      if (select) {
        select.value = num;
        select.dispatchEvent(new Event('change'));
      }
      // Smooth scroll to reserve
      document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// ─── LIVE CLOCK IN NAVBAR ────────────────────────────────────
function createNavClock() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  const clockEl = document.createElement('div');
  clockEl.className = 'nav-clock';
  clockEl.id = 'nav-clock';
  navRight.insertAdjacentElement('beforebegin', clockEl);

  function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}:${ss}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

createNavClock();


// ─── ANIMATED GEAR CURSOR TRAIL ─────────────────────────────
function createCursorTrail() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  const trail = [];
  const trailCount = 5;

  for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      width: ${4 + i * 1.5}px;
      height: ${4 + i * 1.5}px;
      border-radius: 50%;
      background: rgba(200, 169, 110, ${0.6 - i * 0.1});
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animateTrail() {
    let lx = mx, ly = my;
    trail.forEach((t, i) => {
      const speed = 0.3 - i * 0.04;
      t.x += (lx - t.x) * speed;
      t.y += (ly - t.y) * speed;
      t.el.style.left = t.x + 'px';
      t.el.style.top = t.y + 'px';
      lx = t.x;
      ly = t.y;
    });
    requestAnimationFrame(animateTrail);
  }

  animateTrail();

  // Hide trail when cursor leaves window
  document.addEventListener('mouseleave', () => {
    trail.forEach(t => t.el.style.opacity = '0');
  });
  document.addEventListener('mouseenter', () => {
    trail.forEach(t => t.el.style.opacity = '1');
  });
}

createCursorTrail();


// ─── ENSURE FULLSCREEN VIDEO AUTOPLAYS ──────────────────────
const heroVideo = document.getElementById('hero-bg-video');
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.play().catch(() => {
    document.addEventListener('click', () => heroVideo.play(), { once: true });
    document.addEventListener('touchstart', () => heroVideo.play(), { once: true });
  });
}

// ─── SHOWCASE VIEW TOGGLE (SIDE-BY-SIDE / FRONT / BACK) ────
const toggleBtns = document.querySelectorAll('.toggle-btn');
const gallery = document.getElementById('showcase-gallery');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');

if (toggleBtns.length && gallery && cardFront && cardBack) {
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (view === 'side-by-side') {
        gallery.style.gridTemplateColumns = '1fr 1fr';
        cardFront.style.display = 'flex';
        cardBack.style.display = 'flex';
      } else if (view === 'front') {
        gallery.style.gridTemplateColumns = '1fr';
        cardFront.style.display = 'flex';
        cardBack.style.display = 'none';
      } else if (view === 'back') {
        gallery.style.gridTemplateColumns = '1fr';
        cardFront.style.display = 'none';
        cardBack.style.display = 'flex';
      }
    });
  });
}


// ─── FOUNDER REGISTRY & AUTOMATIC ALLOCATION STATE ──────────
const REGISTRY_STORAGE_KEY = 'atelier_founder_orders';

function getStoredOrders() {
  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }
}

function updateRegistryUI() {
  const orders = getStoredOrders();
  
  // Render pieces 1 through 9
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(pieceNum => {
    const order = orders.find(o => o.piece === pieceNum);
    const buyerCell = document.getElementById(`buyer-piece-${pieceNum}`);
    const statusCell = document.getElementById(`status-piece-${pieceNum}`);
    const editionCard = document.getElementById(`edition-00${pieceNum}`) || document.getElementById(`edition-0${pieceNum}`);

    if (order) {
      // Claimed
      if (buyerCell) {
        buyerCell.innerHTML = `<span class="claimed-name">${escapeHtml(order.displayName)}</span>`;
      }
      if (statusCell) {
        statusCell.innerHTML = `<span class="badge-status claimed">Reserved</span>`;
      }
      if (editionCard) {
        const statusBadge = editionCard.querySelector('.edition-status');
        const fillBar = editionCard.querySelector('.edition-bar-fill');
        if (statusBadge) {
          statusBadge.textContent = `Claimed (${order.displayName})`;
          statusBadge.className = 'edition-status claimed';
          statusBadge.style.color = 'var(--gold)';
          statusBadge.style.background = 'var(--gold-glow)';
          statusBadge.style.borderColor = 'var(--border-bright)';
        }
        if (fillBar) fillBar.style.width = '100%';
      }
    } else {
      // Open
      if (buyerCell) {
        buyerCell.innerHTML = `<span class="unclaimed">— Unclaimed —</span>`;
      }
      if (statusCell) {
        statusCell.innerHTML = `<span class="badge-status open">Available</span>`;
      }
    }
  });

  // Count & Reset Button
  const countText = document.getElementById('registry-count-text');
  const resetBtn = document.getElementById('btn-reset-demo');
  if (countText) {
    countText.textContent = `${orders.length} of 9 Pieces Claimed`;
  }
  if (resetBtn) {
    resetBtn.style.display = orders.length > 0 ? 'inline-block' : 'none';
  }
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Reset Demo Data Handler
const resetBtn = document.getElementById('btn-reset-demo');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (confirm('Reset all demo orders on the Founder Registry?')) {
      localStorage.removeItem(REGISTRY_STORAGE_KEY);
      location.reload();
    }
  });
}

// Initial UI sync
updateRegistryUI();


// ─── ORDER NOTICE MODAL & FORM CONTROLLER ───────────────────
const form = document.getElementById('reserve-form');
const modal = document.getElementById('reserve-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const successEl = document.getElementById('reserve-success');

let pendingOrderData = null;

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const orders = getStoredOrders();
    if (orders.length >= 9) {
      alert('All 9 Founder\'s Edition pieces have been claimed! The collection is currently sold out.');
      return;
    }

    const name = document.getElementById('reserve-name').value.trim();
    const email = document.getElementById('reserve-email').value.trim();
    const username = document.getElementById('reserve-username').value.trim();
    const isAnonymous = document.getElementById('reserve-anonymous').checked;

    if (!name || !email) {
      if (!name) shakeField('reserve-name');
      if (!email) shakeField('reserve-email');
      return;
    }

    // Determine next chronological piece (1 to 9)
    const nextPiece = orders.length + 1;

    // Determine public display name
    let displayName = 'Anonymous';
    if (!isAnonymous && username) {
      displayName = username.startsWith('@') ? username : `@${username}`;
    } else if (!isAnonymous && name) {
      displayName = name.split(' ')[0] + ' ' + (name.split(' ')[1] ? name.split(' ')[1][0] + '.' : '');
    }

    pendingOrderData = {
      piece: nextPiece,
      name,
      email,
      username,
      isAnonymous,
      displayName,
      message: document.getElementById('reserve-message')?.value.trim() || '',
      timestamp: new Date().toISOString()
    };

    // Populate modal notice details
    const modalPieceEl = document.getElementById('modal-allocated-piece');
    const modalNameEl = document.getElementById('modal-display-name');
    if (modalPieceEl) modalPieceEl.textContent = `Piece ${nextPiece} of 9`;
    if (modalNameEl) modalNameEl.textContent = displayName;

    // Show modal
    openModal();
  });
}

function openModal() {
  if (!modal) return;
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('active'));
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 350);
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

if (modalConfirmBtn) {
  modalConfirmBtn.addEventListener('click', async () => {
    if (!pendingOrderData) return;

    modalConfirmBtn.disabled = true;
    modalConfirmBtn.querySelector('.btn-text').textContent = 'Confirming Order…';

    await delay(1200);

    // Save order
    const orders = getStoredOrders();
    orders.push(pendingOrderData);
    saveOrders(orders);

    // Refresh UI
    updateRegistryUI();

    closeModal();

    // Show success view
    if (form) form.style.display = 'none';
    if (successEl) {
      successEl.style.display = 'block';
      const msg = document.getElementById('success-message-text');
      if (msg) {
        msg.innerHTML = `Your order for <strong>Piece ${pendingOrderData.piece} of 9</strong> has been placed! Check <em>${pendingOrderData.email}</em> for payment instructions. Your allocation is now listed as <strong>${pendingOrderData.displayName}</strong> on the Founder Registry table.`;
      }
    }

    // Celebration particles
    spawnParticles();

    // Scroll smoothly to registry table to show their name
    document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function shakeField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  el.style.borderColor = '#e05555';
  setTimeout(() => {
    el.style.borderColor = '';
  }, 1000);
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function spawnParticles() {
  const section = document.getElementById('reserve');
  if (!section) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 1000;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      background: ${Math.random() > 0.5 ? '#c8a96e' : '#e4c98a'};
      border-radius: 50%;
      left: ${30 + Math.random() * 40}%;
      top: 50%;
      opacity: 1;
      transition: none;
    `;
    document.body.appendChild(p);

    const angle = (Math.random() * Math.PI * 2);
    const speed = 60 + Math.random() * 120;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 80;

    requestAnimationFrame(() => {
      p.style.transition = `all ${0.8 + Math.random() * 0.6}s cubic-bezier(0.16, 1, 0.3, 1)`;
      p.style.transform = `translate(${dx}px, ${dy}px)`;
      p.style.opacity = '0';
    });

    setTimeout(() => p.remove(), 1500);
  }
}


// ─── WATCH FACE SVG SPINNER ──────────────────────────────────
function injectTickingGear() {
  const heroSection = document.querySelector('.hero-scroll-hint');
  if (!heroSection) return;

  const gear = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  gear.setAttribute('width', '16');
  gear.setAttribute('height', '16');
  gear.setAttribute('viewBox', '0 0 24 24');
  gear.setAttribute('fill', 'none');
  gear.style.cssText = 'margin-bottom: 4px; opacity: 0.5;';

  gear.innerHTML = `
    <path d="M12 2L13.5 5.5H10.5L12 2Z" fill="#c8a96e"/>
    <circle cx="12" cy="12" r="4" stroke="#c8a96e" stroke-width="1.5"/>
    <path d="M12 8V4M12 20v-4M8 12H4M20 12h-4M9.17 9.17L6.34 6.34M17.66 17.66l-2.83-2.83M9.17 14.83L6.34 17.66M17.66 6.34l-2.83 2.83" stroke="#c8a96e" stroke-width="1"/>
  `;

  gear.style.animation = 'rotate-ring 8s linear infinite';
  heroSection.insertAdjacentElement('afterbegin', gear);
}

injectTickingGear();


// ─── ADD NAV CLOCK STYLES ────────────────────────────────────
const clockStyle = document.createElement('style');
clockStyle.textContent = `
  .nav-clock {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem;
    font-weight: 300;
    letter-spacing: 0.15em;
    color: rgba(200, 169, 110, 0.7);
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }

  .shake {
    animation: shake 0.4s var(--ease-smooth) !important;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(clockStyle);


// ─── SMOOTH ANCHOR LINKS ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ─── TITLE TYPING EFFECT FOR EDITION CARDS ──────────────────
const editionCards = document.querySelectorAll('.edition-card');
const editionObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    editionCards.forEach((card, i) => {
      setTimeout(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      }, i * 150);
    });
    editionObserver.disconnect();
  }
}, { threshold: 0.3 });

const editionsGrid = document.querySelector('.editions-grid');
if (editionsGrid) editionObserver.observe(editionsGrid);


console.log('%c ATELIER ', 'background:#0d0d0d;color:#c8a96e;font-family:serif;font-size:24px;padding:8px 16px;letter-spacing:8px;border:1px solid #c8a96e;');
console.log('%cFounder\'s Edition // 001 — Crafted by hand. Built with purpose.', 'color:#a09880;font-family:serif;font-size:12px;');

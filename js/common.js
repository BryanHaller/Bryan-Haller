/* =====================================================
   Bryan Haller — JS compartilhado (index.html e sobre.html)
   ===================================================== */

// ---------- Menu hambúrguer ----------
const menuBtn = document.getElementById('menu-btn');
const siteMenu = document.getElementById('site-menu');
if (menuBtn && siteMenu) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    siteMenu.classList.toggle('open');
  });
  siteMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      siteMenu.classList.remove('open');
    });
  });
}

// ---------- Ambient canvas particles: faíscas subindo ----------
// PCOUNT = quantidade de faíscas na tela. Número maior = mais faíscas (mas mais pesado pro celular).
// A velocidade/tamanho de cada faísca é controlada logo abaixo, em makeParticle().
const canvas = document.getElementById('fx-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const particles = [];
  const PCOUNT = reduceMotion ? 0 : (window.innerWidth < 600 ? 55 : 110);

  function makeParticle(){
    return {
      x: Math.random()*W,
      y: H + Math.random()*H*0.3,
      r: 0.4 + Math.random()*0.9,
      speed: 0.6 + Math.random()*1.6,
      drift: (Math.random()-0.5) * 0.5,
      flicker: Math.random()*Math.PI*2,
      flickerSpeed: 0.08 + Math.random()*0.1,
      hue: Math.random() < 0.5 ? [255,150,60] : [255,200,120]
    };
  }
  for(let i=0;i<PCOUNT;i++) particles.push(makeParticle());

  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      const prevX = p.x, prevY = p.y;
      p.y -= p.speed;
      p.x += p.drift + Math.sin(p.y*0.03 + p.flicker)*0.4;
      p.flicker += p.flickerSpeed;
      if(p.y < -10){ Object.assign(p, makeParticle(), { y: H + 10 }); }

      const alpha = 0.4 + Math.max(0, Math.sin(p.flicker))*0.5;
      const [r,g,b] = p.hue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha*0.5})`;
      ctx.lineWidth = p.r * 0.8;
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  if(!reduceMotion) draw();
}

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ---------- Pausar o blob (foto do gelo) durante o scroll, pra não engasgar ----------
const blobEl = document.querySelector('.blob-mask');
if (blobEl) {
  // TEMPO_INICIO_BLOB = quanto tempo (em ms) esperar antes do blob começar a se mexer,
  // pra não competir com a entrada triunfal (labareda + zoom-in dos botões).
  const TEMPO_INICIO_BLOB = 1800;
  setTimeout(() => blobEl.classList.add('blob-active'), TEMPO_INICIO_BLOB);

  let scrollTimer;
  window.addEventListener('scroll', () => {
    blobEl.classList.add('is-scrolling');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => blobEl.classList.remove('is-scrolling'), 400);
  }, { passive: true });
}

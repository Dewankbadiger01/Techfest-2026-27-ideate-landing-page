const $ = s => document.querySelector(s);

// Marquee (duplicated so the loop is seamless)
const marq = ['Robowars','Micromouse','Aeromodelling','Drone League','RoboRacer','Hackathons','Workshops','Lectures','Exhibitions','Technoholix'];
$('#track').innerHTML = [...marq, ...marq].map(t => t + ' <i>✦</i>').join(' ');

// Pillars: [number, title, text, techfest.org path]
const pillars = [
  ['01','Competitions','Hundreds of contests across robotics, aerospace, coding and design.','competitions'],
  ['02','Lectures','Founders, scientists and industry leaders take the stage.','lectures'],
  ['03','Exhibitions','Working prototypes, humanoids and student inventions.','exhibitions'],
  ['04','Workshops','Hands-on, certified learning in AI, cybersecurity, robotics and IoT.','workshops'],
  ['05','Robowars','Steel, sparks and strategy as combat robots meet in the arena.','competitions'],
  ['06','Technoholix','The night arena: music, light and spectacle.','']
];
$('#pill').innerHTML = pillars.map(p => `
  <a class="card rv" href="https://techfest.org/${p[3]}" target="_blank" rel="noopener">
    <div class="num">${p[0]} / 06</div><h3>${p[1]}</h3><p>${p[2]}</p>
    <span class="arr">Discover →</span>
  </a>`).join('');

// Competitions: [filter key, label, name, description]
const comps = [
  ['robo','Robotics','International Robowars','Combat robotics where custom-built bots fight it out.'],
  ['robo','Robotics','International Micromouse','Tiny autonomous robots race to solve a maze.'],
  ['aero','Aero &amp; Drones','Boeing Aeromodelling','Design, build and fly aircraft models against the clock.'],
  ['aero','Aero &amp; Drones','Techfest Drone League','Precision flying and autonomy for drone-lovers.'],
  ['aero','Aero &amp; Drones','International RoboRacer','Autonomous racing with the RoboRacer Foundation.'],
  ['code','Code &amp; AI','Perceptron Hackathon','A flagship AI hackathon with a ₹2 lakh prize pool.']
];
const cEl = $('#comps');
cEl.innerHTML = comps.map(c => `
  <a class="comp rv" data-c="${c[0]}" href="https://techfest.org/competitions" target="_blank" rel="noopener">
    <div class="tag">${c[1]}</div><h3>${c[2]}</h3><p>${c[3]}</p>
    <span class="tag" style="color:var(--gold)">View on techfest.org →</span>
  </a>`).join('');

// Timeline
const tl = [
  ['1998','The first Techfest lights up IIT Bombay, entirely student-run.'],
  ['2018','A Guinness World Record for most LED lights lit simultaneously.'],
  ['2025','29th edition: India’s first International Humanoid Summit.'],
  ['2026','The 30th edition. An Aetherial Renaissance, 16–18 December.']
];
$('#tl').innerHTML = tl.map((e,i) =>
  `<div class="ev${i===3?' now':''}"><b>${e[0]}</b><p>${e[1]}</p></div>`).join('');
// Filter tabs
$('#tabs').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  document.querySelectorAll('#tabs button').forEach(x => x.classList.toggle('on', x === b));
  cEl.querySelectorAll('.comp').forEach(c =>
    c.classList.toggle('hide', b.dataset.f !== 'all' && c.dataset.c !== b.dataset.f));
};

// Drag-to-scroll timeline
const t = $('#tl'); let down = false, sx = 0, sl = 0;
t.onmousedown = e => { down = true; sx = e.pageX; sl = t.scrollLeft; t.style.cursor = 'grabbing'; };
addEventListener('mouseup', () => { down = false; t.style.cursor = 'grab'; });
addEventListener('mousemove', e => { if (down) t.scrollLeft = sl - (e.pageX - sx); });

// Cursor spotlight on cards
document.addEventListener('mousemove', e => {
  const c = e.target.closest && e.target.closest('.card');
  if (c) {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--x', e.clientX - r.left + 'px');
    c.style.setProperty('--y', e.clientY - r.top + 'px');
  }
});
const TARGET = new Date('2026-12-16T09:00:00+05:30');   // IST
function tick() {
  const ms = Math.max(0, TARGET - Date.now()), p = n => String(n).padStart(2, '0');
  $('#d').textContent = p(Math.floor(ms / 864e5));
  $('#h').textContent = p(Math.floor(ms / 36e5) % 24);
  $('#m').textContent = p(Math.floor(ms / 6e4) % 60);
  $('#s').textContent = p(Math.floor(ms / 1e3) % 60);
}
tick(); setInterval(tick, 1000);
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  e.target.querySelectorAll('[data-n]').forEach(el => {
    const n = +el.dataset.n, suffix = el.dataset.s || '', t0 = performance.now();
    (function frame(now) {
      const k = Math.min(1, (now - t0) / 1600);
      el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN') + (k === 1 ? suffix : '');
      if (k < 1) requestAnimationFrame(frame);
    })(t0);
  });
  io.unobserve(e.target);
}), { threshold: .15 });

document.querySelectorAll('.rv').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 80 + 'ms';   // small stagger
  io.observe(el);
});
const cv = $('#aether'), cx = cv.getContext('2d');
let W, H, P = [], mx = -999, my = -999;

function resize() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  P = Array.from({ length: Math.min(90, Math.floor(W * H / 16000)) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3
  }));
}
resize();
addEventListener('resize', resize);
addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

const css = getComputedStyle(document.documentElement);
const GOLD = css.getPropertyValue('--gold').trim();
const AETHER = css.getPropertyValue('--aether').trim();

(function draw() {
  cx.clearRect(0, 0, W, H);
  P.forEach((p, i) => {
    // gentle pull toward the cursor
    const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
    if (d < 200) { p.vx += dx / d * .012; p.vy += dy / d * .012; }
    p.vx *= .99; p.vy *= .99; p.x += p.vx; p.y += p.vy;
    // wrap around edges
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

    cx.globalAlpha = .7; cx.fillStyle = AETHER;
    cx.beginPath(); cx.arc(p.x, p.y, 1.3, 0, 7); cx.fill();

    // connect nearby particles
    for (let j = i + 1; j < P.length; j++) {
      const q = P[j], l = Math.hypot(p.x - q.x, p.y - q.y);
      if (l < 120) {
        cx.globalAlpha = (1 - l / 120) * .25; cx.strokeStyle = GOLD;
        cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke();
      }
    }
  });
  requestAnimationFrame(draw);
})();
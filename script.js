/* Maitrey Vivek Phatak — Portfolio JS
   - Scroll progress
   - Hue shifting background on scroll
   - Reveal animations (IntersectionObserver)
   - Magnetic hover interactions
   - Cursor glow (lerped)
   - Counters in hero card
   GitHub Pages friendly (no deps)
*/

const root = document.documentElement;
const $ = (sel, r = document) => r.querySelector(sel);
const $$ = (sel, r = document) => Array.from(r.querySelectorAll(sel));

/* Theme toggle */
(function themeInit(){
  const saved = localStorage.getItem("theme");
  if(saved) document.documentElement.setAttribute("data-theme", saved);
  const btn = $("#themeBtn");
  if(btn){
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "light" ? "" : "light";
      if(next) document.documentElement.setAttribute("data-theme", next);
      else document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", next || "");
    });
  }
})();

/* Year */
$("#year").textContent = new Date().getFullYear();

/* Reveal */
const io = new IntersectionObserver((entries) => {
  for(const e of entries){
    if(e.isIntersecting){
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

$$(".reveal").forEach(el => io.observe(el));

/* Scroll progress + hue shift + blob parallax */
const progress = $(".progress span");
const b1 = $(".blob.b1"), b2 = $(".blob.b2"), b3 = $(".blob.b3");

let lastY = 0;
function onScroll(){
  const y = window.scrollY || 0;
  const h = document.body.scrollHeight - window.innerHeight;
  const t = h > 0 ? (y / h) : 0;
  if(progress) progress.style.width = `${(t*100).toFixed(2)}%`;

  // Smooth hue sweep as you scroll
  // (range chosen to stay tasteful; increase if you want more dramatic shifts)
  const hue = 205 + t * 120;
  root.style.setProperty("--hue", hue.toFixed(2));

  // Parallax blobs (subtle, but noticeable)
  const p = Math.min(1, y / (window.innerHeight * 2));
  if(b1) { b1.style.setProperty("--x", `${(-40 + y * 0.03)}px`); b1.style.setProperty("--y", `${(-40 + y * 0.02)}px`); }
  if(b2) { b2.style.setProperty("--x", `${(40 - y * 0.025)}px`); b2.style.setProperty("--y", `${(-20 + y * 0.015)}px`); }
  if(b3) { b3.style.setProperty("--x", `${(0 + y * 0.02)}px`); b3.style.setProperty("--y", `${(40 - y * 0.03)}px`); }

  lastY = y;
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Magnetic hover (buttons & link rows) */
function addMagnet(el){
  const strength = parseFloat(el.dataset.magnet || "10");
  let rect = null;

  function enter(){ rect = el.getBoundingClientRect(); el.classList.add("magnet-on"); }
  function leave(){ el.style.transform = ""; el.classList.remove("magnet-on"); rect = null; }
  function move(ev){
    if(!rect) return;
    const x = ev.clientX - rect.left - rect.width/2;
    const y = ev.clientY - rect.top - rect.height/2;
    const dx = (x / rect.width) * strength;
    const dy = (y / rect.height) * strength;
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  }

  el.addEventListener("mouseenter", enter);
  el.addEventListener("mouseleave", leave);
  el.addEventListener("mousemove", move);
}

$$(".magnet").forEach(addMagnet);
$$(".link-row").forEach(addMagnet);

/* Cursor glow (lerp) */
const cursor = $(".cursor");
let mx = window.innerWidth/2, my = window.innerHeight/2;
let cx = mx, cy = my;

window.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
}, { passive:true });

function tick(){
  // Lerp for buttery smoothness
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  if(cursor) cursor.style.transform = `translate3d(${cx - 12}px, ${cy - 12}px, 0)`;
  requestAnimationFrame(tick);
}
tick();

/* Count-up stats (only once when hero card is visible) */
const stats = $$(".num[data-count]");
let counted = false;

function runCounters(){
  if(counted || stats.length === 0) return;
  const heroCard = $(".hero-card");
  if(!heroCard) return;

  const r = heroCard.getBoundingClientRect();
  const vis = r.top < window.innerHeight * 0.85 && r.bottom > 0;
  if(!vis) return;

  counted = true;
  for(const el of stats){
    const target = parseInt(el.dataset.count, 10) || 0;
    const dur = 900 + Math.random() * 600;
    const start = performance.now();
    const from = 0;

    function step(now){
      const t = Math.min(1, (now - start) / dur);
      // Ease out
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(from + (target - from) * eased);
      el.textContent = String(val);
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}
window.addEventListener("scroll", runCounters, { passive:true });
runCounters();

/* Accessibility: reduced motion */
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  // Disable cursor glow and shear animations if user prefers reduced motion
  if(cursor) cursor.style.display = "none";
}

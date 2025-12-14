/* Maitrey Phatak — Portfolio JS
   - Scroll reveal
   - Theme toggle (saved)
   - Mobile drawer
   - Animated project cards + modal
*/

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ===== Data (edit this to add links) ===== */
const projects = [
  {
    title: "Multi-Agent Deal Negotiation Prototype",
    meta: "AutoGen • Docker • CI • Valuation + Antitrust",
    desc:
      "A multi-agent M&A negotiation simulator inspired by Stanford Law’s alpha prototype, extended with Buyer, Seller, and Regulator agents to replicate deal dynamics.",
    bullets: [
      "Implemented valuation models (DCF, comps, synergy sharing) and HHI-based antitrust review.",
      "Negotiation loops with convergence checks to model realistic bargaining.",
      "Containerized with AutoGen orchestration, Docker, and CI testing for reproducible runs."
    ],
    tags: ["Python", "AutoGen", "Docker", "CI", "Valuation", "Antitrust"],
    github: "#",
    live: "#"
  },
  {
    title: "User Data–Based Psyche Modelling",
    meta: "PySpark • SQL • Clustering • Power BI",
    desc:
      "Behavioral persona discovery on the Outbrain Click Prediction dataset, using large-scale interaction logs to identify latent user mindsets.",
    bullets: [
      "Analyzed 38M+ interactions and surfaced personas (planners, novelty-seekers, impulsive users).",
      "Engineered session diversity, recency, and dwell-time features; applied clustering for segmentation.",
      "Built a Power BI dashboard to present insights and refine KPIs with stakeholders."
    ],
    tags: ["PySpark", "SQL", "Clustering", "ETL", "Power BI"],
    github: "#",
    live: "#"
  },
  {
    title: "Microbusiness Inclusivity & Economic Resilience",
    meta: "PCA • Dashboards • Streamlit • Plotly Dash",
    desc:
      "A data-driven framework combining public datasets to measure microbusiness ecosystem inclusivity and regional economic resilience.",
    bullets: [
      "Integrated Venture Forward, ACS, BLS, and FCC Broadband data for ecosystem analysis.",
      "Built composite indexes with PCA + weighted scoring; engineered resilience and inclusivity indicators.",
      "Deployed interactive dashboard (Plotly Dash + Streamlit Cloud) and forecasted future patterns."
    ],
    tags: ["Pandas", "PCA", "Plotly Dash", "Streamlit", "Forecasting"],
    github: "#",
    live: "#"
  }
];

function renderProjects() {
  const grid = $("#projectGrid");
  grid.innerHTML = projects
    .map((p, i) => {
      const tags = p.tags.slice(0, 4).map(t => `<span class="tag">${t}</span>`).join("");
      return `
        <article class="pcard reveal" style="--d:${0.06 + i * 0.06}s" data-i="${i}">
          <div class="phead">
            <div>
              <h3 class="ptitle">${p.title}</h3>
              <div class="pmeta">${p.meta}</div>
            </div>
            <span class="tag">Open</span>
          </div>
          <p class="pdesc">${p.desc}</p>
          <div class="taglist">${tags}</div>
        </article>
      `;
    })
    .join("");

  // Hover spotlight
  $$(".pcard", grid).forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", mx + "%");
      card.style.setProperty("--my", my + "%");
    });
  });

  // Open modal
  $$(".pcard", grid).forEach(card => {
    card.addEventListener("click", () => openModal(Number(card.dataset.i)));
  });
}

function openModal(i) {
  const p = projects[i];
  $("#modalTitle").textContent = p.title;
  $("#modalMeta").textContent = p.meta;
  $("#modalDesc").textContent = p.desc;

  const bullets = p.bullets
    .map(b => `<div class="mb"><span class="mb-dot"></span><div>${b}</div></div>`)
    .join("");
  $("#modalBullets").innerHTML = bullets;

  $("#modalTags").innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join("");

  const git = $("#modalGit");
  const live = $("#modalLive");

  // If you don't have links yet, keep them disabled-looking
  git.href = p.github || "#";
  live.href = p.live || "#";

  if (!p.github || p.github === "#") {
    git.setAttribute("aria-disabled", "true");
    git.style.opacity = ".6";
    git.style.pointerEvents = "none";
  } else {
    git.removeAttribute("aria-disabled");
    git.style.opacity = "1";
    git.style.pointerEvents = "auto";
  }

  if (!p.live || p.live === "#") {
    live.setAttribute("aria-disabled", "true");
    live.style.opacity = ".6";
    live.style.pointerEvents = "none";
  } else {
    live.removeAttribute("aria-disabled");
    live.style.opacity = "1";
    live.style.pointerEvents = "auto";
  }

  const modal = $("#modal");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = $("#modal");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ===== Scroll reveal ===== */
function setupReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  $$(".reveal").forEach((el) => io.observe(el));
}

/* ===== Theme ===== */
function setupTheme() {
  const root = document.documentElement;
  const btn = $("#themeBtn");

  const saved = localStorage.getItem("theme");
  if (saved === "light") root.classList.add("light");

  btn.addEventListener("click", () => {
    root.classList.toggle("light");
    localStorage.setItem("theme", root.classList.contains("light") ? "light" : "dark");
  });
}

/* ===== Drawer ===== */
function setupDrawer() {
  const drawer = $("#drawer");
  const menuBtn = $("#menuBtn");
  const closeBtn = $("#closeDrawer");

  const open = () => {
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  menuBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) close();
  });
  $$(".drawer-link").forEach(a => a.addEventListener("click", close));
}

/* ===== Smooth scroll chips ===== */
function setupChips() {
  $$("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll");
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ===== Misc ===== */
function setupYear() {
  $("#year").textContent = String(new Date().getFullYear());
}

function setupModal() {
  $("#modalClose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#modal").getAttribute("aria-hidden") === "false") closeModal();
  });
}

renderProjects();
setupReveal();
setupTheme();
setupDrawer();
setupChips();
setupYear();
setupModal();

/* ═══════════════════════════════════════════
   Constellation Canvas Background
   ═══════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animationId;

  const CONFIG = {
    particleCount: 80,
    maxDistance: 150,
    particleMinRadius: 1,
    particleMaxRadius: 2.2,
    speed: 0.3,
    mouseRadius: 200,
    baseColor: { r: 99, g: 102, b: 241 },  // indigo
    secondaryColor: { r: 56, g: 189, b: 248 }, // sky blue
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      const useSecondary = Math.random() > 0.7;
      const color = useSecondary ? CONFIG.secondaryColor : CONFIG.baseColor;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed,
        radius: CONFIG.particleMinRadius + Math.random() * (CONFIG.particleMaxRadius - CONFIG.particleMinRadius),
        color: color,
        alpha: 0.2 + Math.random() * 0.5,
      });
    }
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
    ctx.fill();
  }

  function drawLine(p1, p2, dist) {
    const opacity = (1 - dist / CONFIG.maxDistance) * 0.15;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = `rgba(${CONFIG.baseColor.r}, ${CONFIG.baseColor.g}, ${CONFIG.baseColor.b}, ${opacity})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse interaction: gentle repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const mouseDist = Math.sqrt(dx * dx + dy * dy);
      if (mouseDist < CONFIG.mouseRadius) {
        const force = (CONFIG.mouseRadius - mouseDist) / CONFIG.mouseRadius * 0.02;
        p.vx += dx * force;
        p.vy += dy * force;
      }

      // Dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      drawParticle(p);

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
        if (dist < CONFIG.maxDistance) {
          drawLine(p, p2, dist);
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();
  createParticles();
  animate();
})();


/* ═══════════════════════════════════════════
   Scroll Reveal Observer
   ═══════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════
   Render Portfolio
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const data = portfolioData;

  setTimeout(() => {
    app.innerHTML = renderPortfolio(data);
    // kick off scroll animations after DOM is populated
    requestAnimationFrame(() => initScrollReveal());
  }, 400);
});


function renderPortfolio(data) {
  const arrowSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

  const folderSVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;

  return `
    <!-- ═══ Hero ═══ -->
    <header class="hero">
      <div class="reveal">
        <div class="hero-badge">
          <span class="dot"></span> Available for opportunities
        </div>
      </div>
      <h1 class="reveal">${data.personal.name}</h1>
      <p class="hero-title reveal">${data.personal.title}</p>
      <p class="hero-about reveal">${data.personal.about}</p>
      <div class="hero-links reveal">
        <a href="mailto:${data.personal.email}" class="primary-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Get in Touch
        </a>
        <a href="${data.personal.github}" target="_blank" rel="noopener noreferrer" class="ghost-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GitHub
        </a>
        <a href="${data.personal.linkedin}" target="_blank" rel="noopener noreferrer" class="ghost-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
      </div>
    </header>

    <!-- ═══ Experience ═══ -->
    <section>
      <div class="reveal">
        <div class="section-label">Experience</div>
        <h2>Where I've Worked</h2>
      </div>
      <div class="grid reveal-stagger">
        ${data.experience.map(exp => `
          <div class="card reveal">
            <div class="card-top">
              <div>
                <div class="card-role">${exp.role}</div>
                <div class="card-company">${exp.company}</div>
              </div>
              <div class="card-date">${exp.duration}</div>
            </div>
            <p class="card-desc">${exp.description}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- ═══ Projects ═══ -->
    <section>
      <div class="reveal">
        <div class="section-label">Projects</div>
        <h2>Things I've Built</h2>
      </div>
      <div class="projects-grid reveal-stagger">
        ${data.projects.map(proj => `
          <div class="project-card reveal">
            <div class="project-icon">${folderSVG}</div>
            <div class="project-name">${proj.name}</div>
            <p class="project-desc">${proj.description}</p>
            <div class="project-tech">
              ${proj.technologies.map(t => `<span>${t}</span>`).join('')}
            </div>
            <a href="${proj.link}" class="project-link" target="_blank" rel="noopener noreferrer">
              View Project ${arrowSVG}
            </a>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- ═══ Skills ═══ -->
    <section>
      <div class="reveal">
        <div class="section-label">Skills</div>
        <h2>My Toolbox</h2>
      </div>
      <div class="skills-wrap reveal-stagger">
        ${data.skills.map(skill => `
          <div class="skill-pill reveal"><span>${skill}</span></div>
        `).join('')}
      </div>
    </section>

    <!-- ═══ Education ═══ -->
    <section>
      <div class="reveal">
        <div class="section-label">Education</div>
        <h2>Academic Background</h2>
      </div>
      <div class="grid reveal-stagger">
        ${data.education.map(edu => `
          <div class="edu-card reveal">
            <div class="card-top" style="margin-bottom:0;">
              <div>
                <div class="card-role">${edu.degree}</div>
                <div class="card-company">${edu.institution}</div>
              </div>
              <div class="card-date">${edu.duration}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- ═══ Footer ═══ -->
    <footer class="reveal">
      <div class="footer-line">
        Built with <span class="heart">♥</span> by ${data.personal.name}
      </div>
    </footer>
  `;
}

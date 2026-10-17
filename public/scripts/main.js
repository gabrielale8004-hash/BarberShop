/* ============================================
   BarberShop — Interactividad Premium
   ============================================ */

(function () {
  "use strict";

  /* ------------------------------------------
     1. Navbar — Efecto al hacer scroll
     ------------------------------------------ */
  const navbar = document.getElementById("navbar");
  let lastScrollY = window.scrollY;

  function onScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50 && !navbar.classList.contains("scrolled")) {
      navbar.classList.add("scrolled");
    } else if (currentScrollY <= 50 && navbar.classList.contains("scrolled")) {
      navbar.classList.remove("scrolled");
    }
    lastScrollY = currentScrollY;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------
     2. Tilt 3D en tarjetas
     Aplica efecto de inclinación al pasar el
     cursor sobre elementos con .tilt-card
     ------------------------------------------ */
  const tiltCards = document.querySelectorAll(".tilt-card");

  const tiltStrength = 15; // grados máximos de inclinación
  const transitionSpeed = 0.1;

  function handleTiltMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const rotateX = ((mouseY - centerY) / (rect.height / 2)) * tiltStrength;
    const rotateY = -((mouseX - centerX) / (rect.width / 2)) * tiltStrength;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }

  function handleTiltMouseLeave(e) {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
  }

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", handleTiltMouseMove);
    card.addEventListener("mouseleave", handleTiltMouseLeave);
  });

  /* ------------------------------------------
     3. Partículas dinámicas en Hero (Canvas)
     ------------------------------------------ */
  const canvas = document.getElementById("hero-particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? "#d4af37" : "#0a84ff";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(width / 10, 60);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Dibujar líneas de conexión entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = dist < 60 ? "#d4af37" : "#0a84ff";
            ctx.globalAlpha = 0.15 * (1 - dist / 120);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      requestAnimationFrame(animate);
    }

    initParticles();
    animate();
  }

  /* ------------------------------------------
     4. Galería — Filtros interactivos
     ------------------------------------------ */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remover active de todos
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      galleryItems.forEach((item) => {
        const category = item.dataset.category;
        const show = filter === "todos" || category === filter;

        if (show) {
          item.style.display = "block";
          // Pequeño delay para animación de entrada
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 50);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.8)";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });

  /* ------------------------------------------
     5. Botones CTA — Microinteracción de clic
     ------------------------------------------ */
  const ctaButtons = document.querySelectorAll(".button-cta");

  ctaButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Crear ripple effect
      const ripple = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.style.position = "absolute";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(255, 255, 255, 0.4)";
      ripple.style.pointerEvents = "none";
      ripple.style.transform = "scale(0)";
      ripple.style.animation = "ripple 0.6s linear";
      ripple.style.zIndex = "10";

      // Agregar keyframe dinámico si no existe
      if (!document.getElementById("ripple-keyframes")) {
        const style = document.createElement("style");
        style.id = "ripple-keyframes";
        style.textContent = `
          @keyframes ripple {
            to { transform: scale(2.5); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ------------------------------------------
     6. Reveal al hacer scroll (IntersectionObserver)
     ------------------------------------------ */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Aplicar a secciones que deseamos animar
  document.querySelectorAll(".section-header, .service-card, .gallery-item, .feature-item").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 600ms var(--ease-out), transform 600ms var(--ease-out)";
    observer.observe(el);
  });

})();
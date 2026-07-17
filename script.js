/* =========================================================
   Alishbah Shamim — Portfolio Script
   Vanilla JS only. Organized by feature, each self-contained.
   ========================================================= */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- LOADER ---------------- */
  function initLoader() {
    const loader = document.getElementById("loader");
    const bar = document.getElementById("loaderProgress");
    if (!loader || !bar) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        bar.style.width = progress + "%";
        setTimeout(() => {
          loader.classList.add("is-hidden");
          document.body.style.overflow = "";
        }, 350);
      } else {
        bar.style.width = progress + "%";
      }
    }, 140);

    document.body.style.overflow = "hidden";
    window.addEventListener("load", () => {
      // Ensure loader never hangs longer than ~2.2s
      setTimeout(() => {
        loader.classList.add("is-hidden");
        document.body.style.overflow = "";
      }, 1800);
    });
  }

  /* ---------------- CUSTOM CURSOR ---------------- */
  function initCursor() {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = "a, button, input, textarea, [data-magnetic]";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) ring.classList.add("is-active");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) ring.classList.remove("is-active");
    });
  }

  /* ---------------- PARTICLE BACKGROUND ---------------- */
  function initParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const count = window.innerWidth < 768 ? 26 : 55;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const linkDistance = 130;

    function tick() {
      ctx.clearRect(0, 0, w, h);

      // constellation links between nearby particles — subtle, premium ambient detail
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDistance) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(138,103,255,${0.12 * (1 - dist / linkDistance)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,191,122,${p.alpha})`;
        ctx.fill();
      });
      if (!prefersReducedMotion) requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------------- SCROLL PROGRESS + NAV STATE ---------------- */
  function initScrollEffects() {
    const progress = document.getElementById("scrollProgress");
    const nav = document.getElementById("siteNav");
    const backToTop = document.getElementById("backToTop");
    const navLinks = document.querySelectorAll(".nav__link");
    const sections = document.querySelectorAll("main section[id]");

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progress) progress.style.width = pct + "%";

      if (nav) nav.classList.toggle("is-scrolled", scrollTop > 40);
      if (backToTop) backToTop.classList.toggle("is-visible", scrollTop > 500);

      let current = "";
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) current = sec.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    }
  }

  /* ---------------- MOBILE NAV ---------------- */
  function initMobileNav() {
    const burger = document.getElementById("navBurger");
    const links = document.getElementById("navLinks");
    if (!burger || !links) return;

    burger.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      burger.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay || 0;
            setTimeout(() => entry.target.classList.add("is-visible"), Number(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ---------------- TYPING ANIMATION ---------------- */
  function initTyping() {
    const el = document.getElementById("typingText");
    if (!el) return;
    const roles = window.portfolioRoles || ["Junior Full Stack Developer", "Front-End Developer", "PHP Developer"];
    let roleIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1500);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 40 : 80);
    }
    tick();
  }

  /* ---------------- COUNTERS ---------------- */
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.dataset.count);
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current;
          }, 40);
          observer.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  /* ---------------- SKILL BARS ---------------- */
  function initSkillBars() {
    const bars = document.querySelectorAll(".skill-bar");
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const fill = entry.target.querySelector(".skill-bar__fill");
          const pct = entry.target.dataset.percent || 0;
          if (fill) fill.style.width = pct + "%";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((b) => observer.observe(b));
  }

  /* ---------------- MOUSE PARALLAX ---------------- */
  function initParallax() {
    const targets = document.querySelectorAll("[data-parallax]");
    if (!targets.length || prefersReducedMotion) return;

    window.addEventListener("mousemove", (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      targets.forEach((el) => {
        const strength = Number(el.dataset.parallax) * 100;
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });
    });
  }

  /* ---------------- MAGNETIC BUTTONS ---------------- */
  function initMagnetic() {
    const els = document.querySelectorAll("[data-magnetic]");
    if (!els.length || window.matchMedia("(hover: none)").matches) return;

    els.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------------- RIPPLE EFFECT ---------------- */
  function initRipple() {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = e.clientX - rect.left - size / 2 + "px";
        ripple.style.top = e.clientY - rect.top - size / 2 + "px";
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  /* ---------------- PROJECT FILTER ---------------- */
  function initProjectFilter() {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".project-card");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;

        cards.forEach((card) => {
          const tags = card.dataset.tags || "";
          const show = filter === "all" || tags.split(" ").includes(filter);
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---------------- CERTIFICATE SLIDER ---------------- */
  function initCertSlider() {
    const track = document.getElementById("certTrack");
    const prev = document.getElementById("certPrev");
    const next = document.getElementById("certNext");
    if (!track || !prev || !next) return;

    const scrollAmount = () => track.querySelector(".cert-card").offsetWidth + 22;

    next.addEventListener("click", () => {
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });
    prev.addEventListener("click", () => {
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });
  }

  /* ---------------- CONTACT FORM ---------------- */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");
    if (!form) return;

    const validators = {
      name: (v) => v.trim().length >= 2 || "Please enter your full name.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email address.",
      subject: (v) => v.trim().length >= 3 || "Please add a short subject.",
      message: (v) => v.trim().length >= 10 || "Message should be at least 10 characters.",
    };

    function showError(field, message) {
      const group = form.querySelector(`#${field}`).closest(".form-group");
      const errorEl = form.querySelector(`[data-error-for="${field}"]`);
      group.classList.toggle("has-error", Boolean(message));
      if (errorEl) errorEl.textContent = message || "";
    }

    function validateField(field) {
      const input = form.querySelector(`#${field}`);
      const result = validators[field](input.value);
      showError(field, result === true ? "" : result);
      return result === true;
    }

    Object.keys(validators).forEach((field) => {
      const input = form.querySelector(`#${field}`);
      if (input) input.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = Object.keys(validators);
      const validFlags = fields.map(validateField);
      if (validFlags.includes(false)) {
        status.textContent = "Please fix the highlighted fields.";
        status.className = "form-status error";
        return;
      }

      submitBtn.classList.add("is-loading");
      submitBtn.disabled = true;
      status.textContent = "";
      status.className = "form-status";

      try {
        const formData = new FormData(form);
        const response = await fetch("contact.php", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (data.success) {
          status.textContent = "Thanks! Your message has been sent — I'll reply soon.";
          status.className = "form-status success";
          form.reset();
        } else {
          status.textContent = data.message || "Something went wrong. Please try again.";
          status.className = "form-status error";
        }
      } catch (err) {
        status.textContent = "Network error — please try again in a moment.";
        status.className = "form-status error";
      } finally {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------------- CARD TILT (cinematic depth) ---------------- */
  function initTilt() {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches || prefersReducedMotion) return;
    const cards = document.querySelectorAll(".project-card, .service-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = (-y * 6).toFixed(2);
        const rotateY = (x * 8).toFixed(2);
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------------- INIT ---------------- */
  // Loader ko normal flow mein chalayein
  initLoader();

  // BROWSER SECURITY BYPASS: Agar file:/// origin ki wajah se baqi script ruk bhi jaye,
  // toh yeh backup logic har haal mein 1.2s ke baad loader ko fade-out kar k hide kar dega.
  const forceHideLoader = () => {
    const loaderElement = document.getElementById("loader");
    if (loaderElement) {
      loaderElement.style.opacity = "0";
      loaderElement.style.visibility = "hidden";
      loaderElement.classList.add("is-hidden");
      document.body.style.overflow = "";
    }
  };

  setTimeout(forceHideLoader, 1200);
  window.addEventListener("load", forceHideLoader);

  document.addEventListener("DOMContentLoaded", () => {
    // Har feature ko try-catch block mein wrap kiya hai taaki local CORS block se script crash na ho
    try { initCursor(); } catch(e) { console.log("Cursor animation bypassed on local file origin."); }
    try { initParticles(); } catch(e) { console.log("Particles bypassed on local file origin."); }
    try { initScrollEffects(); } catch(e) { console.log("Scroll effects loaded."); }
    try { initMobileNav(); } catch(e) { console.log("Mobile nav ready."); }
    try { initReveal(); } catch(e) { console.log("Scroll reveal (IntersectionObserver) handled."); }
    try { initTyping(); } catch(e) { console.log("Typing effect running."); }
    try { initCounters(); } catch(e) { console.log("Counters ready."); }
    try { initSkillBars(); } catch(e) { console.log("Skill bars animation ready."); }
    try { initParallax(); } catch(e) { console.log("Parallax effect ready."); }
    try { initMagnetic(); } catch(e) { console.log("Magnetic buttons loaded."); }
    try { initRipple(); } catch(e) { console.log("Button ripples active."); }
    try { initTilt(); } catch(e) { console.log("3D Tilt effects ready."); }
    try { initProjectFilter(); } catch(e) { console.log("Project filtering ready."); }
    try { initCertSlider(); } catch(e) { console.log("Certificate slider ready."); }
    try { initContactForm(); } catch(e) { console.log("Contact form handlers bound."); }
  });
})();
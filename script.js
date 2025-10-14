// Reset scroll restoration (avoid jump to previous scroll position on reload)
(function () {
  try {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  } catch (_) {}
  window.scrollTo(0, 0);
  window.addEventListener("load", () => {
    if (window.pageYOffset < 120) window.scrollTo(0, 0);
  });
})();

// Core init tasks (navigation, forms, animations, back-to-top, etc.)
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("no-js");
  document.documentElement.classList.remove("no-js");

  // Mobile navigation toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.classList.toggle(
        "menu-open",
        navMenu.classList.contains("active")
      );
      navMenu.style.height = navMenu.classList.contains("active")
        ? window.innerHeight + "px"
        : "";
      if (navMenu.classList.contains("active")) {
        navMenu.querySelectorAll("a").forEach((link, i) => {
          link.style.opacity = 0;
          link.style.transform = "translateY(12px)";
          link.style.transition =
            "opacity .5s cubic-bezier(.3,.25,.2,1), transform .5s cubic-bezier(.3,.25,.2,1)";
          setTimeout(() => {
            link.style.opacity = 1;
            link.style.transform = "translateY(0)";
          }, 80 + i * 90);
        });
      }
    });
    navMenu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
      })
    );
  }

  // Smooth internal anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href").includes(".html")) return;
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Forms
  setupContactForm(".contact-form");
  setupContactForm(".contact-form-main");

  // Intersection based reveal groups
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".gallery-item, .review-platform, .team-text, .visit-info"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // .reveal elements
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-reveal-delay") || "0ms";
          entry.target.style.transitionDelay = delay;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
  requestAnimationFrame(() => {
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40) {
        const delay = el.getAttribute("data-reveal-delay") || "0ms";
        el.style.transitionDelay = delay;
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
      }
    });
  });

  // data-anim system
  const advancedAnimEls = document.querySelectorAll("[data-anim]");
  if (advancedAnimEls.length) {
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delayAttr = el.getAttribute("data-anim-delay");
            if (delayAttr)
              el.style.setProperty("--anim-delay", delayAttr + "ms");
            requestAnimationFrame(() => el.classList.add("in-view"));
            animObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    advancedAnimEls.forEach((el) => animObserver.observe(el));
  }

  // Initial fade blocks
  const fadeBlocks = document.querySelectorAll(".content-fade");
  if (fadeBlocks.length) {
    setTimeout(() => {
      fadeBlocks.forEach((block) =>
        requestAnimationFrame(() => block.classList.add("show"))
      );
    }, 60);
    setTimeout(() => {
      fadeBlocks.forEach((block) => {
        if (!block.classList.contains("show")) block.classList.add("show");
      });
    }, 2000);
  }

  // Gallery hover effect
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05) translateY(-5px)";
    });
    item.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) translateY(0)";
    });
  });

  // Image fallback / fade-in
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzMwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZGRkJy8+PHRleHQgeD0nNTAlJyB5PSc1MCUnIGR5PScuM2VtJyBmb250LXNpemU9JzE4JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJyBmaWxsPScjOTk5Jz5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPiI";
      this.alt = "Image not available";
    });
    img.addEventListener("load", function () {
      this.style.opacity = "1";
    });
  });

  // CTA scroll to #about
  const ctaBtn = document.querySelector(".cta-button");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", (e) => {
      const aboutSection = document.querySelector("#about");
      if (aboutSection) {
        const offset = aboutSection.offsetTop - 80;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    });
  }

  // Back to top button
  const backBtn = document.querySelector(".back-to-top");
  if (backBtn) {
    const SHOW_AFTER = 300;
    const updateVisibility = () => {
      if (window.pageYOffset > SHOW_AFTER) backBtn.classList.add("visible");
      else backBtn.classList.remove("visible");
    };
    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
// Contact Form Handling (kept outside main DOMContentLoaded for clarity)
function setupContactForm(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;
  if (form.hasAttribute("data-external") && form.hasAttribute("data-inline")) {
    // Lightweight anti-bot state for this form
    let startedAt = Date.now();
    let userInteracted = false;
    const markHuman = () => {
      userInteracted = true;
      const humanField = form.querySelector('input[name="_human"]');
      if (humanField) humanField.value = "1";
    };
    form.addEventListener("input", markHuman);
    form.addEventListener("keydown", markHuman);

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      // Anti-bot checks
      const honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value && honey.value.trim() !== "") {
        // Honeypot filled -> likely bot
        return;
      }
      const elapsed = Date.now() - startedAt;
      if (elapsed < 800 || !userInteracted) {
        alert("Please fill the form before submitting.");
        return;
      }

      const submitBtn = form.querySelector(".submit-button, .submit-btn");
      const original = submitBtn ? submitBtn.textContent : "";
      let restoreTextTimer;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = original;
        submitBtn.classList.add("is-loading");
        submitBtn.textContent = "Sending...";
        // If server is slow, update message after 5s
        restoreTextTimer = setTimeout(() => {
          if (submitBtn && submitBtn.disabled) {
            submitBtn.textContent = "Still sending...";
          }
        }, 5000);
      }
      const formData = new FormData(form);
      formData.delete("_next");
      // Basic validation here as well (AJAX path)
      const email = formData.get("email");
      const message = (formData.get("message") || "").toString().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-loading");
          submitBtn.textContent = original;
          if (restoreTextTimer) clearTimeout(restoreTextTimer);
        }
        alert("Please enter a valid email address.");
        return;
      }
      if (message.length < 8) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-loading");
          submitBtn.textContent = original;
          if (restoreTextTimer) clearTimeout(restoreTextTimer);
        }
        alert("Please write a longer message.");
        return;
      }
      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
        if (!res.ok) {
          throw new Error("Request failed");
        }
        alert("Thank you for your message!");
        form.reset();
        // Reset anti-bot state
        startedAt = Date.now();
        userInteracted = false;
      } catch (err) {
        alert("Submission failed. Please try again.");
        console.error(err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-loading");
          submitBtn.textContent = original;
          if (restoreTextTimer) clearTimeout(restoreTextTimer);
        }
      }
    });
    return;
  }
  if (form.hasAttribute("data-external")) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const hasName = (firstName && lastName) || name;
    if (!hasName || !email) {
      alert("Please fill in all required fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const submitButton = this.querySelector(".submit-button, .submit-btn");
    const originalText = submitButton.textContent;
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    setTimeout(() => {
      alert("Thank you for your message! We'll get back to you shortly.");
      this.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  });
}
// Header hide / show on scroll
(function () {
  const headerEl = document.querySelector(".header");
  if (!headerEl) return;

  let lastScroll = window.pageYOffset;
  let lastShowScroll = 0;
  const navHeight = headerEl.offsetHeight;
  const MIN_DELTA = 5;
  const HIDE_DISTANCE = 120;

  function showHeader() {
    if (headerEl.classList.contains("hidden")) {
      headerEl.classList.remove("hidden");
    }
    lastShowScroll = window.pageYOffset;
  }

  function hideHeader() {
    if (!headerEl.classList.contains("hidden")) {
      headerEl.classList.add("hidden");
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      const current = window.pageYOffset || 0;
      const delta = current - lastScroll;

      if (current <= navHeight) {
        showHeader();
        headerEl.classList.remove("scrolled");
        lastScroll = current;
        return;
      }
      if (delta < -MIN_DELTA) {
        showHeader();
        if (!headerEl.classList.contains("scrolled"))
          headerEl.classList.add("scrolled");
      } else if (delta > MIN_DELTA) {
        if (current - lastShowScroll > HIDE_DISTANCE) {
          hideHeader();
        }
        if (
          !headerEl.classList.contains("hidden") &&
          !headerEl.classList.contains("scrolled")
        ) {
          headerEl.classList.add("scrolled");
        }
      }

      if (current > navHeight + 10) {
        if (!headerEl.classList.contains("scrolled"))
          headerEl.classList.add("scrolled");
      } else {
        headerEl.classList.remove("scrolled");
      }

      lastScroll = current;
    },
    { passive: true }
  );
})();

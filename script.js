// Prevence nechtěného posunu po refreshi / reloadu
(function () {
  try {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  } catch (e) {}
  // Okamžitě na vršek (pro případ, že by prohlížeč i tak zkusil obnovit)
  window.scrollTo(0, 0);
  // Ještě jednou po kompletním načtení zdrojů (obrázky / font swap)
  window.addEventListener("load", () => {
    // Pokud je posun malý (např. kvůli načtení fontu), zarovnáme zpět
    if (window.pageYOffset < 120) {
      window.scrollTo(0, 0);
    }
  });
})();

// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
});

// Smooth Scrolling for Navigation Links (only for internal links)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    // Don't prevent default for external links
    if (this.getAttribute("href").includes(".html")) {
      return;
    }

    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Contact Form Handling
function setupContactForm(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Basic validation - check for either firstName/lastName or name
    const hasName = (firstName && lastName) || name;
    if (!hasName || !email) {
      alert("Prosím vyplňte všechna povinná pole.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Prosím zadejte platnou emailovou adresu.");
      return;
    }

    // Simulate form submission
    const submitButton = this.querySelector(".submit-button, .submit-btn");
    const originalText = submitButton.textContent;
    submitButton.textContent = "Odesílám...";
    submitButton.disabled = true;

    setTimeout(() => {
      alert("Děkujeme za vaši zprávu! Ozveme se vám co nejdříve.");
      this.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  });
}

// Setup forms for both pages
document.addEventListener("DOMContentLoaded", function () {
  setupContactForm(".contact-form");
  setupContactForm(".contact-form-main");
  document.body.classList.remove("no-js");
  document.documentElement.classList.remove("no-js");
});

// Scroll Animation for Elements
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Add animation classes to elements
document.addEventListener("DOMContentLoaded", function () {
  const animatedElements = document.querySelectorAll(
    ".gallery-item, .review-platform, .team-text, .visit-info"
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // New generic reveal elements (contact page etc.)
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

  // Nový systém animací přes data-anim
  const advancedAnimEls = document.querySelectorAll("[data-anim]");
  if (advancedAnimEls.length) {
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delayAttr = el.getAttribute("data-anim-delay");
            if (delayAttr) {
              el.style.setProperty("--anim-delay", delayAttr + "ms");
            }
            requestAnimationFrame(() => {
              el.classList.add("in-view");
            });
            animObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );

    advancedAnimEls.forEach((el) => animObserver.observe(el));
  }

  // Vstupní jemný fade všech bloků s class="content-fade"
  const fadeBlocks = document.querySelectorAll(".content-fade");
  if (fadeBlocks.length) {
    // Malé zpoždění aby header už byl ustálený
    setTimeout(() => {
      fadeBlocks.forEach((block) => {
        requestAnimationFrame(() => block.classList.add("show"));
      });
    }, 60); // cca 1 frame + mírná prodleva

    // Záchranný fallback – pokud by z nějakého důvodu .show nebylo přidáno (např. blok zobrazen pozdě), přidej po 2s.
    setTimeout(() => {
      fadeBlocks.forEach((block) => {
        if (!block.classList.contains("show")) {
          block.classList.add("show");
        }
      });
    }, 2000);
  }
});

// (Odstraněno) translateZ hack na body kvůli problémům s position:fixed u headeru

// Gallery Image Hover Effects
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.05) translateY(-5px)";
  });

  item.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1) translateY(0)";
  });
});

// Header Background Change on Scroll
// window.addEventListener("scroll", function () {
//   const header = document.querySelector(".header");
//   const scrollTop = window.pageYOffset;

//   if (scrollTop > 50) {
//     header.style.backgroundColor = "rgba(139, 111, 71, 0.95)";
//     header.style.backdropFilter = "blur(10px)";
//   } else {
//     header.style.backgroundColor = "#8B6F47";
//     header.style.backdropFilter = "none";
//   }
// });

// Image Lazy Loading Fallback
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    // Add error handling for missing images
    img.addEventListener("error", function () {
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk9icsOhemVrIG5lbsOtIGs8L3RleHQ+PC9zdmc+";
      this.alt = "Obrázek není k dispozici";
    });

    // Add loading effect
    img.addEventListener("load", function () {
      this.style.opacity = "1";
    });
  });
});

// Read More Button Functionality
// CTA scroll (jen pokud tlačítko existuje na stránce)
const ctaBtn = document.querySelector(".cta-button");
if (ctaBtn) {
  ctaBtn.addEventListener("click", function (e) {
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      const headerOffset = 80;
      const elementPosition = aboutSection.offsetTop;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(function () {
  const header = document.querySelector(".header");
  const scrollTop = window.pageYOffset;

  // if (scrollTop > 50) {
  //   header.style.backgroundColor = "rgba(139, 111, 71, 0.95)";
  //   header.style.backdropFilter = "blur(10px)";
  // } else {
  //   header.style.backgroundColor = "#8B6F47";
  //   header.style.backdropFilter = "none";
  // }
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

// Social Media Links (placeholder functionality)
document.querySelectorAll(".social-links a").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Sociální síť bude brzy dostupná!");
  });
});

// Jednodušší a citlivější logika skrývání headeru (inspirováno chováním referenčního webu)
(function () {
  const headerEl = document.querySelector(".header");
  if (!headerEl) return;

  let lastScroll = window.pageYOffset;
  let lastShowScroll = 0; // pozice, kde byl header naposledy zobrazen
  const navHeight = headerEl.offsetHeight;
  const MIN_DELTA = 5; // ignorujeme mikro pohyby
  const HIDE_DISTANCE = 120; // kolik musí uživatel celkem sjet (od posledního zobrazení) aby se schoval (lehce sníženo)

  function showHeader() {
    if (headerEl.classList.contains("hidden")) {
      headerEl.classList.remove("hidden");
    }
    lastShowScroll = window.pageYOffset;
    // console.debug('[HEADER] show at', lastShowScroll);
  }

  function hideHeader() {
    if (!headerEl.classList.contains("hidden")) {
      headerEl.classList.add("hidden");
      // console.debug('[HEADER] hide at', window.pageYOffset);
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      const current = window.pageYOffset || 0;
      const delta = current - lastScroll;

      // Vždy viditelný nahoře
      if (current <= navHeight) {
        showHeader();
        headerEl.classList.remove("scrolled");
        lastScroll = current;
        return;
      }

      // Scroll nahoru → okamžitě ukážeme (pocit kontroly)
      if (delta < -MIN_DELTA) {
        showHeader();
        if (!headerEl.classList.contains("scrolled"))
          headerEl.classList.add("scrolled");
      }
      // Scroll dolů → schovej až když od posledního zobrazení ujel dost
      else if (delta > MIN_DELTA) {
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

      // Přidej / odeber .scrolled pro vizuální styl (např. blur, stín) při sjetí stránky
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

// Parallax efekt pro elementy s data-parallax
(function(){
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if(!parallaxEls.length) return;
  // Respektuj prefer-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Na velmi malých zařízeních vypneme (často malá výška a může působit trhaně)
  const isSmall = window.innerWidth < 600;
  if (isSmall) return;

  const meta = parallaxEls.map(el => ({
    el,
    speed: parseFloat(el.getAttribute('data-parallax-speed')) || 0.25,
    baseY: 0
  }));

  let ticking = false;

  function update(){
    const scrollY = window.pageYOffset || 0;
    meta.forEach(item => {
      // Jednoduchý model: posun úměrný scrollu, ale mírně ztlumený
      const translate = Math.round(scrollY * item.speed);
      // Limit pro přehnaný posun (např. u dlouhých scrollů)
      const limited = Math.max(-200, Math.min(translate, 400));
      item.el.style.transform = `translateY(${limited}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    // Pokud výrazně zmenší šířku → vypneme parallax resetem
    if(window.innerWidth < 600){
      meta.forEach(item => item.el.style.transform = '');
    } else {
      update();
    }
  });

  update();
})();

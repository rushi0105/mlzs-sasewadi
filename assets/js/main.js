/* ==========================================================================
   Mount Litera Zee School, Sasewadi
   Interaction layer: navigation, reveals, enquiry form, gallery lightbox.
   No dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     Header state
     A 1px sentinel sits above the sticky header. When it leaves the viewport
     the header earns its hairline. Uses IntersectionObserver, so there is no
     scroll listener doing layout work on every frame.
     ---------------------------------------------------------------------- */

  var header = document.querySelector(".site-header");
  var sentinel = document.querySelector(".header-sentinel");

  if (header && sentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
      },
      { threshold: 0 }
    ).observe(sentinel);
  }

  /* ------------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */

  var nav = document.getElementById("site-nav");
  var navToggle = document.querySelector(".nav-toggle");
  var desktop = window.matchMedia("(min-width: 901px)");
  var navOpen = false;

  function navFocusables() {
    if (!nav || !navToggle) return [];
    var nodes = [navToggle].concat(
      Array.prototype.slice.call(nav.querySelectorAll("a[href]"))
    );
    return nodes.filter(function (el) {
      return el.getClientRects().length > 0 && el.tabIndex !== -1;
    });
  }

  function openNav() {
    if (!nav || !navToggle || navOpen) return;
    navOpen = true;
    nav.classList.add("is-open");
    document.body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    var first = nav.querySelector("a[href]");
    if (first) window.requestAnimationFrame(function () { first.focus(); });
  }

  function closeNav(returnFocus) {
    if (!nav || !navToggle || !navOpen) return;
    navOpen = false;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    if (returnFocus !== false) navToggle.focus();
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      if (navOpen) closeNav();
      else openNav();
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a[href]") && !desktop.matches) closeNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (!navOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeNav(true);
        return;
      }

      if (event.key === "Tab") {
        var items = navFocusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    var onBreakpoint = function (event) {
      if (event.matches) closeNav(false);
    };

    if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);
  }

  /* ------------------------------------------------------------------------
     Hero carousel
     Three photographs, one headline. Advances every seven seconds, stops
     when the visitor takes over, and does nothing at all under reduced
     motion preferences.
     ---------------------------------------------------------------------- */

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero__slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var heroIndex = 0;
    var heroTimer = null;
    var heroPaused = false;

    var showSlide = function (next) {
      if (!slides.length) return;
      heroIndex = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var active = i === heroIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach(function (dot, i) {
        var active = i === heroIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    };

    var stopHero = function () {
      if (heroTimer) {
        window.clearInterval(heroTimer);
        heroTimer = null;
      }
    };

    var startHero = function () {
      stopHero();
      if (reduceMotion || slides.length < 2) return;
      heroTimer = window.setInterval(function () {
        if (!heroPaused && !document.hidden) showSlide(heroIndex + 1);
      }, 7000);
    };

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
        startHero();
      });
    });

    hero.querySelectorAll("[data-hero-move]").forEach(function (button) {
      button.addEventListener("click", function () {
        var step = button.getAttribute("data-hero-move") === "next" ? 1 : -1;
        showSlide(heroIndex + step);
        startHero();
      });
    });

    hero.addEventListener("pointerenter", function () { heroPaused = true; });
    hero.addEventListener("pointerleave", function () { heroPaused = false; });
    hero.addEventListener("focusin", function () { heroPaused = true; });
    hero.addEventListener("focusout", function () { heroPaused = false; });

    showSlide(0);
    startHero();

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) return;
      heroPaused = true;
    });
  }

  /* ------------------------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------------------- */

  var revealNodes = document.querySelectorAll(".reveal");

  if (revealNodes.length) {
    if (!("IntersectionObserver" in window) || reduceMotion) {
      revealNodes.forEach(function (node) { node.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );

      revealNodes.forEach(function (node) { revealObserver.observe(node); });
    }
  }

  /* ------------------------------------------------------------------------
     Deep links into an accordion
     Home page programme links point at #primary and friends, so open the
     matching stage before the browser settles on it.
     ---------------------------------------------------------------------- */

  if (window.location.hash) {
    try {
      var hashTarget = document.querySelector(window.location.hash);
      if (hashTarget && hashTarget.tagName === "DETAILS") hashTarget.open = true;
    } catch (error) {
      /* An invalid hash is not worth breaking the page for. */
    }
  }

  /* ------------------------------------------------------------------------
     Current year
     ---------------------------------------------------------------------- */

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------------------
     Gallery lightbox
     Any button with data-lightbox="path.jpg" opens the shared dialog.
     ---------------------------------------------------------------------- */

  var lightbox = document.getElementById("lightbox");

  if (lightbox && typeof lightbox.showModal === "function") {
    var lightboxImage = lightbox.querySelector("img");
    var lastTrigger = null;

    document.querySelectorAll("[data-lightbox]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var source = trigger.querySelector("img");
        if (!lightboxImage) return;
        lightboxImage.src = trigger.getAttribute("data-lightbox");
        lightboxImage.alt = source ? source.alt : "";
        lastTrigger = trigger;
        lightbox.showModal();
      });
    });

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener("close", function () {
      if (lastTrigger) lastTrigger.focus();
      lastTrigger = null;
    });
  }

  /* ------------------------------------------------------------------------
     Enquiry form
     The site has no server, so a valid enquiry becomes a prefilled WhatsApp
     message to the school office. Swap data-endpoint in the form for a real
     POST endpoint if one becomes available (see README).
     ---------------------------------------------------------------------- */

  var forms = document.querySelectorAll("[data-enquiry-form]");

  forms.forEach(function (form) {
    var nameInput = form.querySelector("[name='name']");
    var phoneInput = form.querySelector("[name='phone']");
    var childInput = form.querySelector("[name='child']");
    var gradeInput = form.querySelector("[name='grade']");
    var messageInput = form.querySelector("[name='message']");
    var consentInput = form.querySelector("[name='consent']");
    var status = form.querySelector(".form-status");
    var phoneDisplay = "077439 32164";

    function fieldOf(input) {
      return input ? input.closest(".field, .check") : null;
    }

    function showError(input, message) {
      var holder = fieldOf(input);
      if (holder) {
        holder.classList.add("has-error");
        var error = holder.querySelector(".field__error");
        if (error && message) error.textContent = message;
      }
      if (input) input.setAttribute("aria-invalid", "true");
    }

    function clearError(input) {
      var holder = fieldOf(input);
      if (holder) holder.classList.remove("has-error");
      if (input) input.removeAttribute("aria-invalid");
    }

    function validPhone(value) {
      var digits = value.replace(/[^\d]/g, "");
      if (digits.length === 12 && digits.indexOf("91") === 0) digits = digits.slice(2);
      return /^[6-9]\d{9}$/.test(digits);
    }

    [nameInput, phoneInput, gradeInput, consentInput].forEach(function (input) {
      if (!input) return;
      var eventName = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";
      input.addEventListener(eventName, function () { clearError(input); });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var valid = true;
      var firstInvalid = null;

      if (!nameInput || nameInput.value.trim().length < 2) {
        showError(nameInput, "Please enter the parent or guardian name.");
        valid = false;
        firstInvalid = firstInvalid || nameInput;
      }

      if (!phoneInput || !validPhone(phoneInput.value)) {
        showError(phoneInput, "Please enter a 10 digit mobile number.");
        valid = false;
        firstInvalid = firstInvalid || phoneInput;
      }

      if (gradeInput && !gradeInput.value) {
        showError(gradeInput, "Please choose a class group.");
        valid = false;
        firstInvalid = firstInvalid || gradeInput;
      }

      if (messageInput && messageInput.hasAttribute("required") && !messageInput.value.trim()) {
        showError(messageInput, "Please write a short message.");
        valid = false;
        firstInvalid = firstInvalid || messageInput;
      }

      if (!consentInput || !consentInput.checked) {
        showError(consentInput, "Please confirm that we may contact you.");
        valid = false;
        firstInvalid = firstInvalid || consentInput;
      }

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var lines = [
        form.getAttribute("data-subject") || "Website enquiry",
        "",
        "Parent: " + nameInput.value.trim(),
        "Phone: " + phoneInput.value.trim()
      ];

      if (childInput && childInput.value.trim()) {
        lines.push("Child: " + childInput.value.trim());
      }

      if (gradeInput && gradeInput.value) {
        lines.push("Class group: " + gradeInput.value);
      }

      if (messageInput && messageInput.value.trim()) {
        lines.push("Note: " + messageInput.value.trim());
      }

      lines.push("", "Sent from the school website.");

      var url = "https://wa.me/917743932164?text=" + encodeURIComponent(lines.join("\n"));
      var opened = window.open(url, "_blank", "noopener");

      if (status) {
        status.innerHTML =
          "Your enquiry is ready in WhatsApp. If a new tab did not open, " +
          '<a href="' + url + '" target="_blank" rel="noopener">open the message here</a> ' +
          "or call <a href=\"tel:+917743932164\">" + phoneDisplay + "</a>.";
        status.classList.add("is-visible");
      }

      if (!opened && status) status.focus && status.focus();
    });
  });
})();

/* ==========================================================================
   Linda Lebanese Restaurant — script.js
   Plain ("vanilla") JavaScript. No libraries.

   Sections:
   1. Mobile navigation
   2. Active navigation link while scrolling
   3. Reveal-on-scroll animations
   4. Dish details modal
   5. Contact form validation (demo only — nothing is sent)
   6. Optional custom cedar cursor
   7. Footer year
   ========================================================================== */

(function () {
  "use strict";

  // Lets style.css hide .reveal elements for the entrance animation.
  // (Removed again by a safety timer in index.html if this file fails to load.)
  document.documentElement.classList.add("js");
  window.__lindaReady = true;

  /* ------------------------------------------------------------------
     1. Mobile navigation
     ------------------------------------------------------------------ */
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  function setMenu(open) {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    primaryNav.classList.toggle("is-open", open);
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });

    // Close the menu after choosing a section
    primaryNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    // Close on Escape and give focus back to the button
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        navToggle.focus();
      }
    });

    // Close when clicking outside the header
    document.addEventListener("click", function (event) {
      const clickedInsideHeader = event.target.closest(".site-header");
      if (!clickedInsideHeader) setMenu(false);
    });

    // If the window grows to desktop size, drop the mobile panel state
    window.matchMedia("(min-width: 900px)").addEventListener("change", function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     2. Active navigation link while scrolling
     ------------------------------------------------------------------ */
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  function highlightNav() {
    const line = window.scrollY + window.innerHeight * 0.32;

    let currentId = sections.length ? sections[0].id : "";
    sections.forEach(function (section) {
      if (section.offsetTop <= line) currentId = section.id;
    });

    // At the very bottom, make sure "Contact" is the active item
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      currentId = sections[sections.length - 1].id;
    }

    navLinks.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + currentId;
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (sections.length && navLinks.length) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          highlightNav();
          ticking = false;
        });
      },
      { passive: true }
    );
    highlightNav();
  }

  /* ------------------------------------------------------------------
     3. Reveal-on-scroll animations
     ------------------------------------------------------------------ */
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach(function (item) {
      // Anything already on screen (hero) appears right away
      if (item.getBoundingClientRect().top < window.innerHeight * 0.9) {
        item.classList.add("is-visible");
      }
      revealObserver.observe(item);
    });
  } else {
    // No observer or reduced motion: show everything immediately
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ------------------------------------------------------------------
     4. Dish details modal
     ------------------------------------------------------------------ */
  const modal = document.getElementById("dish-modal");

  if (modal && typeof modal.showModal === "function") {
    const modalImg = document.getElementById("dish-modal-img");
    const modalTitle = document.getElementById("dish-modal-title");
    const modalPrice = document.getElementById("dish-modal-price");
    const modalDesc = document.getElementById("dish-modal-desc");
    const closeButton = document.getElementById("modal-close");
    const backButton = document.getElementById("modal-back");
    const askButton = document.getElementById("modal-ask");

    let lastFocused = null;
    let currentDish = "";

    function openDish(card, trigger) {
      const name = card.dataset.name || "";
      const price = card.dataset.price || "";
      const description = card.dataset.desc || "";
      const image = card.dataset.img || "";

      currentDish = price ? name + " (" + price + ")" : name;
      modalTitle.textContent = name;
      modalPrice.textContent = price;
      modalDesc.textContent = description;
      modalImg.src = image;
      modalImg.alt = name;

      lastFocused = trigger || document.activeElement;
      modal.showModal();
      document.body.classList.add("modal-open");
      closeButton.focus();
    }

    function closeDish() {
      if (modal.open) modal.close();
    }

    document.querySelectorAll(".dish-card").forEach(function (card) {
      // The whole card is clickable; the "View details" button is the
      // keyboard- and screen-reader-friendly way to trigger the same modal.
      card.addEventListener("click", function () {
        openDish(card, card.querySelector(".dish-open"));
      });
    });

    closeButton.addEventListener("click", closeDish);
    backButton.addEventListener("click", closeDish);

    // Click on the backdrop (the dialog itself, outside the panel) closes it
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeDish();
    });

    // Native <dialog> handles Escape; this keeps the body class in sync
    modal.addEventListener("close", function () {
      document.body.classList.remove("modal-open");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    });

    // "Ask about this dish" → close, pre-fill the contact form, scroll there
    askButton.addEventListener("click", function () {
      closeDish();

      const messageField = document.getElementById("message");
      if (!messageField) return;

      messageField.value =
        "Hello Linda Restaurant, I would like to know more about " + currentDish + " from your menu.";
      messageField.dispatchEvent(new Event("input", { bubbles: true }));

      document.getElementById("contact").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(function () {
        messageField.focus({ preventScroll: true });
      }, 500);
    });
  }

  /* ------------------------------------------------------------------
     5. Contact form validation
     ------------------------------------------------------------------ */
  const form = document.getElementById("contact-form");

  if (form) {
    const status = document.getElementById("form-status");

    const fields = [
      {
        input: document.getElementById("name"),
        test: function (value) {
          if (value.trim().length === 0) return "Please enter your full name.";
          if (value.trim().length < 2) return "Your name needs at least 2 characters.";
          return "";
        },
      },
      {
        input: document.getElementById("email"),
        test: function (value) {
          const trimmed = value.trim();
          if (trimmed.length === 0) return "Please enter your email address.";
          if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
            return "Please enter a valid email, like name@example.com.";
          }
          return "";
        },
      },
      {
        input: document.getElementById("message"),
        test: function (value) {
          if (value.trim().length === 0) return "Please write a message.";
          if (value.trim().length < 10) return "Your message should be at least 10 characters.";
          return "";
        },
      },
    ];

    function showError(field, message) {
      const group = field.input.closest(".form-group");
      const error = document.getElementById(field.input.id + "-error");

      group.classList.toggle("is-invalid", Boolean(message));
      field.input.setAttribute("aria-invalid", message ? "true" : "false");
      if (error) error.textContent = message;
    }

    function validateField(field) {
      const message = field.test(field.input.value);
      showError(field, message);
      return message === "";
    }

    fields.forEach(function (field) {
      if (!field.input) return;

      // Check a field when the user leaves it…
      field.input.addEventListener("blur", function () {
        validateField(field);
      });

      // …and clear the error as soon as they fix it
      field.input.addEventListener("input", function () {
        if (field.input.closest(".form-group").classList.contains("is-invalid")) {
          validateField(field);
        }
        if (status) {
          status.classList.remove("is-visible");
          status.textContent = "";
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      let firstInvalid = null;
      fields.forEach(function (field) {
        if (!field.input) return;
        if (!validateField(field) && !firstInvalid) firstInvalid = field.input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (status) {
          status.classList.remove("is-visible");
          status.textContent = "";
        }
        return;
      }

      // No backend is connected: say so honestly instead of faking a send.
      const name = document.getElementById("name").value.trim().split(" ")[0];
      if (status) {
        status.textContent =
          "Thanks, " + name + ". This form is a demo, so your message was not sent. Please email lindalebaneseR@gmail.com and we will reply soon.";
        status.classList.add("is-visible");
      }

      form.reset();
      fields.forEach(function (field) {
        if (field.input) showError(field, "");
      });
    });
  }

  /* ------------------------------------------------------------------
     6. Optional custom cedar cursor (desktop, fine pointer only)
     ------------------------------------------------------------------ */
  const cursorEl = document.getElementById("cursor");
  const finePointer = window.matchMedia("(pointer: fine)");
  const wideScreen = window.matchMedia("(min-width: 900px)");
  const cursorAllowed = function () {
    return finePointer.matches && wideScreen.matches && !reduceMotion.matches;
  };

  if (cursorEl) {
    const ring = cursorEl.querySelector(".cursor-ring");
    const mark = cursorEl.querySelector(".cursor-mark");

    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;
    let running = false;
    let moved = false;

    function render() {
      // The ring eases towards the pointer, the cedar mark stays precise
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = "translate3d(" + ringX + "px," + ringY + "px,0)";
      mark.style.transform = "translate3d(" + targetX + "px," + targetY + "px,0)";

      if (running) window.requestAnimationFrame(render);
    }

    function start() {
      // nothing to show until the pointer has actually moved
      if (running || !moved || !cursorAllowed()) return;
      running = true;
      document.documentElement.classList.add("has-cursor");
      window.requestAnimationFrame(render);
    }

    function stop() {
      running = false;
      document.documentElement.classList.remove("has-cursor");
    }

    document.addEventListener(
      "pointermove",
      function (event) {
        if (event.pointerType !== "mouse") return;
        targetX = event.clientX;
        targetY = event.clientY;
        moved = true;
        if (!running) {
          ringX = targetX;
          ringY = targetY;
          start();
        }
      },
      { passive: true }
    );

    document.addEventListener("pointerover", function (event) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const interactive = target.closest("a, button, .dish-card, .dish-media, label");
      const onDark = target.closest(".menu, .footer, .dish-modal");
      const onField = target.closest("input, textarea, select");

      cursorEl.classList.toggle("is-active", Boolean(interactive));
      cursorEl.classList.toggle("is-light", Boolean(onDark));
      cursorEl.classList.toggle("is-hidden", Boolean(onField));
    });

    // Hide the custom cursor when the mouse leaves the window
    document.addEventListener("pointerleave", function () {
      cursorEl.classList.add("is-hidden");
    });
    document.addEventListener("pointerenter", function () {
      cursorEl.classList.remove("is-hidden");
    });

    // Turn the cursor on or off when the device/media changes
    [finePointer, wideScreen, reduceMotion].forEach(function (query) {
      query.addEventListener("change", function () {
        if (cursorAllowed()) {
          start();
        } else {
          stop();
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     7. Footer year
     ------------------------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(Math.max(2026, new Date().getFullYear()));
  }
})();

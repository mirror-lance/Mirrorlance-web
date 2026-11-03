/* ==========================================================
   MirrorLance — Main Script
   ========================================================== */

/* ----------------------------------------------------------
   1. PORTFOLIO LINKS — replace titles + URLs with your real sites.
   Keys must match data-category on the portfolio cards in index.html.
   Add or remove items freely.
   ---------------------------------------------------------- */
const PORTFOLIO = {
  gym: {
    title: "Gym & Fitness Websites",
    projects: [
      { name: "Gym Website 1", url: "https://example.com/gym-1" },
      { name: "Gym Website 2", url: "https://example.com/gym-2" },
      { name: "Gym Website 3", url: "https://example.com/gym-3" },
    ],
  },
  doctor: {
    title: "Doctor & Clinic Websites",
    projects: [
      { name: "Doctor Website 1", url: "https://example.com/doctor-1" },
      { name: "Doctor Website 2", url: "https://example.com/doctor-2" },
    ],
  },
  restaurant: {
    title: "Restaurant Websites",
    projects: [
      { name: "Restaurant Website 1", url: "https://example.com/restaurant-1" },
      { name: "Restaurant Website 2", url: "https://example.com/restaurant-2" },
      { name: "Restaurant Website 3", url: "https://example.com/restaurant-3" },
    ],
  },
  agency: {
    title: "Agency Websites",
    projects: [
      { name: "Agency Website 1", url: "https://example.com/agency-1" },
      { name: "Agency Website 2", url: "https://example.com/agency-2" },
    ],
  },
  ecommerce: {
    title: "E-commerce Websites",
    projects: [
      { name: "E-commerce Website 1", url: "https://example.com/shop-1" },
      { name: "E-commerce Website 2", url: "https://example.com/shop-2" },
      { name: "E-commerce Website 3", url: "https://example.com/shop-3" },
    ],
  },
};

/* ----------------------------------------------------------
   2. BEHAVIOUR — no need to edit below this line
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  /* Navbar background on scroll + back-to-top */
  const nav = document.getElementById("mainNav");
  const toTop = document.querySelector(".back-to-top");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 600);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Close mobile menu after clicking a link */
  const navMenu = document.getElementById("navMenu");
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });
  });

  /* Footer year */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* Portfolio: project counts + modal */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const cat = PORTFOLIO[el.dataset.count];
    if (cat) el.textContent = `${cat.projects.length} projects`;
  });

  const modalEl = document.getElementById("portfolioModal");
  const modal = new bootstrap.Modal(modalEl);
  const modalTitle = document.getElementById("portfolioModalTitle");
  const modalList = document.getElementById("portfolioModalList");

  document.querySelectorAll(".portfolio-card").forEach((card) => {
    card.addEventListener("click", () => {
      const cat = PORTFOLIO[card.dataset.category];
      if (!cat) return;
      modalTitle.textContent = cat.title;
      modalList.innerHTML = "";
      cat.projects.forEach((p) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = p.url;
        a.target = "_blank";
        a.rel = "noopener";
        const text = document.createElement("span");
        const name = document.createElement("span");
        name.textContent = p.name;
        const url = document.createElement("small");
        url.textContent = p.url.replace(/^https?:\/\//, "");
        text.append(name, url);
        const icon = document.createElement("i");
        icon.className = "bi bi-box-arrow-up-right";
        a.append(text, icon);
        li.appendChild(a);
        modalList.appendChild(li);
      });
      modal.show();
    });
  });

  /* Modal "Get a Quote" → scroll to contact after the modal closes */
  modalEl.querySelector('a[href="#contact"]').addEventListener("click", (e) => {
    e.preventDefault();
    modalEl.addEventListener(
      "hidden.bs.modal",
      () => document.getElementById("contact").scrollIntoView({ behavior: "smooth" }),
      { once: true }
    );
  });

  /* Package buttons pre-select the service in the form */
  const serviceSelect = document.getElementById("service");
  document.querySelectorAll("[data-package]").forEach((btn) => {
    btn.addEventListener("click", () => {
      serviceSelect.value = btn.dataset.package;
    });
  });

  /* Inquiry form - EmailJS Integration */
  const form = document.getElementById("inquiryForm");
  const success = document.getElementById("formSuccess");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Trim values before validating
    form.querySelectorAll("input, textarea").forEach((f) => (f.value = f.value.trim()));
    
    // Check Bootstrap validity
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      form.querySelector(":invalid")?.focus();
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending… <span class="spinner-border spinner-border-sm ms-1"></span>';

    // Send the form using EmailJS
    emailjs.sendForm('service_mirrorlance', 'template_mirrorlance', form)
      .then(() => {
        // Success: Hide form, show success message, reset inputs
        form.classList.add("d-none");
        success.classList.remove("d-none");
        form.reset();
        form.classList.remove("was-validated");
      })
      .catch((error) => {
        // Error: Show alert, log error
        console.error('EmailJS Error:', error);
        alert("Sorry, something went wrong sending your message. Please try again or DM us on Instagram.");
      })
      .finally(() => {
        // Always restore the submit button to its original state
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit <i class="bi bi-send ms-1"></i>';
      });
  });

  /* Subtle reveal on scroll */
  const revealTargets = document.querySelectorAll(
    ".section-head, .service-card, .package-card, .process-step, .portfolio-card, .why-item, .ig-card, .form-card, .stat"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => io.observe(el));
});

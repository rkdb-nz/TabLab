const EMAIL = "tablab@rkdb.nz";
const EXPLORE_HASH = "#explore";

function encodeMail(value) {
  return encodeURIComponent(value);
}

function setStartEmailLinks() {
  const links = document.querySelectorAll(".email-start");

  if (!links.length) return;

  const subject = "Hand Me The Problem";

  const body = `Hi, I'm Rob.

Tab Lab was built to make having a website effortless.

In a few sentences, tell me who you are, where you are, and what you'd like your customers to know.

I'll do some homework, think about what might work for you, and come back with a few different mockups of your new site.

If one feels right, we'll refine it together.

If not, tell me why. We'll go from there.

---`;

  links.forEach((link) => {
    link.href = `mailto:${EMAIL}?subject=${encodeMail(subject)}&body=${encodeMail(body)}`;
  });
}

function setConceptEmailLinks() {
  const links = document.querySelectorAll(".email-concept");

  if (!links.length) return;

  const concept =
    document.querySelector("[data-concept]")?.dataset.concept ||
    "A Tab Lab Possibility";

  const subject = `Tab Lab Concept Interest - ${concept}`;

  const body = `I like this direction: ${concept}

Tell me who you are, where you are, and what you'd like your customers to know.

What do you like about this example?

Anything else you'd like me to know?

---`;

  links.forEach((link) => {
    link.href = `mailto:${EMAIL}?subject=${encodeMail(subject)}&body=${encodeMail(body)}`;
  });
}

function setupFoundryOverlay() {
  const exploreButton = document.getElementById("foundryExplore");
  const overlay = document.getElementById("foundryOverlay");
  const closeButton = document.getElementById("foundryClose");
  const blurWrap = document.getElementById("siteBlurWrap");

  if (!exploreButton || !overlay || !closeButton || !blurWrap) return;

  function openOverlay(updateHash = true) {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");

    blurWrap.classList.add("is-blurred");

    exploreButton.setAttribute("aria-expanded", "true");

    if (updateHash && window.location.hash !== EXPLORE_HASH) {
      history.pushState({ foundryOverlay: true }, "", EXPLORE_HASH);
    }
  }

  function closeOverlay(clearHash = true) {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");

    blurWrap.classList.remove("is-blurred");

    exploreButton.setAttribute("aria-expanded", "false");

    if (clearHash && window.location.hash === EXPLORE_HASH) {
      history.replaceState(null, "", window.location.pathname || "/");
    }
  }

  exploreButton.addEventListener("click", () => {
    openOverlay(true);
  });

  closeButton.addEventListener("click", () => {
    closeOverlay(true);
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeOverlay(true);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeOverlay(true);
    }
  });

  window.addEventListener("popstate", () => {
    if (window.location.hash === EXPLORE_HASH) {
      openOverlay(false);
    } else {
      closeOverlay(false);
    }
  });

  if (window.location.hash === EXPLORE_HASH) {
    openOverlay(false);
  }

  document.documentElement.classList.remove("foundry-explore-boot");
}


function setupHomepageSortPanel() {
  const sortButton = document.getElementById("foundrySort");
  const backButton = document.getElementById("foundryBack");
  const introPanel = document.getElementById("foundryIntroPanel");
  const startPanel = document.getElementById("foundryStartPanel");

  if (!sortButton || !backButton || !introPanel || !startPanel) return;

  let isTransitioning = false;

  function showStartPanel() {
    if (isTransitioning) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      introPanel.classList.remove("is-active");
      introPanel.setAttribute("aria-hidden", "true");
      startPanel.classList.add("is-active");
      startPanel.setAttribute("aria-hidden", "false");
      startPanel.querySelector(".email-start")?.focus();
      return;
    }

    isTransitioning = true;
    sortButton.disabled = true;
    document.body.classList.add("is-forging");

    window.setTimeout(() => {
      introPanel.classList.remove("is-active");
      introPanel.setAttribute("aria-hidden", "true");
      startPanel.classList.add("is-active");
      startPanel.setAttribute("aria-hidden", "false");
    }, 610);

    window.setTimeout(() => {
      document.body.classList.remove("is-forging");
      sortButton.disabled = false;
      isTransitioning = false;
      startPanel.querySelector(".email-start")?.focus();
    }, 1420);
  }

  function showIntroPanel() {
    startPanel.classList.remove("is-active");
    startPanel.setAttribute("aria-hidden", "true");
    introPanel.classList.add("is-active");
    introPanel.removeAttribute("aria-hidden");

    window.setTimeout(() => {
      sortButton.focus();
    }, 700);
  }

  sortButton.addEventListener("click", showStartPanel);
  backButton.addEventListener("click", showIntroPanel);
}

function setupFoundryCareModal() {
  const modal = document.getElementById("foundrycare-definitions");
  const openButton = document.querySelector(".foundry-care-button");
  const closeButton = document.querySelector(".foundry-modal-close");

  if (!modal || !openButton || !closeButton) return;

  const panel = modal.querySelector(".foundry-modal-panel");
  const title = document.getElementById("foundrycare-definitions-title");

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    if (panel) {
      panel.scrollTop = 0;
    }

    requestAnimationFrame(() => {
      if (title) {
        title.setAttribute("tabindex", "-1");
        title.focus();
      }
    });
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    openButton.focus();
  }

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function setupPageTransitions() {
  requestAnimationFrame(() => {
    document.body.classList.add("page-loaded");
  });

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      link.hasAttribute("target")
    ) {
      return;
    }

    link.addEventListener("click", (event) => {
      event.preventDefault();

      document.body.classList.add("page-exit");

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setStartEmailLinks();
  setConceptEmailLinks();
  setupFoundryOverlay();
  setupHomepageSortPanel();
  setupFoundryCareModal();
  setupPageTransitions();
});

/* =========================================================
GLOBAL PAGE TRANSITION
========================================================= */

window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        document.body.classList.add('page-ready');
    });
});

document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');

    if (!link) return;
    if (link.target === '_blank') return;
    if (link.hasAttribute('download')) return;

    const href = link.getAttribute('href');

    if (!href) return;
    if (href.startsWith('#')) return;
    if (href.startsWith('mailto:')) return;
    if (href.startsWith('tel:')) return;
    if (href.startsWith('javascript:')) return;

    const destination = new URL(link.href, window.location.href);

    if (destination.origin !== window.location.origin) return;

    event.preventDefault();

    document.body.classList.remove('page-ready');
    document.body.classList.add('page-leaving');

    window.setTimeout(() => {
        window.location.href = destination.href;
    }, 280);
});

window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-leaving');

    requestAnimationFrame(() => {
        document.body.classList.add('page-ready');
    });
});

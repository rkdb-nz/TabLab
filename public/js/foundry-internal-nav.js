(() => {

  if (document.querySelector(".foundry-nav-set")) return;

  const script = document.currentScript;

  const root = script?.dataset.root || "../";
  const fallback = script?.dataset.back || `${root}#explore`;

  /* ---------------------------------------------------------
     STYLES
     --------------------------------------------------------- */

  const style = document.createElement("style");

  style.textContent = `

    /* =========================================
       FOUNDRY INTERNAL NAV
       ========================================= */

    .foundry-nav-set {
      position: fixed;
      top: 6%;
      right: 5%;
      z-index: 10002;

      display: flex;
      align-items: center;
      gap: 14px;
    }


    /* all three controls */

    .foundry-nav-control {
      position: relative;

      width: 46px;
      height: 40px;

      padding: 0;
      margin: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      border: 0;
      background: transparent;

      color: #a66f36;
      text-decoration: none;

      cursor: pointer;
    }


    /* subtle hover */

    .foundry-nav-control {
      transition:
        transform 160ms ease,
        filter 160ms ease;
    }

    .foundry-nav-control:hover {
      filter: brightness(1.18);
      transform: translateY(-1px);
    }


    /* =========================================
       BACK + HOME ICONS
       same forged-metal appearance as menu
       ========================================= */

    .foundry-nav-control svg {
      width: 30px;
      height: 30px;

      fill: none;

      stroke: #9d6832;
      stroke-width: 2.25;
      stroke-linecap: round;
      stroke-linejoin: round;

      filter:
        drop-shadow(0 1px 0 rgba(255,220,155,.32))
        drop-shadow(0 2px 2px rgba(0,0,0,.58));
    }


    /* =========================================
       MENU — SAME 3D BAR TREATMENT
       ========================================= */

    .foundry-nav-menu {
      flex-direction: column;
      justify-content: center;
    }

    .foundry-nav-menu span {
      display: block;

      width: 46px;
      height: 4px;

      margin: 3.5px 0;

      border-top:
        1px solid rgba(255,218,145,.60);

      border-bottom:
        1px solid rgba(45,25,10,.95);

      background:
        linear-gradient(
          180deg,
          #c6924e 0%,
          #8e5b2c 38%,
          #57351c 72%,
          #2d1d12 100%
        );

      box-shadow:
        inset 0 1px 0 rgba(255,233,184,.25),
        0 2px 2px rgba(0,0,0,.85),
        0 4px 5px rgba(0,0,0,.30);

      transform-origin: center;

      transition:
        transform 420ms cubic-bezier(.2,.8,.2,1),
        opacity 220ms ease,
        width 320ms ease,
        filter 160ms ease;
    }

    .foundry-nav-menu:hover span {
      filter: brightness(1.12);
    }


    /* =========================================
       THE EXISTING FOLD INTO X
       ========================================= */

    body.foundry-nav-open
    .foundry-nav-menu span:nth-child(1) {
      transform: translateY(11px) rotate(45deg);
    }

    body.foundry-nav-open
    .foundry-nav-menu span:nth-child(2) {
      opacity: 0;
      transform: scaleX(.2);
    }

    body.foundry-nav-open
    .foundry-nav-menu span:nth-child(3) {
      transform: translateY(-11px) rotate(-45deg);
    }


    /* =========================================
       BACKDROP
       ========================================= */

    .foundry-nav-backdrop {
      position: fixed;
      inset: 0;

      z-index: 9998;

      background:
        linear-gradient(
          90deg,
          rgba(0,0,0,.05) 0%,
          rgba(0,0,0,.18) 55%,
          rgba(0,0,0,.42) 100%
        );

      opacity: 0;
      visibility: hidden;
      pointer-events: none;

      transition:
        opacity 540ms ease,
        visibility 0s linear 540ms;
    }

    body.foundry-nav-open
    .foundry-nav-backdrop {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;

      transition:
        opacity 540ms ease,
        visibility 0s;
    }


    /* =========================================
       DRAWER — MATCH EXISTING FOUNDRY DRAWER
       ========================================= */

    .foundry-nav-drawer {
      position: fixed;

      top: 0;
      right: 0;
      bottom: 0;

      width: min(430px, 88vw);

      z-index: 10000;

      overflow: hidden;

      background:
        radial-gradient(
          circle at 12% 25%,
          rgba(180,129,71,.08),
          transparent 34%
        ),
        linear-gradient(
          105deg,
          rgba(255,255,255,.025),
          transparent 28%
        ),
        linear-gradient(
          180deg,
          #171513 0%,
          #100f0e 48%,
          #0b0a09 100%
        );

      border-left:
        1px solid rgba(185,139,83,.32);

      box-shadow:
        -22px 0 70px rgba(0,0,0,.58);

      transform: translateX(102%);
      visibility: hidden;

      transition:
        transform 560ms cubic-bezier(.18,.82,.22,1),
        visibility 0s linear 560ms;
    }

    body.foundry-nav-open
    .foundry-nav-drawer {
      visibility: visible;
      transform: translateX(0);

      transition:
        transform 560ms cubic-bezier(.18,.82,.22,1),
        visibility 0s;
    }


    .foundry-nav-drawer-inner {
      display: flex;
      flex-direction: column;

      height: 100%;

      box-sizing: border-box;

      padding:
        clamp(100px,13vh,145px)
        clamp(32px,4vw,52px)
        34px;
    }


    .foundry-nav-kicker {
      margin-bottom: 34px;

      color: rgba(210,169,114,.72);

      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;

      letter-spacing: 5px;
      text-transform: uppercase;
    }


    .foundry-nav-drawer nav {
      display: flex;
      flex-direction: column;
    }


    .foundry-nav-link {
      display: grid;
      grid-template-columns: 42px 1fr;
      align-items: center;

      padding: 15px 0;

      border-bottom:
        1px solid rgba(210,169,114,.10);

      color: rgba(244,231,211,.84);

      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(18px,1.45vw,23px);

      text-decoration: none;

      transition:
        color 220ms ease,
        padding-left 300ms cubic-bezier(.2,.8,.2,1);
    }

    .foundry-nav-link:hover {
      color: #d8a76e;
      padding-left: 6px;
    }


    .foundry-nav-number {
      color: rgba(210,169,114,.46);

      font-family: Arial, Helvetica, sans-serif;
      font-size: 9px;

      letter-spacing: .12em;
    }


    .foundry-nav-footer {
      margin-top: auto;

      color: rgba(210,169,114,.42);

      font-family: Arial, Helvetica, sans-serif;
      font-size: 9px;

      letter-spacing: .22em;
    }


    /* =========================================
       HIDE OLD INTERNAL PAGE NAV CONTROLS
       ========================================= */

    .foundry-anvil-menu,
    .start-back-wrap,
    .whywebsite-back-wrap,
    .foundry-about-menu,
    .foundry-about-back,
    .foundrycare-menu,
    .foundrycare-back {
      display: none !important;
    }


    /* Boardroom's old top links */

    body > .site-header .header-link,
    body > .site-header .site-nav {
      display: none !important;
    }


    /* =========================================
       FOUNDRYCARE LIGHT PAGE
       ========================================= */

    body.foundrycare-page
    .foundry-nav-control svg {
      stroke: #995f2b;
    }


    /* =========================================
       MOBILE
       ========================================= */

    @media (max-width: 650px) {

      .foundry-nav-set {
        top: 20px;
        right: 18px;
        gap: 8px;
      }

      .foundry-nav-control {
        width: 39px;
        height: 36px;
      }

      .foundry-nav-menu span {
        width: 38px;
      }
    }

  `;

  document.head.appendChild(style);


  /* ---------------------------------------------------------
     CONTROLS
     --------------------------------------------------------- */

  const controls = document.createElement("nav");

  controls.className = "foundry-nav-set";
  controls.setAttribute("aria-label", "Foundry navigation");

  controls.innerHTML = `

    <button
      class="foundry-nav-control foundry-nav-back"
      type="button"
      aria-label="Back"
      title="Back"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 12H5"></path>
        <path d="M11 6l-6 6 6 6"></path>
      </svg>
    </button>

    <a
      class="foundry-nav-control"
      href="${root}"
      aria-label="Home"
      title="Home"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.5 12 5l8 6.5"></path>
        <path d="M6.5 10v9h11v-9"></path>
        <path d="M10 19v-5h4v5"></path>
      </svg>
    </a>

    <button
      class="foundry-nav-control foundry-nav-menu"
      type="button"
      aria-label="Open menu"
      aria-expanded="false"
      title="Menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

  `;


  /* ---------------------------------------------------------
     BACKDROP + DRAWER
     --------------------------------------------------------- */

  const backdrop = document.createElement("div");
  backdrop.className = "foundry-nav-backdrop";

  const drawer = document.createElement("aside");
  drawer.className = "foundry-nav-drawer";

  drawer.innerHTML = `

    <div class="foundry-nav-drawer-inner">

      <div class="foundry-nav-kicker">
        THE FOUNDRY
      </div>

      <nav aria-label="Main navigation">

        <a class="foundry-nav-link" href="${root}">
          <span class="foundry-nav-number">01</span>
          <span>Home</span>
        </a>

        <a class="foundry-nav-link" href="${root}start/">
          <span class="foundry-nav-number">02</span>
          <span>Make me a site</span>
        </a>

        <a class="foundry-nav-link" href="${root}boardroom/">
          <span class="foundry-nav-number">03</span>
          <span>The Boardroom</span>
        </a>

        <a class="foundry-nav-link" href="${root}whywebsite/">
          <span class="foundry-nav-number">04</span>
          <span>Why own a website?</span>
        </a>

        <a class="foundry-nav-link" href="${root}foundrycare/">
          <span class="foundry-nav-number">05</span>
          <span>FoundryCare</span>
        </a>

        <a class="foundry-nav-link" href="${root}the-foundry/">
          <span class="foundry-nav-number">06</span>
          <span>About The Foundry</span>
        </a>

        <a
          class="foundry-nav-link"
          href="mailto:tablab@rkdb.nz"
        >
          <span class="foundry-nav-number">07</span>
          <span>Contact</span>
        </a>

      </nav>

      <div class="foundry-nav-footer">
        WEB DESIGN · FOUNDRYCARE
      </div>

    </div>

  `;


  document.body.append(controls, backdrop, drawer);


  /* ---------------------------------------------------------
     BEHAVIOUR
     --------------------------------------------------------- */

  const back = controls.querySelector(".foundry-nav-back");
  const menu = controls.querySelector(".foundry-nav-menu");

  const closeMenu = () => {
    document.body.classList.remove("foundry-nav-open");

    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open menu");
    menu.title = "Menu";
  };

  const openMenu = () => {
    document.body.classList.add("foundry-nav-open");

    menu.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-label", "Close menu");
    menu.title = "Close menu";
  };

  menu.addEventListener("click", () => {
    document.body.classList.contains("foundry-nav-open")
      ? closeMenu()
      : openMenu();
  });

  backdrop.addEventListener("click", closeMenu);

  drawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  back.addEventListener("click", () => {
    if (history.length > 1) {
      history.back();
    } else {
      location.href = fallback;
    }
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      document.body.classList.contains("foundry-nav-open")
    ) {
      closeMenu();
      menu.focus();
    }
  });

})();

(() => {
  if (!window.posthog) {
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split('.');2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement('script')).type='text/javascript',p.crossOrigin='anonymous',p.async=!0,p.src=s.api_host.replace('.i.posthog.com','-assets.i.posthog.com')+'/static/array.js',(r=t.getElementsByTagName('script')[0]).parentNode.insertBefore(p,r);var u=e;void 0!==a?u=e[a]=[]:a='posthog',u.people=u.people||[],u.toString=function(t){var e='posthog';return'posthog'!==a&&(e+='.'+a),t||(e+=' (stub)'),e},u.people.toString=function(){return u.toString(1)+'.people (stub)'},o='init capture register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures onSessionId getSessionId get_session_id get_distinct_id getGroups set_group group identify setPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty'.split(' ');for(n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_oANcwiU5t9xumCPf3juV9b4vcpnuaPvr7uPe6dTfHhde', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true
    });
  }

  if (document.querySelector('.foundry-global-nav')) return;

  const script = document.currentScript;
  const root = script?.dataset.root || '../';
  const fallback = script?.dataset.back || `${root}#explore`;
  const landingActions = script?.dataset.landingActions === 'true';
  const menuOnly = script?.dataset.menuOnly === 'true';

  const nav = document.createElement('nav');
  nav.className = 'foundry-global-nav';
  nav.setAttribute('aria-label', 'Tab Lab navigation');

  nav.innerHTML = `
    <button class="foundry-global-control foundry-global-back" type="button" aria-label="Back" title="Back">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M38 24H12"></path>
        <path d="M22 14 12 24l10 10"></path>
      </svg>
    </button>

    <a class="foundry-global-control foundry-global-home" href="${root}" aria-label="Home" title="Home">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="foundry-home-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#d5a25d"/>
            <stop offset=".42" stop-color="#a76e35"/>
            <stop offset="1" stop-color="#64391e"/>
          </linearGradient>
        </defs>
        <path d="M8 23.5 24 10l16 13.5h-5V39H27V28h-6v11h-8V23.5Z"></path>
      </svg>
    </a>

    <button class="foundry-global-control foundry-global-menu" type="button" aria-label="Open menu" aria-expanded="false" title="Menu">
      <span></span><span></span><span></span>
    </button>
  `;

  document.body.append(nav);

  if (menuOnly) nav.classList.add('foundry-global-nav--menu-only');

  const backButton = nav.querySelector('.foundry-global-back');
  const menuButton = nav.querySelector('.foundry-global-menu');

  
  backButton.addEventListener('click', () => {
    const sameSiteReferrer = document.referrer && new URL(document.referrer).origin === location.origin;
    if (history.length > 1 && (sameSiteReferrer || history.state)) history.back();
    else location.assign(fallback);
  });


  const backdrop = document.createElement('div');
  backdrop.className = 'foundry-global-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');

  const drawer = document.createElement('aside');
  drawer.className = 'foundry-global-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('aria-label', 'Site navigation');
  drawer.setAttribute('role', 'dialog');
  drawer.inert = true;
  drawer.id = 'tablab-site-drawer';
  menuButton.setAttribute('aria-controls', drawer.id);

  drawer.innerHTML = `
    <div class="foundry-global-drawer-inner">
      <div class="foundry-global-kicker">TAB LAB</div>
      <nav aria-label="Main navigation">
        ${landingActions ? `<button class="foundry-global-link" type="button" data-drawer-action="home"><span>Home</span></button>` : `<a class="foundry-global-link" href="${root}"><span>Home</span></a>`}

        <div class="foundry-global-menu-divider" aria-hidden="true"></div>

        <a class="foundry-global-link" href="${root}boardroom/"><span>The Boardroom</span></a>
        <a class="foundry-global-link" href="${root}foundrycare/"><span>TabLabCare</span></a>

        <div class="foundry-global-menu-divider" aria-hidden="true"></div>

        <a class="foundry-global-link" href="${root}the-foundry/"><span>About Tab Lab</span></a>
        <a class="foundry-global-link" href="${root}whywebsite/"><span>Why own a website?</span></a>

        <div class="foundry-global-menu-divider" aria-hidden="true"></div>

        ${landingActions ? `<button class="foundry-global-link" type="button" data-drawer-action="site"><span>Make me a site</span></button>` : `<a class="foundry-global-link" href="${root}start/"><span>Make me a site</span></a>`}
        <a class="foundry-global-link" href="mailto:tablab@rkdb.nz"><span>Contact</span></a>
      </nav>
      <div class="foundry-global-footer">WEB DESIGN · TABLABCARE</div>
    </div>
  `;

  document.body.append(backdrop, drawer);

  const drawerClose = menuButton.cloneNode(true);
  drawerClose.id = 'tablab-drawer-close';
  drawerClose.setAttribute('aria-label', 'Close menu');
  drawerClose.title = 'Close menu';
  drawerClose.removeAttribute('aria-controls');
  drawerClose.removeAttribute('aria-expanded');
  drawer.append(drawerClose);
  drawerClose.addEventListener('click', () => closeMenu());

  const backgroundStates = new Map();
  const closeMenu = () => {
    const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
    backgroundStates.forEach((value, element) => { element.inert = value; });
    backgroundStates.clear();
    drawer.inert = true;
    drawer.removeAttribute('aria-modal');
    document.body.classList.remove('foundry-global-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    menuButton.title = 'Menu';
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    if (wasOpen) menuButton.focus();
  };

  window.closeFoundryDrawer = closeMenu;

  const openMenu = () => {
    [...document.body.children, ...nav.children].forEach(element => {
      if ([nav, drawer, backdrop, menuButton].includes(element) || ['SCRIPT','STYLE','LINK'].includes(element.tagName)) return;
      backgroundStates.set(element, element.inert);
      element.inert = true;
    });
    drawer.inert = false;
    drawer.setAttribute('aria-modal', 'true');
    document.body.classList.add('foundry-global-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close menu');
    menuButton.title = 'Close menu';
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    drawer.querySelector('a, button')?.focus();
  };

  menuButton.addEventListener('click', () => {
    document.body.classList.contains('foundry-global-open') ? closeMenu() : openMenu();
  });

  backdrop.addEventListener('click', closeMenu);
  drawer.querySelectorAll('a, button').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', event => {
    if (event.key === 'Tab' && menuButton.getAttribute('aria-expanded') === 'true') {
      const targets = [...drawer.querySelectorAll('a[href],button:not([disabled])')];
      const index = targets.indexOf(document.activeElement);
      if ((event.shiftKey && index <= 0) || (!event.shiftKey && (index < 0 || index === targets.length - 1))) {
        event.preventDefault();
        targets[event.shiftKey ? targets.length - 1 : 0].focus();
      }
    }
    if (event.key === 'Escape' && document.body.classList.contains('foundry-global-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
})();
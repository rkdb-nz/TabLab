const sortButton = document.getElementById('sortButton');
const exploreButton = document.getElementById('exploreButton');
const backButton = document.getElementById('backButton');

const introPanel = document.getElementById('introPanel');
const sortPanel = document.getElementById('sortPanel');
const exploreScreen = document.getElementById('exploreScreen');
const landingStateBlackout = document.getElementById('landingStateBlackout');

const STATE_FADE_OUT_MS = 150;
const STATE_FADE_IN_MS = 250;
let pendingState = null;

let isTransitioning = false;

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clearLegacyTransitionClasses() {
    document.body.classList.remove('is-forging', 'is-returning');
}

function clearExploreTransitionClass() {
    document.body.classList.remove(
        'explore-transitioning',
        'explore-crossfade',
        'explore-crossfade-complete'
    );
}

/* Keep the next action exactly under the Home action, at every viewport size. */
function alignSortAction() {
    const nodes = [document.documentElement, document.body, introPanel, sortPanel];
    const classes = nodes.map(node => node.className);
    const wasDisabled = sortButton.disabled;
    const buttonStyle = sortButton.getAttribute('style');
    try {
        sortButton.disabled = false;
        sortButton.style.setProperty('transform', 'none', 'important');
        sortButton.style.setProperty('transition', 'none', 'important');
        document.documentElement.classList.remove('restore-sort', 'restore-explore');
        document.body.classList.remove('sort-open', 'explore-open');
        sortPanel.classList.remove('is-active');
        introPanel.classList.add('is-active');
        const rect = sortButton.getBoundingClientRect();
        sortPanel.style.setProperty('--next-action-top', rect.top + 'px');
        sortPanel.style.setProperty('--next-action-left', rect.left + 'px');
        sortPanel.style.setProperty('--next-action-width', rect.width + 'px');
        sortPanel.style.setProperty('--next-action-height', rect.height + 'px');
    } finally {
        nodes.forEach((node, index) => { node.className = classes[index]; });
        sortButton.disabled = wasDisabled;
        if (buttonStyle === null) sortButton.removeAttribute('style');
        else sortButton.setAttribute('style', buttonStyle);
    }
}
window.addEventListener('resize', () => {
    if (sortPanel.classList.contains('is-active')) alignSortAction();
});
document.fonts?.ready.then(() => {
    if (sortPanel.classList.contains('is-active')) alignSortAction();
});

function activateSortPanel({ preserveForge = false } = {}) {
    alignSortAction();
    if (!preserveForge) {
        clearLegacyTransitionClasses();
    }

    clearExploreTransitionClass();
    document.documentElement.classList.remove('restore-explore');
    document.body.classList.remove('explore-open');
    document.body.classList.add('sort-open');

    exploreScreen?.setAttribute('aria-hidden', 'true');

    introPanel.classList.remove('is-active');
    introPanel.setAttribute('aria-hidden', 'true');

    sortPanel.classList.add('is-active');
    sortPanel.setAttribute('aria-hidden', 'false');
}

function activateIntroPanel() {
    clearLegacyTransitionClasses();
    clearExploreTransitionClass();
    document.documentElement.classList.remove('restore-explore', 'restore-sort');
    document.body.classList.remove('explore-open', 'sort-open');

    sortPanel.classList.remove('is-active');
    sortPanel.setAttribute('aria-hidden', 'true');

    exploreScreen?.setAttribute('aria-hidden', 'true');

    introPanel.classList.add('is-active');
    introPanel.setAttribute('aria-hidden', 'false');
}

function activateExploreScreen() {
    clearLegacyTransitionClasses();
    document.documentElement.classList.remove('restore-sort');
    document.body.classList.remove('sort-open');
    document.body.classList.add('explore-open');
    clearExploreTransitionClass();

    introPanel.classList.remove('is-active');
    introPanel.setAttribute('aria-hidden', 'true');

    sortPanel.classList.remove('is-active');
    sortPanel.setAttribute('aria-hidden', 'true');

    exploreScreen?.setAttribute('aria-hidden', 'false');
}

function activeContent() {
    if (document.body.classList.contains('explore-open')) {
        return Array.from(exploreScreen.children);
    }
    if (sortPanel.classList.contains('is-active')) {
        return Array.from(sortPanel.querySelectorAll('.sort-title, .sort-lines, .sort-actions'));
    }
    return Array.from(introPanel.querySelectorAll('.hero-lines, .mobile-tagline, .hero-actions'));
}

async function transitionTo(activateState) {
    if (isTransitioning) {
        pendingState = activateState;
        return;
    }
    clearLegacyTransitionClasses();
    introPanel.classList.remove('landing-enter');
    if (landingStateBlackout) landingStateBlackout.className = 'landing-state-blackout';
    if (prefersReducedMotion()) {
        activateState();
        return;
    }

    isTransitioning = true;
    const animations = [];
    try {
        const outgoing = activeContent().map(element => {
            const opacity = getComputedStyle(element).opacity;
            const animation = element.animate(
                [{ opacity }, { opacity: 0 }],
                { duration: STATE_FADE_OUT_MS, easing: 'ease-out', fill: 'forwards' }
            );
            animations.push(animation);
            return animation.finished;
        });
        await Promise.all(outgoing);
        animations.forEach(animation => animation.cancel());
        animations.length = 0;

        activateState();
        const incoming = activeContent().map(element => {
            const opacity = getComputedStyle(element).opacity;
            const animation = element.animate(
                [{ opacity: 0, translate: '0 8px' }, { opacity, translate: '0 0' }],
                { duration: STATE_FADE_IN_MS, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
            );
            animations.push(animation);
            return animation.finished;
        });
        await Promise.all(incoming);
    } finally {
        animations.forEach(animation => animation.cancel());
        isTransitioning = false;
        if (pendingState) {
            const next = pendingState;
            pendingState = null;
            transitionTo(next);
        }
    }
}

function showSortPanel() {
    if (isTransitioning) return;
    if (sortPanel.classList.contains('is-active') && !document.body.classList.contains('explore-open')) {
        return;
    }

    if (window.location.hash !== '#make-site') {
        history.pushState({ foundryState: 'make-site' }, '', '#make-site');
    }

    transitionTo(activateSortPanel);
}

function showIntroPanel({ updateHistory = true } = {}) {
    if (updateHistory && window.location.hash) {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }

    if (introPanel.classList.contains('is-active') && !document.body.classList.contains('explore-open')) {
        activateIntroPanel();
        return;
    }

    transitionTo(activateIntroPanel);
}

function showExploreScreen() {
    if (isTransitioning) return;
    closeDrawer();

    if (document.body.classList.contains('explore-open')) {
        return;
    }

    if (window.location.hash !== '#explore') {
        history.pushState({ foundryState: 'explore' }, '', '#explore');
    }

    transitionTo(activateExploreScreen);
}

sortButton?.addEventListener('click', showSortPanel);
backButton?.addEventListener('click', () => showIntroPanel());
exploreButton?.addEventListener('click', showExploreScreen);


/* =========================================================
   GLOBAL NAV: LANDING-PAGE ACTIONS
   ========================================================= */

const drawerHome = document.querySelector('[data-drawer-action="home"]');
const drawerSite = document.querySelector('[data-drawer-action="site"]');
const globalBackButton = document.querySelector('.foundry-global-back');

function closeDrawer() {
    if (typeof window.closeFoundryDrawer === 'function') {
        window.closeFoundryDrawer();
    }
}

globalBackButton?.addEventListener('click', event => {
    const onSecondaryLandingState =
        sortPanel.classList.contains('is-active') ||
        document.body.classList.contains('explore-open');

    if (!onSecondaryLandingState) {
        return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    if (window.location.hash === '#make-site' || window.location.hash === '#explore') {
        history.back();
    } else {
        showIntroPanel();
    }
}, true);

drawerHome?.addEventListener('click', () => {
    window.setTimeout(() => showIntroPanel(), 600);
});

drawerSite?.addEventListener('click', () => {
    window.setTimeout(showSortPanel, 380);
});


/* Real navigation links close the drawer before the existing page transition runs. */
document.querySelectorAll('.drawer-link[href]').forEach(link => {
    link.addEventListener('click', closeDrawer);
});

window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#explore' || window.location.hash === '#make-site') {
        return;
    }

    introPanel.classList.remove('is-arriving', 'home-return');
    introPanel.classList.add('landing-enter');

    window.setTimeout(() => {
        introPanel.classList.remove('landing-enter');
    }, 1050);
});


/* Restore landing states from their persistent URL hashes without replaying a transition on load. */
function restoreStateFromHash({ animate = false } = {}) {
    if (window.location.hash === '#explore') {
        if (animate) {
            transitionTo(activateExploreScreen);
        } else {
            activateExploreScreen();
        }
    } else if (window.location.hash === '#make-site') {
        if (!animate) document.documentElement.classList.add('restore-sort');
        if (animate) {
            transitionTo(activateSortPanel);
        } else {
            activateSortPanel();
        }
    } else if (!introPanel.classList.contains('is-active') || document.body.classList.contains('explore-open')) {
        if (animate) {
            transitionTo(activateIntroPanel);
        } else {
            activateIntroPanel();
        }
    }
}

restoreStateFromHash();
window.addEventListener('DOMContentLoaded', () => restoreStateFromHash());

window.addEventListener('pageshow', () => {
    restoreStateFromHash();
});

window.addEventListener('popstate', () => {
    restoreStateFromHash({ animate: true });
});

/* =========================
   NAVIGATION MOBILE
   ========================= */

const mobileMenuToggle =
    document.querySelector(
        ".mobile-menu-toggle"
    );

const mobileMenu =
    document.querySelector(
        ".mobile-menu"
    );

const mobileMenuLinks =
    document.querySelectorAll(
        ".mobile-menu-link"
    );

const mobileSubmenuLinks =
    document.querySelectorAll(
        ".mobile-submenu-link"
    );

const mobileSubmenuToggles =
    document.querySelectorAll(
        ".mobile-submenu-toggle"
    );

let isMobileMenuOpen = false;


/* =========================
   UTILITAIRES MENU MOBILE
   ========================= */

function resetMobileSubmenus() {

    document
        .querySelectorAll(
            ".mobile-nav-group"
        )
        .forEach((group) => {

            group.classList.remove(
                "is-open"
            );

            const toggle =
                group.querySelector(
                    ".mobile-submenu-toggle"
                );

            if (toggle) {

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

}


/* =========================
   OUVRIR LE MENU MOBILE
   ========================= */

function openMobileMenu() {

    if (
        !mobileMenu ||
        !mobileMenuToggle
    ) {
        return;
    }

    isMobileMenuOpen = true;

    mobileMenu.classList.add(
        "is-open"
    );

    mobileMenuToggle.classList.add(
        "is-open"
    );

    document.body.classList.add(
        "mobile-menu-open"
    );

    mobileMenuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    mobileMenuToggle.setAttribute(
        "aria-label",
        "Close menu"
    );

}


/* =========================
   FERMER LE MENU MOBILE
   ========================= */

function closeMobileMenu() {

    if (
        !mobileMenu ||
        !mobileMenuToggle
    ) {
        return;
    }

    isMobileMenuOpen = false;

    mobileMenu.classList.remove(
        "is-open"
    );

    mobileMenuToggle.classList.remove(
        "is-open"
    );

    document.body.classList.remove(
        "mobile-menu-open"
    );

    resetMobileSubmenus();

    mobileMenuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    mobileMenuToggle.setAttribute(
        "aria-label",
        "Open menu"
    );

}


/* =========================
   BOUTON HAMBURGER
   ========================= */

if (
    mobileMenuToggle &&
    mobileMenu
) {

    mobileMenuToggle.addEventListener(
        "click",
        () => {

            if (isMobileMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

        }
    );

}


/* =========================
   SOUS-MENUS MOBILE
   ========================= */

mobileSubmenuToggles.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const group =
                    button.closest(
                        ".mobile-nav-group"
                    );

                if (!group) {
                    return;
                }

                const isOpen =
                    group.classList.contains(
                        "is-open"
                    );

                resetMobileSubmenus();

                if (!isOpen) {

                    group.classList.add(
                        "is-open"
                    );

                    button.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            }
        );

    }
);


/* =========================
   LIENS MOBILE
   ========================= */

mobileMenuLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    }
);

mobileSubmenuLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    }
);


/* =========================
   ÉCHAP POUR FERMER
   ========================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            isMobileMenuOpen
        ) {

            closeMobileMenu();

            mobileMenuToggle?.focus();

        }

    }
);


/* =========================
   RETOUR DESKTOP
   ========================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 1024 &&
            isMobileMenuOpen
        ) {

            closeMobileMenu();

        }

    }
);



/* =========================
   PRÉCHARGEMENT DES PAGES
   ========================= */

/*
    Objectif :
    rendre les clics entre les pages plus immédiats
    sans précharger les grosses images du portfolio.

    - Au survol / focus d'un lien local :
      le HTML cible est préchargé immédiatement.
    - Après quelques secondes d'inactivité :
      quelques pages locales sont préchargées doucement.
    - Désactivé si l'utilisateur a activé
      l'économie de données ou utilise une connexion 2G.
*/

const prefetchedPages =
    new Set();

function shouldPrefetchPages() {

    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (connection?.saveData) {
        return false;
    }

    const effectiveType =
        connection?.effectiveType || "";

    if (
        effectiveType === "slow-2g" ||
        effectiveType === "2g"
    ) {
        return false;
    }

    return true;
}


function getLocalHtmlUrl(link) {

    const href =
        link?.getAttribute("href");

    if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank"
    ) {
        return null;
    }

    try {

        const url =
            new URL(
                href,
                window.location.href
            );

        if (
            url.origin !==
            window.location.origin
        ) {
            return null;
        }

        const pathname =
            url.pathname.toLowerCase();

        const isHtmlPage =
            pathname.endsWith(".html") ||
            pathname.endsWith("/");

        if (!isHtmlPage) {
            return null;
        }

        url.hash = "";

        return url.href;

    } catch {

        return null;

    }

}


function prefetchPage(url) {

    if (
        !url ||
        !shouldPrefetchPages() ||
        prefetchedPages.has(url)
    ) {
        return;
    }

    prefetchedPages.add(url);

    const link =
        document.createElement("link");

    link.rel =
        "prefetch";

    link.href =
        url;

    document.head.appendChild(
        link
    );

}


function installLinkPrefetch() {

    if (!shouldPrefetchPages()) {
        return;
    }

    document.addEventListener(
        "pointerover",
        (event) => {

            const link =
                event.target.closest("a[href]");

            const url =
                getLocalHtmlUrl(link);

            if (url) {
                prefetchPage(url);
            }

        },
        {
            passive: true
        }
    );

    document.addEventListener(
        "focusin",
        (event) => {

            const link =
                event.target.closest("a[href]");

            const url =
                getLocalHtmlUrl(link);

            if (url) {
                prefetchPage(url);
            }

        }
    );

    document.addEventListener(
        "touchstart",
        (event) => {

            const link =
                event.target.closest("a[href]");

            const url =
                getLocalHtmlUrl(link);

            if (url) {
                prefetchPage(url);
            }

        },
        {
            passive: true
        }
    );

    const idlePrefetch = () => {

        const urls =
            [
                ...new Set(
                    Array
                        .from(
                            document.querySelectorAll(
                                "a[href]"
                            )
                        )
                        .map(getLocalHtmlUrl)
                        .filter(Boolean)
                )
            ]
            .slice(0, 8);

        urls.forEach(
            (url, index) => {

                setTimeout(
                    () => {
                        prefetchPage(url);
                    },
                    index * 250
                );

            }
        );

    };

    if (
        "requestIdleCallback" in window
    ) {

        window.requestIdleCallback(
            idlePrefetch,
            {
                timeout: 3500
            }
        );

    } else {

        setTimeout(
            idlePrefetch,
            2500
        );

    }

}

installLinkPrefetch();


/* =========================
   PORTFOLIO - NAVIGATION ACTIVE
   SCROLL + SOURIS
   ========================= */

const portfolioSections =
    document.querySelectorAll(
        ".portfolio-section"
    );

const portfolioCategoryLinks =
    document.querySelectorAll(
        ".portfolio-category-link"
    );


/* =========================
   ÉTAT DU PORTFOLIO
   ========================= */

let scrollActiveSection = null;
let hoveredSection = null;


/* =========================
   AFFICHER LA CATÉGORIE ACTIVE
   ========================= */

function setActivePortfolioCategory(
    sectionId
) {

    portfolioCategoryLinks.forEach(
        (link) => {

            const target =
                link.getAttribute(
                    "href"
                );

            const isActive =
                target ===
                `#${sectionId}`;

            link.classList.toggle(
                "is-active",
                isActive
            );

        }
    );

}


/* =========================
   CATÉGORIE ACTIVE AU SCROLL
   ========================= */

function updateActivePortfolioCategory() {

    if (
        portfolioSections.length === 0 ||
        portfolioCategoryLinks.length === 0
    ) {
        return;
    }

    const pageBottom =
        window.scrollY +
        window.innerHeight;

    const documentHeight =
        document
            .documentElement
            .scrollHeight;

    /*
        Si on arrive tout en bas
        de la page, la dernière
        catégorie devient active.
    */

    if (
        pageBottom >=
        documentHeight - 2
    ) {

        scrollActiveSection =
            portfolioSections[
                portfolioSections.length - 1
            ].id;

    } else {

        const readingPoint =
            window.scrollY +
            window.innerHeight * 0.35;

        scrollActiveSection =
            portfolioSections[0].id;

        portfolioSections.forEach(
            (section) => {

                if (
                    section.offsetTop <=
                    readingPoint
                ) {

                    scrollActiveSection =
                        section.id;

                }

            }
        );

    }

    /*
        La souris a priorité
        sur le scroll.
    */

    if (hoveredSection === null) {

        setActivePortfolioCategory(
            scrollActiveSection
        );

    }

}


/* =========================
   SOURIS SUR UNE CATÉGORIE
   ========================= */

const canHoverPortfolio =
    window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

if (canHoverPortfolio) {

    portfolioSections.forEach(
        (section) => {

            section.addEventListener(
                "mouseenter",
                () => {

                    hoveredSection =
                        section.id;

                    setActivePortfolioCategory(
                        hoveredSection
                    );

                }
            );

            section.addEventListener(
                "mouseleave",
                () => {

                    hoveredSection = null;

                    setActivePortfolioCategory(
                        scrollActiveSection
                    );

                }
            );

        }
    );

}


/* =========================
   ÉCOUTE DU SCROLL
   ========================= */

window.addEventListener(
    "scroll",
    updateActivePortfolioCategory,
    {
        passive: true
    }
);


/* =========================
   ÉTAT INITIAL
   ========================= */

updateActivePortfolioCategory();

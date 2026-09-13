/* =========================
   NAVIGATION MOBILE
   ========================= */

const mobileMenuToggle = document.querySelector(
    ".mobile-menu-toggle"
);

const mobileMenu = document.querySelector(
    ".mobile-menu"
);

const mobileMenuLinks = document.querySelectorAll(
    ".mobile-menu-link"
);

const mobileSubmenuLinks = document.querySelectorAll(
    ".mobile-submenu-link"
);

const mobileSubmenuToggles = document.querySelectorAll(
    ".mobile-submenu-toggle"
);

const MOBILE_MENU_TRANSITION_DURATION = 500;

let isMobileMenuOpen = false;
let mobileResumeTimer = null;


/* =========================
   OUVRIR LE MENU MOBILE
   ========================= */

function openMobileMenu() {

    isMobileMenuOpen = true;

    if (mobileResumeTimer !== null) {
        clearTimeout(mobileResumeTimer);
        mobileResumeTimer = null;
    }

    mobileMenu.classList.add("is-open");
    mobileMenuToggle.classList.add("is-open");

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

    isMobileMenuOpen = false;

    mobileMenu.classList.remove("is-open");
    mobileMenuToggle.classList.remove("is-open");


    document
        .querySelectorAll(".mobile-nav-group")
        .forEach((group) => {

            group.classList.remove("is-open");

            const toggle = group.querySelector(
                ".mobile-submenu-toggle"
            );

            if (toggle) {

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });


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

mobileMenuToggle.addEventListener("click", () => {

    if (isMobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }

});


/* =========================
   SOUS-MENUS MOBILE
   ========================= */

mobileSubmenuToggles.forEach((button) => {

    button.addEventListener("click", () => {

        const group =
            button.closest(".mobile-nav-group");

        const isOpen =
            group.classList.contains("is-open");


        document
            .querySelectorAll(".mobile-nav-group")
            .forEach((item) => {

                item.classList.remove("is-open");

                const toggle = item.querySelector(
                    ".mobile-submenu-toggle"
                );

                if (toggle) {

                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            });


        if (!isOpen) {

            group.classList.add("is-open");

            button.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

});


/* =========================
   LIENS MOBILE
   ========================= */

mobileMenuLinks.forEach((link) => {

    link.addEventListener("click", () => {

        closeMobileMenu();

    });

});


mobileSubmenuLinks.forEach((link) => {

    link.addEventListener("click", () => {

        closeMobileMenu();

    });

});

/* =========================
   PORTFOLIO - NAVIGATION ACTIVE
   SCROLL + SOURIS
   ========================= */

const portfolioSections = document.querySelectorAll(
    ".portfolio-section"
);

const portfolioCategoryLinks = document.querySelectorAll(
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

function setActivePortfolioCategory(sectionId) {

    portfolioCategoryLinks.forEach((link) => {

        const target =
            link.getAttribute("href");

        const isActive =
            target === `#${sectionId}`;

        link.classList.toggle(
            "is-active",
            isActive
        );

    });

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
        document.documentElement.scrollHeight;


    /* Si on arrive tout en bas de la page,
       la dernière catégorie devient active */

    if (pageBottom >= documentHeight - 2) {

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


        portfolioSections.forEach((section) => {

            if (section.offsetTop <= readingPoint) {

                scrollActiveSection =
                    section.id;

            }

        });

    }


    /* La souris a priorité sur le scroll */

    if (hoveredSection === null) {

        setActivePortfolioCategory(
            scrollActiveSection
        );

    }

}


/* =========================
   SOURIS SUR UNE CATÉGORIE
   ========================= */

const canHoverPortfolio = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;


if (canHoverPortfolio) {

    portfolioSections.forEach((section) => {

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

    });

}


/* =========================
   ÉCOUTE DU SCROLL
   ========================= */

window.addEventListener(
    "scroll",
    updateActivePortfolioCategory
);


/* =========================
   ÉTAT INITIAL
   ========================= */

updateActivePortfolioCategory();
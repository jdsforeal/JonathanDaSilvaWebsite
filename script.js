/* =========================
   HOMEPAGE SLIDESHOW
   ========================= */

const slides = [
    {
        src: "images/homepage-01.png",
        position: "center center"
    },
    {
        src: "images/homepage-02.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-03.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-04.jpg",
        position: "center center"
    }
];


/* =========================
   RÉGLAGES DU SLIDESHOW
   ========================= */

const SLIDE_DURATION = 5500;
const DESKTOP_RETURN_TRANSITION_DURATION = 2300;
const MOBILE_MENU_TRANSITION_DURATION = 500;


/* =========================
   ÉLÉMENTS DE LA PAGE
   ========================= */

const imageA = document.querySelector(".hero-image-a");
const imageB = document.querySelector(".hero-image-b");

const hero = document.querySelector(".hero");

const mainNav = document.querySelector(".main-nav");

const navLinks = document.querySelectorAll(
    ".nav-link[data-preview]"
);

const instagramLink = document.querySelector(
    ".instagram-link"
);

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


/* =========================
   ÉTAT DU SLIDESHOW
   ========================= */

let currentSlide = 0;

let visibleImage = imageA;
let hiddenImage = imageB;

let slideshowTimer = null;

let isNavPreviewActive = false;
let desktopResumeTimer = null;

let isMobileMenuOpen = false;
let mobileResumeTimer = null;


/* =========================
   FONDU VERS UNE IMAGE
   ========================= */

function crossfadeTo(src, position = "center center") {

    if (!src) {
        return;
    }

    const incomingImage = hiddenImage;
    const outgoingImage = visibleImage;

    function revealImage() {

        incomingImage.onload = null;

        incomingImage.classList.add("is-visible");
        outgoingImage.classList.remove("is-visible");

        visibleImage = incomingImage;
        hiddenImage = outgoingImage;

    }

    incomingImage.style.objectPosition = position;

    incomingImage.onload = revealImage;

    incomingImage.src = src;

    if (
        incomingImage.complete &&
        incomingImage.naturalWidth > 0
    ) {
        revealImage();
    }

}


/* =========================
   AFFICHER UNE IMAGE
   DU SLIDESHOW
   ========================= */

function showSlide(index) {

    const slide = slides[index];

    crossfadeTo(
        slide.src,
        slide.position
    );

}


/* =========================
   IMAGE SUIVANTE
   ========================= */

function nextSlide() {

    if (isNavPreviewActive || isMobileMenuOpen) {
        return;
    }

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);

}


/* =========================
   ARRÊTER LE SLIDESHOW
   ========================= */

function stopSlideshow() {

    if (slideshowTimer !== null) {

        clearTimeout(slideshowTimer);

        slideshowTimer = null;

    }

}


/* =========================
   DÉMARRER LE SLIDESHOW
   ========================= */

function startSlideshow() {

    stopSlideshow();

    if (isNavPreviewActive || isMobileMenuOpen) {
        return;
    }

    if (slides.length > 1) {

        slideshowTimer = setTimeout(() => {

            nextSlide();

            startSlideshow();

        }, SLIDE_DURATION);

    }

}

/* =========================
   ENTRER DANS LA NAVIGATION
   ========================= */

mainNav.addEventListener("mouseenter", () => {

    isNavPreviewActive = true;

    if (desktopResumeTimer !== null) {
        clearTimeout(desktopResumeTimer);
        desktopResumeTimer = null;
    }

    stopSlideshow();

});


/* =========================
   APERÇU NAVIGATION DESKTOP
   ========================= */

const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

if (canHover) {

    navLinks.forEach((link) => {

        link.addEventListener("mouseenter", () => {

            hero.classList.add("is-nav-preview");

            const previewImage = link.dataset.preview;

            const previewPosition =
                link.dataset.position || "center center";

            crossfadeTo(
                previewImage,
                previewPosition
            );

        });

    });


/* =========================
    PRÉCHARGEMENT DES IMAGES NAV
    ========================= */

    navLinks.forEach((link) => {

        const src = link.dataset.preview;

        if (src) {

            const image = new Image();

            image.src = src;

        }

    });

}


/* =========================
   INSTAGRAM
   ========================= */

instagramLink.addEventListener("mouseenter", () => {

    hero.classList.remove("is-nav-preview");

    showSlide(currentSlide);

});


/* =========================
   QUITTER LA NAVIGATION
   ========================= */

mainNav.addEventListener("mouseleave", () => {

    isNavPreviewActive = false;

    hero.classList.remove("is-nav-preview");

    showSlide(currentSlide);

    stopSlideshow();

    if (desktopResumeTimer !== null) {
        clearTimeout(desktopResumeTimer);
    }

    desktopResumeTimer = setTimeout(() => {

        startSlideshow();

        desktopResumeTimer = null;

    }, DESKTOP_RETURN_TRANSITION_DURATION);

});

/* =========================
   MENU MOBILE
   ========================= */

function openMobileMenu() {

    isMobileMenuOpen = true;

    if (mobileResumeTimer !== null) {
        clearTimeout(mobileResumeTimer);
        mobileResumeTimer = null;
    }

    stopSlideshow();

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

    if (mobileResumeTimer !== null) {
        clearTimeout(mobileResumeTimer);
    }

    mobileResumeTimer = setTimeout(() => {

        if (!isMobileMenuOpen) {
            startSlideshow();
        }

        mobileResumeTimer = null;

    }, MOBILE_MENU_TRANSITION_DURATION);

}


mobileMenuToggle.addEventListener("click", () => {

        if (isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }

    });

mobileSubmenuToggles.forEach((button) => {

    button.addEventListener("click", () => {

        const group = button.closest(".mobile-nav-group");

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
LANCEMENT INITIAL
========================= */

startSlideshow();
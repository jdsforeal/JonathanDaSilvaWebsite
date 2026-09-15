/* =========================
   HOMEPAGE SLIDESHOW
   ========================= */

const slides = [
    {
        src: "images/homepage-slides/homepage-01.png",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-02.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-03.png",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-04.png",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-05.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-06.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-07.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-08.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-09.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-10.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-11.png",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-12.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-13.png",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-14.png",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-15.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-16.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-17.png",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-18.jpg",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-19.png",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-20.png",
        position: "center center"
    },
    {
        src: "images/homepage-slides/homepage-21.png",
        position: "center center"
    },
];

/* =========================
   RESPONSIVE IMAGES — HOME
   ========================= */

const HOMEPAGE_RESPONSIVE_IMAGE_MAP = {
    "images/homepage-about.png": {
        "master": "images/homepage-about.jpg",
        "small": "images-small/homepage-about.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-contact.jpg": {
        "master": "images/homepage-contact.jpg",
        "small": "images-small/homepage-contact.jpg",
        "masterWidth": 2592,
        "smallWidth": 1600
    },
    "images/homepage-home.jpg": {
        "master": "images/homepage-home.jpg",
        "small": "images-small/homepage-home.jpg",
        "masterWidth": 2592,
        "smallWidth": 1600
    },
    "images/homepage-showreel.PNG": {
        "master": "images/homepage-showreel.jpg",
        "small": "images-small/homepage-showreel.jpg",
        "masterWidth": 3068,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-01.png": {
        "master": "images/homepage-slides/homepage-01.jpg",
        "small": "images-small/homepage-slides/homepage-01.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-02.jpg": {
        "master": "images/homepage-slides/homepage-02.jpg",
        "small": "images-small/homepage-slides/homepage-02.jpg",
        "masterWidth": 2554,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-03.png": {
        "master": "images/homepage-slides/homepage-03.jpg",
        "small": "images-small/homepage-slides/homepage-03.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-04.png": {
        "master": "images/homepage-slides/homepage-04.jpg",
        "small": "images-small/homepage-slides/homepage-04.jpg",
        "masterWidth": 3068,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-05.jpg": {
        "master": "images/homepage-slides/homepage-05.jpg",
        "small": "images-small/homepage-slides/homepage-05.jpg",
        "masterWidth": 2592,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-06.jpg": {
        "master": "images/homepage-slides/homepage-06.jpg",
        "small": "images-small/homepage-slides/homepage-06.jpg",
        "masterWidth": 3072,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-07.jpg": {
        "master": "images/homepage-slides/homepage-07.jpg",
        "small": "images-small/homepage-slides/homepage-07.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-08.jpg": {
        "master": "images/homepage-slides/homepage-08.jpg",
        "small": "images-small/homepage-slides/homepage-08.jpg",
        "masterWidth": 1920,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-09.jpg": {
        "master": "images/homepage-slides/homepage-09.jpg",
        "small": "images-small/homepage-slides/homepage-09.jpg",
        "masterWidth": 3072,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-10.jpg": {
        "master": "images/homepage-slides/homepage-10.jpg",
        "small": "images-small/homepage-slides/homepage-10.jpg",
        "masterWidth": 1440,
        "smallWidth": 1440
    },
    "images/homepage-slides/homepage-11.png": {
        "master": "images/homepage-slides/homepage-11.jpg",
        "small": "images-small/homepage-slides/homepage-11.jpg",
        "masterWidth": 2880,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-12.jpg": {
        "master": "images/homepage-slides/homepage-12.jpg",
        "small": "images-small/homepage-slides/homepage-12.jpg",
        "masterWidth": 1920,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-13.png": {
        "master": "images/homepage-slides/homepage-13.jpg",
        "small": "images-small/homepage-slides/homepage-13.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-14.png": {
        "master": "images/homepage-slides/homepage-14.jpg",
        "small": "images-small/homepage-slides/homepage-14.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-15.jpg": {
        "master": "images/homepage-slides/homepage-15.jpg",
        "small": "images-small/homepage-slides/homepage-15.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-16.jpg": {
        "master": "images/homepage-slides/homepage-16.jpg",
        "small": "images-small/homepage-slides/homepage-16.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-17.png": {
        "master": "images/homepage-slides/homepage-17.jpg",
        "small": "images-small/homepage-slides/homepage-17.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-18.jpg": {
        "master": "images/homepage-slides/homepage-18.jpg",
        "small": "images-small/homepage-slides/homepage-18.jpg",
        "masterWidth": 1466,
        "smallWidth": 1466
    },
    "images/homepage-slides/homepage-19.png": {
        "master": "images/homepage-slides/homepage-19.jpg",
        "small": "images-small/homepage-slides/homepage-19.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-20.png": {
        "master": "images/homepage-slides/homepage-20.jpg",
        "small": "images-small/homepage-slides/homepage-20.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/homepage-slides/homepage-21.png": {
        "master": "images/homepage-slides/homepage-21.jpg",
        "small": "images-small/homepage-slides/homepage-21.jpg",
        "masterWidth": 3200,
        "smallWidth": 1600
    },
    "images/latecheckout-poster.jpg": {
        "master": "images/latecheckout-poster.jpg",
        "small": "images-small/latecheckout-poster.jpg",
        "masterWidth": 1600,
        "smallWidth": 960
    }
};


function getHomepageResponsiveImageInfo(path) {

    if (!path) {
        return {
            master: "",
            small: "",
            masterWidth: 0,
            smallWidth: 0
        };
    }

    return (
        HOMEPAGE_RESPONSIVE_IMAGE_MAP[path] || {
            master: path,
            small: path,
            masterWidth: 0,
            smallWidth: 0
        }
    );

}


function applyHomepageResponsiveImage(
    imageElement,
    logicalPath,
    priority = "auto"
) {

    if (!imageElement) {
        return;
    }

    const info =
        getHomepageResponsiveImageInfo(
            logicalPath
        );

    imageElement.sizes =
        "100vw";

    if (
        info.small &&
        info.master &&
        info.smallWidth > 0 &&
        info.masterWidth > info.smallWidth
    ) {

        imageElement.srcset =
            `${info.small} ${info.smallWidth}w, ` +
            `${info.master} ${info.masterWidth}w`;

    } else {

        imageElement.removeAttribute(
            "srcset"
        );

    }

    if ("fetchPriority" in imageElement) {
        imageElement.fetchPriority =
            priority;
    }

    imageElement.src =
        info.master || logicalPath;

}



/* =========================
   RÉGLAGES DU SLIDESHOW
   ========================= */

const SLIDE_DURATION = 5500;
const DESKTOP_RETURN_TRANSITION_DURATION = 2300;
const MOBILE_MENU_TRANSITION_DURATION = 500;

/*
    PERFORMANCE

    On ne précharge plus les 20 images du slideshow
    en même temps au lancement de la page.

    On garde seulement quelques images d'avance.
    Le reste est préchargé progressivement pendant
    que le visiteur regarde le site.
*/

const SLIDES_PRELOAD_AHEAD = 3;
const NAV_PRELOAD_START_DELAY = 1800;
const NAV_PRELOAD_STEP_DELAY = 650;


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
   PRÉCHARGEMENT PROGRESSIF
   ========================= */

const preloadedImageSources =
    new Set();

function preloadImage(
    src,
    priority = "low"
) {

    if (
        !src ||
        preloadedImageSources.has(src)
    ) {
        return;
    }

    preloadedImageSources.add(src);

    const image =
        new Image();

    image.decoding =
        "async";

    applyHomepageResponsiveImage(
        image,
        src,
        priority
    );

}


function preloadUpcomingSlides(
    fromIndex
) {

    if (slides.length <= 1) {
        return;
    }

    for (
        let offset = 1;
        offset <= SLIDES_PRELOAD_AHEAD;
        offset++
    ) {

        const index =
            (
                fromIndex +
                offset
            ) %
            slides.length;

        preloadImage(
            slides[index].src
        );

    }

}


function scheduleNavPreviewPreload() {

    if (!canHover) {
        return;
    }

    const previewSources =
        [
            ...new Set(
                Array
                    .from(navLinks)
                    .map(
                        (link) =>
                            link.dataset.preview
                    )
                    .filter(Boolean)
            )
        ];

    previewSources.forEach(
        (
            src,
            index
        ) => {

            setTimeout(
                () => {

                    preloadImage(
                        src
                    );

                },
                NAV_PRELOAD_START_DELAY +
                (
                    index *
                    NAV_PRELOAD_STEP_DELAY
                )
            );

        }
    );

}


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

    applyHomepageResponsiveImage(
        incomingImage,
        src,
        "high"
    );

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

    preloadUpcomingSlides(
        currentSlide
    );

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

            preloadImage(
                previewImage,
                "high"
            );

            crossfadeTo(
                previewImage,
                previewPosition
            );

        });

    });


/* =========================
    PRÉCHARGEMENT DES IMAGES NAV
    ========================= */

    /*
        Les aperçus de navigation sont chargés
        progressivement au lieu de partir tous
        en même temps au chargement de la Home.
    */

    scheduleNavPreviewPreload();

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
   INITIALISATION DU SLIDESHOW
   ========================= */

function initializeSlideshow() {

    if (
        slides.length === 0 ||
        !imageA ||
        !imageB
    ) {
        return;
    }

    const firstSlide =
        slides[0];

    currentSlide = 0;

    applyHomepageResponsiveImage(
        imageA,
        firstSlide.src,
        "high"
    );

    imageA.style.objectPosition =
        firstSlide.position ||
        "center center";

    imageA.classList.add(
        "is-visible"
    );

    imageB.classList.remove(
        "is-visible"
    );

    visibleImage =
        imageA;

    hiddenImage =
        imageB;


    /*
        La première image est prioritaire.
        Ensuite on ne garde que quelques slides
        d'avance pour éviter de télécharger toute
        la Home d'un seul coup.
    */

    preloadedImageSources.add(
        firstSlide.src
    );

    preloadUpcomingSlides(
        currentSlide
    );


    startSlideshow();
}


/* =========================
   LANCEMENT INITIAL
   ========================= */

initializeSlideshow();
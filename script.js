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

setInterval(nextSlide, 5500);


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


/* =========================
   ÉTAT DU SLIDESHOW
   ========================= */

let currentSlide = 0;

let visibleImage = imageA;
let hiddenImage = imageB;

let slideshowTimer = null;

let isNavPreviewActive = false;


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

    if (isNavPreviewActive) {
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

    if (isNavPreviewActive) {
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

    stopSlideshow();

});


/* =========================
   APERÇU NAVIGATION
   ========================= */

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
   PRÉCHARGEMENT
   DES IMAGES DE NAVIGATION
   ========================= */

navLinks.forEach((link) => {

    const src = link.dataset.preview;

    if (src) {

        const image = new Image();

        image.src = src;

    }

});


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

    setTimeout(() => {

        startSlideshow();

    }, 2300);

});


/* =========================
   LANCEMENT INITIAL
   ========================= */

startSlideshow();
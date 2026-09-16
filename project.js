/* =========================
   PAGE PROJET
   ========================= */

const GALLERY_SCROLL_SPEED = 1;
const GALLERY_HOLD_RATIO = 0.35;

const COMPACT_GALLERY_MEDIA = window.matchMedia(
    "(max-width: 768px), (max-height: 560px) and (orientation: landscape) and (pointer: coarse)"
);

function isCompactGalleryMode() {
    return COMPACT_GALLERY_MEDIA.matches;
}

const CATEGORY_META = {
    films: {
        label: "Films",
        page: "films.html"
    },
    "music-videos": {
        label: "Music Videos",
        page: "music-videos.html"
    },
    commercials: {
        label: "Commercials",
        page: "commercials.html"
    }
};

/* =========================
   PROJET COURANT
   ========================= */

function getProjectSlug() {
    const explicitSlug =
        document.body.dataset.project?.trim();

    if (explicitSlug) {
        return explicitSlug;
    }

    const fileName =
        window.location.pathname
            .split("/")
            .pop() || "";

    return decodeURIComponent(fileName)
        .replace(/\.html?$/i, "")
        .trim();
}

const projectSlug = getProjectSlug();

const currentProject = projects.find(
    (project) => project.slug === projectSlug
);

/* =========================
   ÉLÉMENTS DE LA PAGE
   ========================= */

const projectTitle = document.querySelector("[data-project-title]");
const projectSecondary = document.querySelector("[data-project-secondary]");
const projectBackLink = document.querySelector(".project-back-link");

const projectDetailsSection = document.querySelector(".project-details");
const projectDetailsContent = document.querySelector("[data-project-details]");

const projectDetail = document.querySelector(".project-detail");
const legacyProjectNext = document.querySelector(".project-next");
let projectNavigation = document.querySelector("[data-project-navigation]");

const gallerySection = document.querySelector("[data-project-gallery-section]");
const gallerySticky = document.querySelector(".project-gallery-sticky");
const galleryViewport = document.querySelector(".project-gallery-viewport");
const galleryTrack = document.querySelector("[data-project-gallery]");
const galleryProgress = document.querySelector("[data-gallery-progress]");
const galleryCurrent = document.querySelector("[data-gallery-current]");
const galleryTotal = document.querySelector("[data-gallery-total]");

const lightbox = document.querySelector("[data-project-lightbox]");
const lightboxMedia = document.querySelector(".project-lightbox-media");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const lightboxCurrent = document.querySelector("[data-lightbox-current]");
const lightboxTotal = document.querySelector("[data-lightbox-total]");

const lightboxItems =
    currentProject?.gallery?.filter((item) => item.type === "image") || [];

let lightboxIndex = 0;
let galleryScrollFrame = null;
let lightboxTouchStartX = null;
let lightboxTouchStartY = null;

/* =========================
   CHEMINS DES MÉDIAS
   ========================= */

function getProjectAssetPath(path) {
    if (!path) return "";

    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("//") ||
        path.startsWith("data:") ||
        path.startsWith("blob:") ||
        path.startsWith("/")
    ) {
        return path;
    }

    const marker = "/projects/";
    const pathname = window.location.pathname;
    const markerIndex = pathname.lastIndexOf(marker);

    if (markerIndex === -1) {
        return path;
    }

    const afterProjects = pathname.slice(markerIndex + marker.length);
    const folderDepth = Math.max(0, afterProjects.split("/").length - 1);
    const rootPrefix = "../".repeat(folderDepth + 1);
    const cleanPath = path.replace(/^\.\/+/, "").replace(/^(\.\.\/)+/, "");

    return `${rootPrefix}${cleanPath}`;
}


function getProjectResponsiveImageInfo(path) {

    const info =
        typeof getResponsiveImageInfo === "function"
            ? getResponsiveImageInfo(path)
            : {
                master: path,
                small: path,
                masterWidth: 0,
                smallWidth: 0
            };

    return {
        master:
            getProjectAssetPath(
                info.master || path
            ),

        small:
            getProjectAssetPath(
                info.small || info.master || path
            ),

        masterWidth:
            Number(info.masterWidth || 0),

        smallWidth:
            Number(info.smallWidth || 0)
    };

}


function applyProjectResponsiveImage(
    imageElement,
    logicalPath,
    sizes = "1280px"
) {

    if (!imageElement) {
        return;
    }

    const info =
        getProjectResponsiveImageInfo(
            logicalPath
        );

    imageElement.sizes =
        sizes;

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

    imageElement.src =
        info.master;

}

/* =========================
   VIMEO
   ========================= */

/*
    Vimeo fournit sa propre API pour demander le plein écran.
    C'est plus fiable sur mobile (notamment Safari/iPhone)
    que requestFullscreen() appliqué directement à notre <div>.
*/
const vimeoPlayerApiReady = new Promise((resolve, reject) => {
    if (window.Vimeo && window.Vimeo.Player) {
        resolve(window.Vimeo);
        return;
    }

    const existingScript = document.querySelector(
        'script[src="https://player.vimeo.com/api/player.js"]'
    );

    if (existingScript) {
        existingScript.addEventListener("load", () => {
            if (window.Vimeo && window.Vimeo.Player) {
                resolve(window.Vimeo);
            } else {
                reject(new Error("Vimeo Player API unavailable."));
            }
        }, { once: true });

        existingScript.addEventListener(
            "error",
            () => reject(new Error("Unable to load Vimeo Player API.")),
            { once: true }
        );

        return;
    }

    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;

    script.addEventListener("load", () => {
        if (window.Vimeo && window.Vimeo.Player) {
            resolve(window.Vimeo);
        } else {
            reject(new Error("Vimeo Player API unavailable."));
        }
    }, { once: true });

    script.addEventListener(
        "error",
        () => reject(new Error("Unable to load Vimeo Player API.")),
        { once: true }
    );

    document.head.appendChild(script);
});

function getVimeoEmbedUrl(item) {
    const videoId = String(item?.id || "").trim();

    if (!videoId) {
        return "";
    }

    const params = new URLSearchParams();

    /*
        Une vidéo Vimeo "Unlisted" peut fournir
        un hash de confidentialité. Vimeo demande
        que ce hash soit placé en premier dans l'URL.
    */
    const privacyHash = String(item?.hash || "").trim();

    if (privacyHash) {
        params.set("h", privacyHash);
    }

    /*
        Réglages sobres pour le portfolio :
        - pas de titre / auteur superposés
        - une seule vidéo joue à la fois
        - DNT activé côté player
        - plein écran autorisé
    */
    params.set("title", "0");
    params.set("byline", "0");
    params.set("autopause", "1");
    params.set("dnt", "1");
    params.set("fullscreen", "1");

    return (
        `https://player.vimeo.com/video/${encodeURIComponent(videoId)}` +
        `?${params.toString()}`
    );
}

/* =========================
   INFORMATIONS DU PROJET
   ========================= */

function getPrimaryInfo(project) {
    if (!project) return "";

    /*
        MUSIC VIDEOS
        Le titre et l'artiste sont affichés
        au même niveau, séparés par "/".

        Exemple :
        FIRE CRACKER / ÉMILIE FRANCO
    */
    if (
        project.category === "music-videos" &&
        project.artist
    ) {
        return `${project.title} / ${project.artist}`;
    }

    /*
        COMMERCIALS
        Le titre et le client sont affichés
        au même niveau, séparés par "/".

        Exemple :
        "LATE CHECKOUT" / BELLEROSE
    */
    if (
        project.category === "commercials" &&
        project.client
    ) {
        return `${project.title} / ${project.client}`;
    }

    /*
        FILMS / autres catégories
        gardent leur titre habituel.
    */
    return project.title || "";
}

function getSecondaryInfo(project) {
    if (!project) return "";

    /*
        Le réalisateur garde exactement
        le même traitement que sur les films.
    */
    if (project.director) {
        return `Directed by ${project.director}`;
    }

    /*
        Sur un Music Video, l'artiste est déjà
        affiché dans le titre principal.
        On évite donc de le répéter ici.
    */
    if (
        project.category === "music-videos" ||
        project.category === "commercials"
    ) {
        return "";
    }

    /*
        Compatibilité avec les autres catégories.
    */
    if (project.client) return project.client;
    if (project.artist) return project.artist;

    return "";
}

function renderProjectInfo() {
    if (!currentProject) return;

    const primaryInfo =
        getPrimaryInfo(currentProject);

    if (projectTitle) {
        projectTitle.textContent =
            primaryInfo;
    }

    if (projectSecondary) {
        projectSecondary.textContent =
            getSecondaryInfo(currentProject);
    }

    document.title =
        `${primaryInfo} — Jonathan Da Silva`;
}

/* =========================
   CATÉGORIE / NAVIGATION
   ========================= */

function renderProjectCategoryNavigation() {
    if (!currentProject) return;

    const categoryMeta = CATEGORY_META[currentProject.category];
    if (!categoryMeta) return;

    if (projectBackLink) {
        projectBackLink.href = getProjectAssetPath(categoryMeta.page);
        projectBackLink.textContent = `← Back to ${categoryMeta.label}`;
    }

    const categoryLinks = document.querySelectorAll(
        ".nav-dropdown .dropdown-link, .mobile-submenu .mobile-submenu-link"
    );

    categoryLinks.forEach((link) => {
        const href = link.getAttribute("href");
        const isCurrentCategory = href === categoryMeta.page;
        link.classList.toggle("is-active", isCurrentCategory);
    });
}

/* =========================
   GALERIE — CRÉATION
   ========================= */

function createGallerySlide(item, index) {
    const slide = document.createElement("div");
    slide.className = "project-gallery-slide";
    slide.dataset.slideIndex = index;

    if (item.type === "image") {
        const image = document.createElement("img");

        image.alt =
            item.alt || currentProject.title;

        image.loading =
            index === 0
                ? "eager"
                : "lazy";

        image.decoding =
            "async";

        if (
            index === 0 &&
            "fetchPriority" in image
        ) {
            image.fetchPriority =
                "high";
        }

        applyProjectResponsiveImage(
            image,
            item.src,
            "(max-width: 768px) 92vw, (max-width: 1024px) 88vw, 1280px"
        );

        const imageLightboxIndex = lightboxItems.indexOf(item);

        image.setAttribute("role", "button");
        image.setAttribute("tabindex", "0");
        image.setAttribute(
            "aria-label",
            `Open ${image.alt} full screen`
        );

        image.addEventListener("click", () => {
            openLightbox(imageLightboxIndex);
        });

        image.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(imageLightboxIndex);
            }
        });

        slide.appendChild(image);
    }

    if (item.type === "video") {
        if (!item.src && item.poster) {
            const poster = document.createElement("img");

            poster.alt =
                `${currentProject.title} — Video`;

            poster.loading =
                index === 0
                    ? "eager"
                    : "lazy";

            poster.decoding =
                "async";

            applyProjectResponsiveImage(
                poster,
                item.poster,
                "(max-width: 768px) 92vw, (max-width: 1024px) 88vw, 1280px"
            );

            slide.appendChild(poster);
        }

        if (item.src) {
            const video = document.createElement("video");
            video.src = getProjectAssetPath(item.src);

            if (item.poster) {
                const posterInfo =
                    getProjectResponsiveImageInfo(
                        item.poster
                    );

                video.poster =
                    posterInfo.master;
            }

            video.controls = true;
            video.playsInline = true;
            video.preload = "metadata";
            slide.appendChild(video);
        }
    }

    if (item.type === "vimeo") {
        const embedUrl = getVimeoEmbedUrl(item);

        if (embedUrl) {
            const frame = document.createElement("div");
            frame.className = "project-video-frame";

            const iframe = document.createElement("iframe");
            iframe.className = "project-vimeo-player";
            iframe.src = embedUrl;
            iframe.title = `${currentProject.title} — Video`;
            iframe.loading = index === 0 ? "eager" : "lazy";
            iframe.allow =
                "autoplay; fullscreen; picture-in-picture; clipboard-write";
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";

            const fullscreenButton = document.createElement("button");
            fullscreenButton.className = "project-video-fullscreen";
            fullscreenButton.type = "button";
            fullscreenButton.setAttribute("aria-label", "Open video fullscreen");
            fullscreenButton.innerHTML = `
                <span class="project-video-fullscreen-label">FULLSCREEN</span>
                <svg
                    class="project-video-fullscreen-icon"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M7 3H3v4 M13 3h4v4 M17 13v4h-4 M7 17H3v-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="square"
                        stroke-linejoin="miter"
                    />
                </svg>
            `;

            let vimeoPlayer = null;

            /*
                On ne montre le bouton personnalisé qu'une fois
                l'API Vimeo réellement disponible.
            */
            fullscreenButton.hidden = true;

            vimeoPlayerApiReady
                .then((Vimeo) => {
                    vimeoPlayer = new Vimeo.Player(iframe);
                    fullscreenButton.hidden = false;
                })
                .catch(() => {
                    /*
                        Si l'API Vimeo ne charge pas, le player Vimeo
                        conserve malgré tout son propre bouton fullscreen.
                    */
                    fullscreenButton.remove();
                });

            fullscreenButton.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (!vimeoPlayer) {
                    return;
                }

                vimeoPlayer
                    .requestFullscreen()
                    .catch(() => {
                        /*
                            Fallback desktop / navigateurs compatibles.
                            Sur iPhone, Vimeo gère normalement lui-même
                            l'entrée en plein écran via son API.
                        */
                        if (iframe.requestFullscreen) {
                            return iframe.requestFullscreen();
                        }

                        if (iframe.webkitRequestFullscreen) {
                            return iframe.webkitRequestFullscreen();
                        }

                        return undefined;
                    });
            });

            frame.append(iframe, fullscreenButton);
            slide.appendChild(frame);
        } else if (item.poster) {
            /*
                Tant que l'ID Vimeo n'est pas renseigné,
                le projet peut rester parfaitement propre
                en affichant simplement son poster.
            */
            const poster = document.createElement("img");

            poster.alt =
                `${currentProject.title} — Video`;

            poster.loading =
                index === 0
                    ? "eager"
                    : "lazy";

            poster.decoding =
                "async";

            applyProjectResponsiveImage(
                poster,
                item.poster,
                "(max-width: 768px) 92vw, (max-width: 1024px) 88vw, 1280px"
            );

            slide.appendChild(poster);
        }
    }

    return slide;
}

function renderGallery() {
    const galleryItems = currentProject?.gallery || [];

    if (!gallerySection || !galleryTrack || galleryItems.length === 0) {
        if (gallerySection) gallerySection.hidden = true;
        return;
    }

    gallerySection.hidden = false;
    galleryTrack.innerHTML = "";

    galleryItems.forEach((item, index) => {
        galleryTrack.appendChild(createGallerySlide(item, index));
    });

    if (galleryTotal) {
        galleryTotal.textContent = String(galleryItems.length).padStart(2, "0");
    }

    if (galleryCurrent) {
        galleryCurrent.textContent = "01";
    }

    requestAnimationFrame(() => {
        updateGalleryLayout();
        updateGalleryFromScroll();
    });
}

/* =========================
   GALERIE — DIMENSIONS
   ========================= */

function getMaximumTranslation() {
    if (!galleryTrack || !galleryViewport) return 0;

    return Math.max(
        0,
        galleryTrack.scrollWidth - galleryViewport.clientWidth
    );
}

function getGalleryHoldDistance() {
    return window.innerHeight * GALLERY_HOLD_RATIO;
}

function getGalleryStickyTop() {
    if (!gallerySticky) return 0;

    const parsedTop = parseFloat(
        window.getComputedStyle(gallerySticky).top
    );

    return Number.isFinite(parsedTop) ? parsedTop : 0;
}

function updateGalleryLayout() {
    if (!gallerySection || !gallerySticky || !galleryTrack || !galleryViewport) {
        return;
    }

    if (isCompactGalleryMode()) {
        gallerySection.style.removeProperty("--project-gallery-height");
        galleryTrack.style.transform = "none";
        updateCompactGalleryIndicator();
        return;
    }

    const maximumTranslation = getMaximumTranslation();

    if (maximumTranslation <= 0) {
        gallerySection.style.setProperty(
            "--project-gallery-height",
            `${gallerySticky.offsetHeight}px`
        );
        return;
    }

    const verticalTravel = maximumTranslation / GALLERY_SCROLL_SPEED;
    const holdDistance = getGalleryHoldDistance();
    const galleryHeight =
        gallerySticky.offsetHeight + holdDistance + verticalTravel;

    gallerySection.style.setProperty(
        "--project-gallery-height",
        `${galleryHeight}px`
    );
}

function getGalleryProgress() {
    if (!gallerySection || !gallerySticky) return 0;

    const sectionRect = gallerySection.getBoundingClientRect();
    const stickyTop = getGalleryStickyTop();
    const maximumVerticalTravel =
        gallerySection.offsetHeight - gallerySticky.offsetHeight;

    if (maximumVerticalTravel <= 0) return 0;

    const travelled = stickyTop - sectionRect.top;
    const holdDistance = getGalleryHoldDistance();

    if (travelled <= holdDistance) return 0;

    const horizontalTravel = maximumVerticalTravel - holdDistance;
    if (horizontalTravel <= 0) return 0;

    const progress =
        (travelled - holdDistance) / horizontalTravel;

    return Math.min(1, Math.max(0, progress));
}

function updateCompactGalleryIndicator() {
    if (!galleryViewport || !galleryTrack) return;

    const slides = galleryTrack.querySelectorAll(".project-gallery-slide");
    if (slides.length === 0) return;

    const viewportCenter =
        galleryViewport.scrollLeft + galleryViewport.clientWidth / 2;

    let activeIndex = 0;
    let smallestDistance = Infinity;

    slides.forEach((slide, index) => {
        const slideCenter =
            slide.offsetLeft + slide.offsetWidth / 2;

        const distance = Math.abs(slideCenter - viewportCenter);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            activeIndex = index;
        }
    });

    const maxScroll =
        Math.max(1, galleryViewport.scrollWidth - galleryViewport.clientWidth);

    const progress =
        Math.min(1, Math.max(0, galleryViewport.scrollLeft / maxScroll));

    if (galleryProgress) {
        galleryProgress.style.transform = `scaleX(${progress})`;
    }

    if (galleryCurrent) {
        galleryCurrent.textContent =
            String(activeIndex + 1).padStart(2, "0");
    }
}

function getActiveSlideIndex(horizontalTranslation) {
    if (!galleryTrack || !galleryViewport) return 0;

    const slides = galleryTrack.querySelectorAll(".project-gallery-slide");
    if (slides.length === 0) return 0;

    const viewportCenter = galleryViewport.clientWidth / 2;
    let activeIndex = 0;
    let smallestDistance = Infinity;

    slides.forEach((slide, index) => {
        const slideCenter =
            slide.offsetLeft +
            slide.offsetWidth / 2 -
            horizontalTranslation;

        const distance = Math.abs(slideCenter - viewportCenter);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            activeIndex = index;
        }
    });

    return activeIndex;
}

function updateGalleryFromScroll() {
    if (!galleryTrack || !gallerySection || gallerySection.hidden) return;

    if (isCompactGalleryMode()) {
        galleryTrack.style.transform = "none";
        updateCompactGalleryIndicator();
        return;
    }

    const progress = getGalleryProgress();
    const maximumTranslation = getMaximumTranslation();
    const horizontalTranslation = progress * maximumTranslation;

    galleryTrack.style.transform =
        `translate3d(${-horizontalTranslation}px, 0, 0)`;

    if (galleryProgress) {
        galleryProgress.style.transform = `scaleX(${progress})`;
    }

    if (galleryCurrent) {
        const activeIndex = getActiveSlideIndex(horizontalTranslation);
        galleryCurrent.textContent =
            String(activeIndex + 1).padStart(2, "0");
    }
}

/* =========================
   LIGHTBOX
   ========================= */

function syncMainGalleryToLightbox() {
    if (
        !gallerySection ||
        !gallerySticky ||
        !galleryTrack ||
        !galleryViewport ||
        lightboxItems.length === 0
    ) {
        return;
    }

    const currentLightboxItem = lightboxItems[lightboxIndex];
    const galleryIndex = currentProject.gallery.indexOf(currentLightboxItem);

    if (galleryIndex < 0) return;

    const slide = galleryTrack.querySelector(
        `[data-slide-index="${galleryIndex}"]`
    );

    if (!slide) return;

    if (isCompactGalleryMode()) {
        const desiredScrollLeft = Math.max(
            0,
            slide.offsetLeft -
            (galleryViewport.clientWidth - slide.offsetWidth) / 2
        );

        galleryViewport.scrollTo({
            left: desiredScrollLeft,
            behavior: "auto"
        });

        updateCompactGalleryIndicator();
        return;
    }

    const maximumTranslation = getMaximumTranslation();
    const viewportCenter = galleryViewport.clientWidth / 2;

    const desiredTranslation = Math.min(
        maximumTranslation,
        Math.max(
            0,
            slide.offsetLeft + slide.offsetWidth / 2 - viewportCenter
        )
    );

    const progress =
        maximumTranslation > 0
            ? desiredTranslation / maximumTranslation
            : 0;

    const stickyTop = getGalleryStickyTop();
    const holdDistance = getGalleryHoldDistance();
    const maximumVerticalTravel =
        gallerySection.offsetHeight - gallerySticky.offsetHeight;
    const horizontalTravel = maximumVerticalTravel - holdDistance;

    if (horizontalTravel <= 0) return;

    const sectionTop =
        window.scrollY + gallerySection.getBoundingClientRect().top;

    const targetScrollY =
        sectionTop -
        stickyTop +
        holdDistance +
        progress * horizontalTravel;

    window.scrollTo({
        top: targetScrollY,
        behavior: "auto"
    });

    updateGalleryFromScroll();
}

function updateLightbox() {
    if (!lightboxImage || lightboxItems.length === 0) return;

    const item = lightboxItems[lightboxIndex];

    const responsiveItem =
        getProjectResponsiveImageInfo(
            item.src
        );

    lightboxImage.removeAttribute(
        "srcset"
    );

    lightboxImage.removeAttribute(
        "sizes"
    );

    lightboxImage.src =
        responsiveItem.master;

    lightboxImage.alt =
        item.alt || currentProject.title;

    if (lightboxCurrent) {
        lightboxCurrent.textContent =
            String(lightboxIndex + 1).padStart(2, "0");
    }

    if (lightboxTotal) {
        lightboxTotal.textContent =
            String(lightboxItems.length).padStart(2, "0");
    }
}

function openLightbox(index) {
    if (!lightbox || lightboxItems.length === 0 || index < 0) return;

    lightboxIndex = index;
    updateLightbox();

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
}

function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
}

function showPreviousLightboxImage() {
    if (lightboxItems.length === 0) return;

    lightboxIndex =
        (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;

    updateLightbox();
    syncMainGalleryToLightbox();
}

function showNextLightboxImage() {
    if (lightboxItems.length === 0) return;

    lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;

    updateLightbox();
    syncMainGalleryToLightbox();
}

/* =========================
   PROJECT DETAILS / CREW
   ========================= */

function createDetailItem(item) {
    const detailItem = document.createElement("div");
    detailItem.className = "project-detail-item";

    const label = document.createElement("p");
    label.className = "project-detail-label";
    label.textContent = item.label;

    const value = document.createElement("p");
    value.className = "project-detail-value";
    value.textContent = item.value;

    detailItem.append(label, value);
    return detailItem;
}

function getFilledItems(items) {
    return (items || []).filter((item) => {
        return item?.value && String(item.value).trim() !== "";
    });
}

function renderProjectDetails() {
    if (!currentProject || !projectDetailsContent) return;

    projectDetailsContent.innerHTML = "";

    const details = getFilledItems(currentProject.details);
    const crew = getFilledItems(currentProject.crew);

    if (details.length === 0 && crew.length === 0) {
        if (projectDetailsSection) projectDetailsSection.hidden = true;
        return;
    }

    if (projectDetailsSection) projectDetailsSection.hidden = false;

    if (details.length > 0) {
        const detailsGrid = document.createElement("div");
        detailsGrid.className = "project-details-grid";

        details.forEach((item) => {
            detailsGrid.appendChild(createDetailItem(item));
        });

        projectDetailsContent.appendChild(detailsGrid);
    }

    if (crew.length > 0) {
        const crewSection = document.createElement("div");
        crewSection.className = "project-crew";

        const crewTitle = document.createElement("h3");
        crewTitle.className = "project-crew-title";
        crewTitle.textContent = "Key Crew";

        const crewGrid = document.createElement("div");
        crewGrid.className = "project-crew-grid";

        crew.forEach((item) => {
            crewGrid.appendChild(createDetailItem(item));
        });

        crewSection.append(crewTitle, crewGrid);
        projectDetailsContent.appendChild(crewSection);
    }
}

/* =========================
   NAVIGATION ENTRE PROJETS
   ========================= */

function isProjectNavigable(project) {
    return Boolean(
        project?.slug &&
        project?.url &&
        project.url !== "#"
    );
}

function createProjectNavigationSide(type, project) {
    const side = document.createElement("div");
    side.className =
        `project-navigation-side project-navigation-side--${type}`;

    if (!project) {
        side.classList.add("is-empty");
        side.setAttribute("aria-hidden", "true");
        return side;
    }

    const link = document.createElement("a");
    link.className =
        `project-navigation-item project-navigation-item--${type}`;
    link.href = getProjectAssetPath(project.url);

    const label = document.createElement("span");
    label.className = "project-navigation-label";
    label.textContent =
        type === "previous"
            ? "Previous Project"
            : "Next Project";

    const main = document.createElement("span");
    main.className = "project-navigation-main";

    const arrow = document.createElement("span");
    arrow.className = "project-navigation-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = type === "previous" ? "←" : "→";

    const title = document.createElement("span");
    title.className = "project-navigation-title";
    title.textContent = project.title;

    if (type === "previous") {
        main.append(arrow, title);
    } else {
        main.append(title, arrow);
    }

    link.append(label, main);
    side.appendChild(link);

    return side;
}

function renderProjectNavigation() {
    if (!currentProject) return;

    /*
        Compatibilité avec les anciennes pages :
        si elles contiennent encore le bloc .project-next,
        on le retire automatiquement.
    */
    if (legacyProjectNext) {
        legacyProjectNext.remove();
    }

    const categoryProjects = projects.filter((project) => {
        return (
            project.category === currentProject.category &&
            isProjectNavigable(project)
        );
    });

    const currentIndex = categoryProjects.findIndex(
        (project) => project.slug === currentProject.slug
    );

    if (currentIndex < 0) return;

    const previousProject =
        currentIndex > 0
            ? categoryProjects[currentIndex - 1]
            : null;

    const nextProject =
        currentIndex < categoryProjects.length - 1
            ? categoryProjects[currentIndex + 1]
            : null;

    if (!previousProject && !nextProject) {
        if (projectNavigation) {
            projectNavigation.hidden = true;
        }
        return;
    }

    if (!projectNavigation) {
        projectNavigation = document.createElement("section");
        projectNavigation.className = "project-navigation";
        projectNavigation.dataset.projectNavigation = "";
        projectNavigation.setAttribute(
            "aria-label",
            "Project navigation"
        );

        if (projectDetailsSection) {
            projectDetailsSection.insertAdjacentElement(
                "afterend",
                projectNavigation
            );
        } else if (projectDetail) {
            projectDetail.appendChild(projectNavigation);
        }
    }

    projectNavigation.hidden = false;
    projectNavigation.innerHTML = "";

    projectNavigation.append(
        createProjectNavigationSide("previous", previousProject),
        createProjectNavigationSide("next", nextProject)
    );
}

/* =========================
   ÉVÉNEMENTS LIGHTBOX
   ========================= */

if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPreviousLightboxImage);
}

if (lightboxNext) {
    lightboxNext.addEventListener("click", showNextLightboxImage);
}

if (lightboxMedia) {
    lightboxMedia.addEventListener("click", (event) => {
        if (event.target === lightboxMedia) {
            closeLightbox();
        }
    });

    lightboxMedia.addEventListener("touchstart", (event) => {
        const touch = event.changedTouches?.[0];
        if (!touch) return;

        lightboxTouchStartX = touch.clientX;
        lightboxTouchStartY = touch.clientY;
    }, {
        passive: true
    });

    lightboxMedia.addEventListener("touchend", (event) => {
        if (lightboxTouchStartX === null || lightboxTouchStartY === null) {
            return;
        }

        const touch = event.changedTouches?.[0];
        if (!touch) return;

        const deltaX = touch.clientX - lightboxTouchStartX;
        const deltaY = touch.clientY - lightboxTouchStartY;

        lightboxTouchStartX = null;
        lightboxTouchStartY = null;

        if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) {
            return;
        }

        if (deltaX > 0) {
            showPreviousLightboxImage();
        } else {
            showNextLightboxImage();
        }
    }, {
        passive: true
    });
}

document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("is-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPreviousLightboxImage();
    if (event.key === "ArrowRight") showNextLightboxImage();
});

/* =========================
   SCROLL / RESIZE
   ========================= */

function scheduleGalleryUpdate() {
    if (galleryScrollFrame !== null) return;

    galleryScrollFrame = requestAnimationFrame(() => {
        updateGalleryFromScroll();
        galleryScrollFrame = null;
    });
}

window.addEventListener("scroll", scheduleGalleryUpdate, {
    passive: true
});

if (galleryViewport) {
    galleryViewport.addEventListener("scroll", () => {
        if (!isCompactGalleryMode()) return;

        if (galleryScrollFrame !== null) return;

        galleryScrollFrame = requestAnimationFrame(() => {
            updateCompactGalleryIndicator();
            galleryScrollFrame = null;
        });
    }, {
        passive: true
    });
}

function refreshGalleryAfterViewportChange() {
    updateGalleryLayout();
    updateGalleryFromScroll();

    if (lightbox?.classList.contains("is-open")) {
        updateLightbox();
    }
}

window.addEventListener("resize", refreshGalleryAfterViewportChange);

window.addEventListener("orientationchange", () => {
    window.setTimeout(refreshGalleryAfterViewportChange, 250);
});

COMPACT_GALLERY_MEDIA.addEventListener?.(
    "change",
    refreshGalleryAfterViewportChange
);

window.addEventListener("load", refreshGalleryAfterViewportChange);

/* =========================
   LANCEMENT
   ========================= */

renderProjectInfo();
renderProjectCategoryNavigation();
renderGallery();
renderProjectDetails();
renderProjectNavigation();

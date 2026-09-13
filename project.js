/* =========================
   PAGE PROJET
   ========================= */

const GALLERY_SCROLL_SPEED = 1;
const GALLERY_HOLD_RATIO = 0.35;

const CATEGORY_META = {
    films: {
        label: "Films",
        page: "../films.html"
    },
    "music-videos": {
        label: "Music Videos",
        page: "../music-videos.html"
    },
    commercials: {
        label: "Commercials",
        page: "../commercials.html"
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

    return `../${path}`;
}

/* =========================
   VIMEO
   ========================= */

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

function getSecondaryInfo(project) {
    if (!project) return "";
    if (project.director) return `Directed by ${project.director}`;
    if (project.artist) return project.artist;
    if (project.client) return project.client;
    return "";
}

function renderProjectInfo() {
    if (!currentProject) return;

    if (projectTitle) {
        projectTitle.textContent = currentProject.title;
    }

    if (projectSecondary) {
        projectSecondary.textContent = getSecondaryInfo(currentProject);
    }

    document.title = `${currentProject.title} — Jonathan Da Silva`;
}

/* =========================
   CATÉGORIE / NAVIGATION
   ========================= */

function renderProjectCategoryNavigation() {
    if (!currentProject) return;

    const categoryMeta = CATEGORY_META[currentProject.category];
    if (!categoryMeta) return;

    if (projectBackLink) {
        projectBackLink.href = categoryMeta.page;
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
        image.src = getProjectAssetPath(item.src);
        image.alt = item.alt || currentProject.title;
        image.loading = index === 0 ? "eager" : "lazy";
        image.decoding = "async";

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
            poster.src = getProjectAssetPath(item.poster);
            poster.alt = `${currentProject.title} — Video`;
            poster.decoding = "async";
            slide.appendChild(poster);
        }

        if (item.src) {
            const video = document.createElement("video");
            video.src = getProjectAssetPath(item.src);

            if (item.poster) {
                video.poster = getProjectAssetPath(item.poster);
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

            frame.appendChild(iframe);
            slide.appendChild(frame);
        } else if (item.poster) {
            /*
                Tant que l'ID Vimeo n'est pas renseigné,
                le projet peut rester parfaitement propre
                en affichant simplement son poster.
            */
            const poster = document.createElement("img");
            poster.src = getProjectAssetPath(item.poster);
            poster.alt = `${currentProject.title} — Video`;
            poster.decoding = "async";
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

    lightboxImage.src = getProjectAssetPath(item.src);
    lightboxImage.alt = item.alt || currentProject.title;

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

window.addEventListener("resize", () => {
    updateGalleryLayout();
    updateGalleryFromScroll();
});

window.addEventListener("load", () => {
    updateGalleryLayout();
    updateGalleryFromScroll();
});

/* =========================
   LANCEMENT
   ========================= */

renderProjectInfo();
renderProjectCategoryNavigation();
renderGallery();
renderProjectDetails();
renderProjectNavigation();

/* =========================
   PAGE CATÉGORIE
   ========================= */

const categoryPage =
    document.body.dataset.category;

const categoryGrid =
    document.querySelector(
        ".category-projects-grid"
    );

function getCategoryCardSecondaryInfo(project) {
    if (!project) return "";

    if (project.category === "films") {
        return project.director
            ? `Directed by ${project.director}`
            : "";
    }

    if (project.category === "music-videos") {
        return project.artist || "";
    }

    if (project.category === "commercials") {
        return project.client || "";
    }

    return (
        project.artist ||
        project.client ||
        (project.director ? `Directed by ${project.director}` : "")
    );
}

function createCategoryProjectCard(project) {
    const card =
        document.createElement("a");

    card.className =
        "project-card";

    card.href =
        project.url;

    const imageWrapper =
        document.createElement("div");

    imageWrapper.className =
        "project-image-wrapper";

    const image =
        document.createElement("img");

    image.className =
        "project-image";

    image.alt =
        project.title;

    image.loading =
        "lazy";

    image.decoding =
        "async";

    applyResponsiveImage(
        image,
        project.image,
        "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    );

    const title =
        document.createElement("h2");

    title.className =
        "project-title";

    const mainTitle =
        document.createElement("span");

    mainTitle.className =
        "project-main-title";

    mainTitle.textContent =
        project.title;

    const secondaryInfo =
        getCategoryCardSecondaryInfo(
            project
        );

    const secondary =
        document.createElement("span");

    secondary.className =
        "project-secondary";

    secondary.textContent =
        secondaryInfo;

    /*
        AFFICHAGE DES VIGNETTES

        FILMS
        → TITRE
        → Directed by...

        MUSIC VIDEOS
        → TITRE
        → ARTISTE

        COMMERCIALS
        → TITRE
        → MARQUE / CLIENT
    */

    title.appendChild(
        mainTitle
    );

    if (secondaryInfo) {
        title.appendChild(
            secondary
        );
    }

    imageWrapper.appendChild(
        image
    );

    card.appendChild(
        imageWrapper
    );

    card.appendChild(
        title
    );

    return card;
}

function renderCategoryProjects() {
    if (
        !categoryPage ||
        !categoryGrid
    ) {
        return;
    }

    categoryGrid.innerHTML = "";

    const filteredProjects =
        projects.filter((project) => {
            return (
                project.category ===
                categoryPage
            );
        });

    filteredProjects.forEach((project) => {
        categoryGrid.appendChild(
            createCategoryProjectCard(
                project
            )
        );
    });
}

renderCategoryProjects();

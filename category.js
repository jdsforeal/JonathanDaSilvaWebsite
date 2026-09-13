/* =========================
   PAGE CATÉGORIE
   ========================= */


/* =========================
   RÉCUPÉRER LA CATÉGORIE
   ========================= */

const categoryPage =
    document.body.dataset.category;


/* =========================
   TROUVER LA GRILLE
   ========================= */

const categoryGrid =
    document.querySelector(
        ".category-projects-grid"
    );


/* =========================
   CRÉER UNE VIGNETTE
   ========================= */

function createCategoryProjectCard(project) {

    const card =
        document.createElement("a");

    card.className = "project-card";
    card.href = project.url;


    const imageWrapper =
        document.createElement("div");

    imageWrapper.className =
        "project-image-wrapper";


    const image =
        document.createElement("img");

    image.className = "project-image";

    image.src = project.image;
    image.alt = project.title;

    image.loading = "lazy";
    image.decoding = "async";


    const title =
        document.createElement("h2");

    title.className = "project-title";


    /* =========================
       INFORMATION SECONDAIRE
       ========================= */

    let secondaryInfo = "";


    if (project.director) {

        secondaryInfo =
            `Directed by ${project.director}`;

    } else if (project.artist) {

        secondaryInfo =
            project.artist;

    } else if (project.client) {

        secondaryInfo =
            project.client;

    }


    const secondary =
        document.createElement("span");

    secondary.className =
        "project-secondary";

    secondary.textContent =
        secondaryInfo;


    /* =========================
       TITRE PRINCIPAL
       ========================= */

    const mainTitle =
        document.createElement("span");

    mainTitle.className =
        "project-main-title";

    mainTitle.textContent =
        project.title;


    /* =========================
       ORDRE D'AFFICHAGE
       ========================= */

    if (project.artist) {

        if (secondaryInfo) {
            title.appendChild(secondary);
        }

        title.appendChild(mainTitle);

    } else {

        title.appendChild(mainTitle);

        if (secondaryInfo) {
            title.appendChild(secondary);
        }

    }


    /* =========================
       ASSEMBLER LA CARTE
       ========================= */

    imageWrapper.appendChild(image);

    card.appendChild(imageWrapper);
    card.appendChild(title);


    return card;

}


/* =========================
   AFFICHER LA CATÉGORIE
   ========================= */

function renderCategoryProjects() {

    if (!categoryPage || !categoryGrid) {
        return;
    }


    const filteredProjects =
        projects.filter((project) => {

            return (
                project.category ===
                categoryPage
            );

        });


    filteredProjects.forEach((project) => {

        const projectCard =
            createCategoryProjectCard(
                project
            );

        categoryGrid.appendChild(
            projectCard
        );

    });

}


/* =========================
   LANCEMENT
   ========================= */

renderCategoryProjects();
/* =========================
   PORTFOLIO - AFFICHAGE DES PROJETS
   ========================= */


/* =========================
   TROUVER LES 3 GRILLES
   ========================= */

const projectGrids = {

    films: document.querySelector(
        "#films .projects-grid"
    ),

    "music-videos": document.querySelector(
        "#music-videos .projects-grid"
    ),

    commercials: document.querySelector(
        "#commercials .projects-grid"
    )

};


/* =========================
   CRÉER UNE VIGNETTE
   ========================= */

function createProjectCard(project) {

    const card = document.createElement("a");

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
        document.createElement("h3");

    title.className = "project-title";


    /* =========================
    ARTISTE OU CLIENT
    ========================= */

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
   INFORMATION SECONDAIRE
   ========================= */

const secondary =
    document.createElement("span");

secondary.className =
    "project-secondary";

secondary.textContent =
    secondaryInfo;


/* =========================
   ORDRE D'AFFICHAGE
   ========================= */

if (project.artist) {

    title.appendChild(
        secondary
    );

    title.appendChild(
        mainTitle
    );

} else {

    title.appendChild(
        mainTitle
    );

    if (secondaryInfo) {

        title.appendChild(
            secondary
        );

    }

}


    imageWrapper.appendChild(image);

    card.appendChild(imageWrapper);
    card.appendChild(title);


    return card;

}


/* =========================
   AFFICHER TOUS LES PROJETS
   ========================= */

function renderProjects() {


    /* Vider les anciennes fausses vignettes */

    Object
        .values(projectGrids)
        .forEach((grid) => {

            if (grid) {
                grid.innerHTML = "";
            }

        });


    /* Ajouter les vrais projets */

    projects.forEach((project) => {

        const targetGrid =
            projectGrids[project.category];


        if (!targetGrid) {
            return;
        }


        const projectCard =
            createProjectCard(project);


        targetGrid.appendChild(
            projectCard
        );

    });

}


/* =========================
   LANCEMENT
   ========================= */

renderProjects();
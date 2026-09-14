/* =========================
   FULL CREDITS
   ========================= */


/* =========================
   ÉLÉMENTS
   ========================= */

const creditsList =
    document.querySelector(
        "[data-credits-list]"
    );

const creditsCount =
    document.querySelector(
        "[data-credits-count]"
    );

const creditFilters =
    document.querySelectorAll(
        "[data-credit-filter]"
    );


/* =========================
   MÉTADONNÉES
   ========================= */

const CREDIT_CATEGORY_META = {

    films: {
        label: "Film"
    },

    "music-videos": {
        label: "Music Video"
    },

    commercials: {
        label: "Commercial"
    }
};


/* =========================
   UTILITAIRES
   ========================= */

function getProjectDetail(
    project,
    label
) {

    const detail =
        project?.details?.find(
            (item) => {

                return (
                    item.label
                        .trim()
                        .toLowerCase() ===
                    label
                        .trim()
                        .toLowerCase()
                );
            }
        );

    return (
        detail?.value?.trim() ||
        ""
    );
}


function getCreditYear(project) {

    return (
        getProjectDetail(
            project,
            "Year"
        ) ||
        "—"
    );
}


function getCreditContext(project) {

    if (
        project.category ===
        "films"
    ) {

        return project.director
            ? `Directed by ${project.director}`
            : "";
    }


    if (
        project.category ===
        "music-videos"
    ) {

        const parts = [];

        if (project.artist) {
            parts.push(
                project.artist
            );
        }

        if (project.director) {
            parts.push(
                `Directed by ${project.director}`
            );
        }

        return parts.join(
            " / "
        );
    }


    if (
        project.category ===
        "commercials"
    ) {

        const parts = [];

        if (project.client) {
            parts.push(
                project.client
            );
        }

        if (project.director) {
            parts.push(
                `Directed by ${project.director}`
            );
        }

        return parts.join(
            " / "
        );
    }


    return (
        project.artist ||
        project.client ||
        project.director ||
        ""
    );
}


function getCreditCategoryLabel(
    project
) {

    return (
        CREDIT_CATEGORY_META[
            project.category
        ]?.label ||
        project.category ||
        ""
    );
}


/* =========================
   TRI
   ========================= */

function sortCredits(
    items
) {

    return [...items].sort(
        (
            projectA,
            projectB
        ) => {

            const yearA =
                Number(
                    getCreditYear(
                        projectA
                    )
                ) || 0;

            const yearB =
                Number(
                    getCreditYear(
                        projectB
                    )
                ) || 0;


            /*
                Plus récent d'abord.
            */

            if (
                yearA !== yearB
            ) {

                return (
                    yearB -
                    yearA
                );
            }


            /*
                À année égale :
                ordre déjà présent
                dans projects.js.
            */

            return (
                projects.indexOf(
                    projectA
                ) -
                projects.indexOf(
                    projectB
                )
            );
        }
    );
}


/* =========================
   CRÉER UNE LIGNE
   ========================= */

function createCreditRow(
    project
) {

    const row =
        document.createElement(
            project.url &&
            project.url !== "#"
                ? "a"
                : "div"
        );

    row.className =
        "credit-row";

    row.dataset.category =
        project.category ||
        "";


    if (
        row.tagName === "A"
    ) {

        row.href =
            project.url;
    }


    const year =
        document.createElement(
            "span"
        );

    year.className =
        "credit-year";

    year.textContent =
        getCreditYear(
            project
        );


    const title =
        document.createElement(
            "h2"
        );

    title.className =
        "credit-title";

    title.textContent =
        project.title ||
        "Untitled";


    const context =
        document.createElement(
            "span"
        );

    context.className =
        "credit-context";

    context.textContent =
        getCreditContext(
            project
        );


    const category =
        document.createElement(
            "span"
        );

    category.className =
        "credit-category";

    category.textContent =
        getCreditCategoryLabel(
            project
        );


    row.appendChild(
        year
    );

    row.appendChild(
        title
    );

    row.appendChild(
        context
    );

    row.appendChild(
        category
    );


    return row;
}


/* =========================
   RENDU
   ========================= */

function renderCredits() {

    if (
        !creditsList ||
        !Array.isArray(projects)
    ) {
        return;
    }


    creditsList.innerHTML =
        "";


    const sortedCredits =
        sortCredits(
            projects
        );


    sortedCredits.forEach(
        (project) => {

            creditsList.appendChild(
                createCreditRow(
                    project
                )
            );
        }
    );


    if (creditsCount) {

        creditsCount.textContent =
            String(
                sortedCredits.length
            ).padStart(
                2,
                "0"
            );
    }
}


/* =========================
   FILTRES
   ========================= */

function filterCredits(
    category
) {

    const rows =
        document.querySelectorAll(
            ".credit-row"
        );


    rows.forEach(
        (row) => {

            const shouldShow =
                category === "all" ||
                row.dataset.category ===
                    category;

            row.hidden =
                !shouldShow;
        }
    );


    creditFilters.forEach(
        (button) => {

            const isActive =
                button.dataset.creditFilter ===
                category;

            button.classList.toggle(
                "is-active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(
                    isActive
                )
            );
        }
    );


    if (creditsCount) {

        const visibleCount =
            [...rows].filter(
                (row) =>
                    !row.hidden
            ).length;

        creditsCount.textContent =
            String(
                visibleCount
            ).padStart(
                2,
                "0"
            );
    }
}


creditFilters.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                filterCredits(
                    button.dataset.creditFilter
                );
            }
        );
    }
);


/* =========================
   LANCEMENT
   ========================= */

renderCredits();

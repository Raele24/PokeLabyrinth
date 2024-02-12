// Function to check the presence of Pokemon on page load
window.onload = checkPokemonPresence;

let pokemon;
let imgCount = 0;
let imgList = [];


/**
 * Checks the presence of a Pokemon and performs necessary actions based on the result.
 * If the Pokemon ID is present, it loads the Pokemon details, creates the detail page, and removes the Pokemon ID from local storage.
 * If the Pokemon ID is not present, it redirects to the index page.
 * @returns {Promise<void>} A promise that resolves once the necessary actions are performed.
 */
async function checkPokemonPresence() {
    // Hide the container and display loading while checking Pokemon presence
    document.querySelector(".container").style.display = "none";
    document.getElementById("loading").style.display = "block";

    let id = localStorage.getItem("pokemonId");
    
    if (id == null) {
        // Redirect to the index page if Pokemon ID is not present
        window.location.href = "./index.html";
    } else {
        // Load Pokemon details, create the detail page, and remove Pokemon ID from local storage
        pokemon = await loadPokemonDetail(id);
        console.log(pokemon);
        createDetailPage(pokemon);
        localStorage.removeItem("pokemonId");
    }
}


/**
 * Loads the details of a Pokemon based on its ID.
 * @param {number} id - The ID of the Pokemon.
 * @returns {Promise<Object>} - A promise that resolves to the Pokemon details.
 */
async function loadPokemonDetail(id) {
    // Format Pokemon ID
    id = formatPokemonId(id);

    // Get Pokemon details using API call
    let response = await getPokemonById(id);
    return response;
}


/**
 * Creates a detail page for a given Pokemon.
 * 
 * @param {Object} pokemon - The Pokemon object containing the details of the Pokemon.
 * @returns {Promise<void>} - A promise that resolves when the detail page is created.
 */
async function createDetailPage(pokemon) {
    // Generate the list of images
    imgList = [pokemon.image, pokemon.imageFemale, pokemon.imageShiny, pokemon.imageFemaleShiny, pokemon.gif, pokemon.gifShiny];
    imgList = imgList.filter(img => img != null);

    // Set up the title section
    setupTitleSection(pokemon);

    // Set up the image section
    updateImg(document.getElementById("pokemon-img"), imgList[imgCount]);

    // Set up the types section
    setupTypesSection(pokemon);

    // Set up the info section
    setupInfoSection(pokemon);

    // Set up the description section
    setupDescriptionSection(pokemon);

    // Set up the stats section
    setupStatsSection(pokemon);

    // Set up the evolution line section
    setupEvolutionLineSection(pokemon);

    // Set up the varieties section
    setupVarietiesSection(pokemon);

    // Show the container and hide the loading
    document.querySelector(".container").style.display = "block";
    document.getElementById("loading").style.display = "none";

    //because of the async nature of the function, there is a new loading screen that appears after the page is loaded
    // Set up the forms section
    document.getElementById("evo-line").innerHTML += `<div id="loading-forms" class="loading-forms"></div>`;
    await setupFormsSection(pokemon);
    document.getElementById("loading-forms").remove();
}


/**
 * Formats the Pokemon ID.
 * @param {string} id - The ID of the Pokemon.
 * @returns {string} - The formatted Pokemon ID.
 */
function formatPokemonId(id) {
    var regex = /^(00\d|0\d{2})$/;
    if (regex.test(id)) {
        if (id < 10) id = id.split("00")[1];
        else if (id < 100) id = id.slice(1);
    }
    return id;
}

/**
 * Formats the given Pokemon ID by adding leading zeros if necessary.
 * @param {number} id - The Pokemon ID.
 * @returns {string} The formatted Pokemon ID.
 */
function getFormattedPokemonId(id) {
    if (id < 10) return "00" + id;
    else if (id < 100) return "0" + id;
    else return id;
}


/**
 * Sets up the title section for a given Pokemon.
 * 
 * @param {Object} pokemon - The Pokemon object.
 */
function setupTitleSection(pokemon) {
    // Set up the title elements
    let title = document.getElementById("name-title");
    let p = document.createElement("p");
    let span = document.createElement("span");
    let fullName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    // Set inner HTML for name and ID
    p.innerHTML = fullName;
    span.innerHTML = "N° "+ getFormattedPokemonId(pokemon.id);
    title.appendChild(p);

    // Append ID span only if within valid range
    !(pokemon.id > json.gen9.end) ? title.appendChild(span) : title.innerHTML += "";
}


/**
 * Sets up the types section for a given Pokemon.
 * 
 * @param {Object} pokemon - The Pokemon object.
 */
function setupTypesSection(pokemon) {
    // Set up the types container and iterate through types
    let types = document.getElementById("types");
    for (let i = 0; i < pokemon.types.length; i++) {
        let typesTitle = document.createElement("p");
        typesTitle.className = "pk-type";
        typesTitle.innerHTML = pokemon.types[i];
        types.appendChild(typesTitle);
        typesTitle.style.backgroundColor = typeColors[pokemon.types[i]];
    }

    // Set background gradient based on the number of types
    if (pokemon.types.length == 1)
        document.getElementById("info-container").style.background = 'linear-gradient(to left top, ' + typeColors[pokemon.types[0]] + ', rgb(0, 0, 0))';
    else
        document.getElementById("info-container").style.background = 'linear-gradient(to left top, ' + typeColors[pokemon.types[0]] + ', ' + typeColors[pokemon.types[1]] + ')';
}


/**
 * Sets up the information section for a given Pokemon.
 * @param {Object} pokemon - The Pokemon object containing information.
 */
function setupInfoSection(pokemon) {
    // Set up info elements (weight, height, abilities, base experience)
    let weight = document.getElementById("weight");
    let height = document.getElementById("height");
    let abilities = document.getElementById("abilities");
    let base_experience = document.getElementById("base_experience");

    // Set inner HTML for weight and height
    weight.innerHTML = pokemon.weight ? pokemon.weight / 10 + " kg" : "??? kg";
    height.innerHTML = pokemon.height ? pokemon.height / 10 + " m" : "??? m";

    // Set inner HTML for abilities
    if (pokemon.abilities.length == 0) {
        let li = document.createElement("li");
        li.innerHTML = "???";
        abilities.appendChild(li);
    }
    for (let i = 0; i < pokemon.abilities.length; i++) {
        let li = document.createElement("li");
        li.innerHTML = "‣ " + pokemon.abilities[i];
        abilities.appendChild(li);
    }

    // Set inner HTML for base experience
    base_experience.innerHTML = pokemon.baseExperience ? pokemon.baseExperience + " xp" : "??? xp";
}


/**
 * Sets up the description section for a given Pokemon.
 * 
 * @param {Object} pokemon - The Pokemon object containing the description information.
 */
function setupDescriptionSection(pokemon) {
    // Set up description elements for both Italian and English
    let descriptionIt = document.getElementById("description-it");
    let descriptionTitle = document.createElement("h3");
    descriptionTitle.innerHTML = "Descrizione";
    descriptionIt.appendChild(descriptionTitle);
    descriptionIt.innerHTML += pokemon.descriptionIt;

    let descriptionEn = document.getElementById("description-en");
    descriptionTitle = document.createElement("h3");
    descriptionTitle.innerHTML = "Description";
    descriptionEn.appendChild(descriptionTitle);
    descriptionEn.innerHTML += pokemon.descriptionEn;
}


/**
 * Sets up the stats section for a given Pokemon.
 * 
 * @param {Object} pokemon - The Pokemon object.
 */
function setupStatsSection(pokemon) {
    // Set up colors for chart
    let color1 = getColorArray(pokemon.types[0]);
    let color2 = pokemon.types[1] ? getColorArray(pokemon.types[1]) : color1;

    // Inject styles for chart colors
    document.documentElement.innerHTML += `<style>
        .hoverBtns:hover {
            background-color: rgb(${color1[0]}, ${color1[1]}, ${color1[2]}, 0.8);
        }

        .hoverBtns2:hover {
            background-color: rgb(${color2[0]}, ${color2[1]}, ${color2[2]}, 0.8);
        }
    </style>`;

    // Add hover styles to buttons
    document.getElementById("back-to-url").classList.add('hoverBtns');
    document.getElementById("go-to-lab").classList.add('hoverBtns2');

    // Create and render the stats chart
    renderStatsChart(pokemon, color1, color2);
}


/**
 * Returns an array of RGB color values based on the given type.
 * @param {string} type - The type of the Pokemon.
 * @returns {number[]} An array of RGB color values.
 */
function getColorArray(type) {
    return [
        parseInt(typeColors[type].substr(-6, 2), 16),
        parseInt(typeColors[type].substr(-4, 2), 16),
        parseInt(typeColors[type].substr(-2), 16)
    ];
}


/**
 * Renders a stats chart for a given Pokemon.
 * Chart is rendered using Chart.js library.
 * @param {Object} pokemon - The Pokemon object.
 * @param {string} color1 - The first color for the chart background.
 * @param {string} color2 - The second color for the chart background.
 */
function renderStatsChart(pokemon, color1, color2) {
    const ctx = document.getElementById('statsChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pokemon.stats.map(stat => stat.name[0].toUpperCase() + stat.name.slice(1)),
            datasets: [{
                label: 'Pokemon stats',
                data: pokemon.stats.map(stat => stat.value),
                borderWidth: 2,
                borderColor: pokemon.types[1] ? typeColors[pokemon.types[1]] : "black",
                backgroundColor: `rgb(${color1[0]}, ${color1[1]}, ${color1[2]}, 0.5)`,
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    min: 0,
                    max: 255
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: pokemon.types[0],
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


/**
 * Sets up the evolution line section for a given Pokemon.
 * 
 * @param {Object} pokemon - The Pokemon object.
 */
function setupEvolutionLineSection(pokemon) {
    // Set up evolution line elements
    let evolutionLine = document.getElementById("evo-line");

    // Iterate through each stage of the evolution line
    for (let i = 0; i < pokemon.evolutionLine.length; i++) {
        let evoContainer = createEvolutionContainer(pokemon.evolutionLine[i], i);
        evolutionLine.appendChild(evoContainer);
    }
}


/**
 * Creates an evolution container element for a given stage of Pokemon.
 * 
 * @param {Array} stage - The array of Pokemon in the current stage.
 * @param {number} index - The index of the evolution container.
 * @returns {HTMLElement} - The created evolution container element.
 */
function createEvolutionContainer(stage, index) {
    let evoContainer = document.createElement("div");
    evoContainer.className = "evo-container";

    // Iterate through each Pokemon in the current stage
    for (let j = 0; j < stage.length; j++) {
        let id = stage[j].id;
        let gen = getGeneration(id);
        id = getFormattedPokemonId(stage[j].id);

        // Create HTML for Pokemon in the evolution line
        evoContainer.innerHTML += `
            <div class="evo" id="evo${index}${j}" onclick="goTo('${id}')">
                <img class="evo-img" draggable="false" src="./assets/images/pokedex/${gen}/${id}.png">
                <p class="name">${stage[j].name[0].toUpperCase() + stage[j].name.slice(1)}</p>
            </div>`;

        // Add arrow if not the last Pokemon in the stage
        if (j < stage.length - 1) {
            let arrow = document.createElement("div");
            arrow.className = "arrow";
            arrow.innerHTML = svgArrow;
            evoContainer.appendChild(arrow);
        }
    }

    return evoContainer;
}


/**
 * Sets up the varieties section for a given Pokemon.
 * @param {Object} pokemon - The Pokemon object.
 * @returns {Promise<void>} - A promise that resolves when the varieties section is set up.
 */
async function setupVarietiesSection(pokemon) {
    // Create varieties container
    let container = document.createElement("div");
    container.className = "varieties-container";

    // Iterate through each variety
    for (let i = 0; i < pokemon.varieties.length; i++) {
        let id = pokemon.varieties[i].id;
        let imgSrc = await getOfficialArtwork(id);
        container.innerHTML += createVarietyHTML(id, imgSrc, pokemon.varieties[i].name);
    }

    // Append varieties container to evolution line
    document.getElementById("evo-line").appendChild(container);
}


/**
 * Creates HTML markup for a Pokemon variety.
 *
 * @param {number} id - The ID of the variety.
 * @param {string} imgSrc - The source URL of the variety's image.
 * @param {string} name - The name of the variety.
 * @returns {string} The HTML markup for the variety.
 */
function createVarietyHTML(id, imgSrc, name) {
    return `
        <div class="evo" id="varieties${id}" onclick="goTo(${id})">
            <img class="varieties-img" draggable="false" src="${imgSrc}">
            <p class="name">${name[0].toUpperCase() + name.slice(1)}</p>
        </div>`;
}


/**
 * Sets up the forms section for a given Pokemon.
 * 
 * @param {Object} pokemon - The Pokemon object.
 * @returns {Promise<void>} - A promise that resolves when the forms section is set up.
 */
async function setupFormsSection(pokemon) {
    // Create forms container
    let forms = document.createElement("div");
    forms.className = "forms-container";
    // Iterate through each form
    for (let i = 0; i < pokemon.forms.length; i++) {
        let imgSrc = await getFrontDefault(pokemon.forms[i].id);
        forms.innerHTML += await createFormHTML(pokemon.forms[i], imgSrc);
    }

    // Append forms container to evolution line
    document.getElementById("evo-line").appendChild(forms);
}


/**
 * Creates HTML markup for a form with an image and name.
 * @param {Object} form - The form object.
 * @param {string} imgSrc - The image source URL.
 * @returns {string} - The HTML markup for the form.
 */
async function createFormHTML(form, imgSrc) {
    return `
        <div class="evo">
            <img class="forms-img" draggable="false" src="${imgSrc || "./assets/images/404.png"}">
            <p class="name">${form.name.toUpperCase() + form.name.slice(1)}</p>
        </div>`;
}


/**
 * Navigates to the pokemon detail page with the specified ID.
 * @param {number} id - The ID of the pokemon.
 */
function goTo(id) {
    id = parseInt(id);
    localStorage.setItem("pokemonId", id);
    window.location.href = "./pokemonDetail.html";
}


/**
 * Navigates to the labyrinth page and saves the selected Pokemon image in local storage.
 */
function goToLabyrinth() {
    pokemon.selectedImg = imgList[imgCount];
    localStorage.setItem("pokemon", JSON.stringify(pokemon));
    window.location.href = "./labyrinth.html";
}


/**
 * Determines the generation of a Pokémon based on its ID.
 * @param {number} id - The ID of the Pokémon.
 * @returns {string} - The generation of the Pokémon.
 */
function getGeneration(id) {
    id = parseInt(id);
    if (id <= json.past.end && id >= json.past.start) return "past";
    if (id < json.gen2.start) return "gen1";
    else if (id < json.gen3.start) return "gen2";
    else if (id < json.gen4.start) return "gen3";
    else if (id < json.gen5.start) return "gen4";
    else if (id < json.gen6.start) return "gen5";
    else if (id < json.gen7.start) return "gen6";
    else if (id < json.gen8.start) return "gen7";
    else if (id < json.gen9.start) return "gen8";
    else return "gen9";
}


/**
 * Updates the image of a Pokemon.
 * 
 * @param {HTMLElement} left_side - The container element where the image will be appended.
 * @param {string} imgSrc - The source URL of the image.
 */
function updateImg(left_side, imgSrc) {
    let image = document.createElement("div");
    image.id = "img";
    image.className = "img";
    image.style.backgroundImage = "url(" + imgSrc + ")";
    left_side.appendChild(image);
}


/**
 * Advances to the next image in the image list and updates the displayed image.
 */
function nextImg() {
    imgCount = (imgCount + 1) % imgList.length;
    document.getElementById("img").remove();
    updateImg(document.getElementById("pokemon-img"), imgList[imgCount]);
}


/**
 * Decrements the image count and updates the displayed image.
 */
function prevImg() {
    imgCount = (imgCount - 1 + imgList.length) % imgList.length;
    document.getElementById("img").remove();
    updateImg(document.getElementById("pokemon-img"), imgList[imgCount]);
}

// SVG arrow icon
let svgArrow = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M9 6l6 6l-6 6" /> </svg>';

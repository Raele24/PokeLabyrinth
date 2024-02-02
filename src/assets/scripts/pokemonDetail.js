window.onload = checkPokemonPresence();

let pokemon;

async function checkPokemonPresence() {
    let id = localStorage.getItem("pokemonId");
    if (id == null) {
        window.location.href = "./index.html";
    }
    else {
        pokemon = await loadPokemonDetail(id);
        console.log(pokemon);
        createDetailPage(pokemon);
        localStorage.removeItem("pokemonId");
    }
}

async function loadPokemonDetail(id) {
    console.log(id);
    var regex = /^(00\d|0\d{2})$/;
    if (regex.test(id)) {
        if (id < 10) id = id.split("00")[1];
        else if (id < 100) id = id.slice(1);
    }
    let response = await getPokemonById(id);
    return response;
}

function goToLabyrinth() {
    localStorage.setItem("pokemon", JSON.stringify(pokemon));
    window.location.href = "./labyrinth.html";
}

async function createDetailPage(pokemon) {
    //name------------------------------

    let title = document.getElementById("name-title");
    let name = document.getElementById("name");
    let id = document.getElementById("id");
    let p = document.createElement("p");
    let span = document.createElement("span");
    let fullName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    p.innerHTML = fullName;
    if (pokemon.id < 10) span.innerHTML = "N° 00" + pokemon.id;
    else if (pokemon.id < 100) span.innerHTML = "N° 0" + pokemon.id;
    else span.innerHTML = "N° " + pokemon.id;
    title.appendChild(p);
    !(pokemon.id > json.gen9.end) ? title.appendChild(span) : title.innerHTML += "";

    //image-----------------------------
    let left_side = document.getElementById("left-side");
    let image = document.createElement("div");
    image.className = "img";
    image.style.backgroundImage = "url(" + pokemon.image + ")";
    left_side.appendChild(image);

    //types-----------------------------
    let types = document.getElementById("types");
    for (let i = 0; i < pokemon.types.length; i++) {
        let typesTitle = document.createElement("p");
        typesTitle.className = "pk-type";
        typesTitle.innerHTML = pokemon.types[i];
        types.appendChild(typesTitle);
        typesTitle.style.backgroundColor = typeColors[pokemon.types[i]];
    }
    if (pokemon.types.length == 1)
        document.getElementById("info-container").style.background = 'linear-gradient(to left top, ' + typeColors[pokemon.types[0]] + ', rgb(0, 0, 0))';
    else
        document.getElementById("info-container").style.background = 'linear-gradient(to left top, ' + typeColors[pokemon.types[0]] + ', ' + typeColors[pokemon.types[1]] + ')';


    //info-----------------------------
    let weight = document.getElementById("weight");
    let height = document.getElementById("height");
    let abilities = document.getElementById("abilities");
    let base_experience = document.getElementById("base_experience");

    weight.innerHTML = pokemon.weight ? pokemon.weight / 10 + " kg" : "??? kg";
    height.innerHTML = pokemon.height ? pokemon.height / 10 + " m" : "??? m";
    if (pokemon.abilities.length == 0) {
        let li = document.createElement("li");
        li.innerHTML = "???";
        abilities.appendChild(li);
    }
    for (let i = 0; i < pokemon.abilities.length; i++) {
        let li = document.createElement("li");
        li.innerHTML = "● " + pokemon.abilities[i];
        abilities.appendChild(li);
    }
    base_experience.innerHTML = pokemon.baseExperience ? pokemon.baseExperience + " xp" : "??? xp";

    //description-----------------------
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

    //evolution line--------------------
    let evolutionLine = document.getElementById("evo-line");
    for (let i = 0; i < pokemon.evolutionLine.length; i++) {
        let evoContainer = document.createElement("div");
        evoContainer.className = "evo-container";
        for (let j = 0; j < pokemon.evolutionLine[i].length; j++) {
            let div = document.createElement("div");
            div.className = "evo";
            let img = document.createElement("img");
            img.className = "evo-img";
            let id = pokemon.evolutionLine[i][j].id;
            if (id < 10) id = "00" + id;
            else if (id < 100) id = "0" + id;
            let gen = getGeneration(id);
            img.src = "./assets/images/pokedex/" + gen + "/" + id + ".png";
            let p = document.createElement("p");
            p.className = "name";
            p.innerHTML = pokemon.evolutionLine[i][j].name[0].toUpperCase() + pokemon.evolutionLine[i][j].name.slice(1);
            div.appendChild(img);
            div.appendChild(p);
            div.addEventListener("click", function () {
                localStorage.setItem("pokemonId", id);
                window.location.href = "./pokemonDetail.html";
            });
            evoContainer.appendChild(div);
            evolutionLine.appendChild(evoContainer);
            if (j < pokemon.evolutionLine[i].length - 1) {
                let arrow = document.createElement("div");
                arrow.className = "arrow";
                arrow.innerHTML = svgArrow;
                evoContainer.appendChild(arrow);
            }
        }
    }

    //varieties-----------------------------
    let container = document.createElement("div");
    container.className = "varieties-container";
    for (let i = 0; i < pokemon.varieties.length; i++) {
        let div = document.createElement("div");
        div.className = "evo";
        let img = document.createElement("img");
        img.className = "varieties-img";
        let id = pokemon.varieties[i].id;
        let imgSrc = await getOfficialArtwork(id);
        img.src = imgSrc;
        let p = document.createElement("p");
        p.className = "name";
        p.innerHTML = pokemon.varieties[i].name[0].toUpperCase() + pokemon.varieties[i].name.slice(1);
        div.appendChild(img);
        div.appendChild(p);
        div.addEventListener("click", function () {
            localStorage.setItem("pokemonId", id);
            window.location.href = "./pokemonDetail.html";
        });
        container.appendChild(div);
    }
    evolutionLine.appendChild(container);

    //forms-----------------------------
    let forms = document.createElement("div");
    forms.className = "forms-container";
    for (let i = 0; i < pokemon.forms.length; i++) {
        let div = document.createElement("div");
        div.className = "evo";
        let img = document.createElement("img");
        img.className = "forms-img";
        let id = pokemon.forms[i].id;
        let imgSrc = await getFrontDefault(id);
        img.src = imgSrc ? imgSrc : "./assets/images/404.png";
        let p = document.createElement("p");
        p.className = "name";
        p.innerHTML = pokemon.forms[i].name[0].toUpperCase() + pokemon.forms[i].name.slice(1);
        div.appendChild(img);
        div.appendChild(p);
        forms.appendChild(div);
    }
    evolutionLine.appendChild(forms);


    //stats-----------------------------
    let color1 = [
        parseInt(typeColors[pokemon.types[0]].substr(-6, 2), 16),
        parseInt(typeColors[pokemon.types[0]].substr(-4, 2), 16),
        parseInt(typeColors[pokemon.types[0]].substr(-2), 16)
    ];
    const ctx = document.getElementById('statsChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [pokemon.stats[0].name[0].toUpperCase() + pokemon.stats[0].name.slice(1), pokemon.stats[1].name[0].toUpperCase() + pokemon.stats[1].name.slice(1), pokemon.stats[2].name[0].toUpperCase() + pokemon.stats[2].name.slice(1), pokemon.stats[3].name[0].toUpperCase() + pokemon.stats[3].name.slice(1), pokemon.stats[4].name[0].toUpperCase() + pokemon.stats[4].name.slice(1), pokemon.stats[5].name[0].toUpperCase() + pokemon.stats[5].name.slice(1)],
            datasets: [{
                label: 'Pokemon stats',
                data: [pokemon.stats[0].value, pokemon.stats[1].value, pokemon.stats[2].value, pokemon.stats[3].value, pokemon.stats[4].value, pokemon.stats[5].value],
                borderWidth: 2,
                borderColor: pokemon.types[1] ? typeColors[pokemon.types[1]] : "black",
                backgroundColor: "rgb(" + color1[0] + "," + color1[1] + "," + color1[2] + ", 0.5)",
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
        },
        responsive: true,
        maintainAspectRatio: false
    });
}

let svgArrow = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M9 6l6 6l-6 6" /> </svg>';


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


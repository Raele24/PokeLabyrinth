window.onload = checkPokemonPresence();


async function checkPokemonPresence(){
    let id = localStorage.getItem("pokemonId");
    if(id == null){
        window.location.href = "./index.html";
    }
    else{
        const pokemon = await loadPokemonDetail(id);
        console.log(pokemon);
        createDetailPage(pokemon);
        localStorage.removeItem("pokemonId");
    }
}

async function loadPokemonDetail(id){
    if(id < 10) id = id.split("00")[1];
    else if(id < 100) id = id.split("0")[1];
    let response = await getPokemonById(id);
    return response;
}

function goToLabyrinth(){
    localStorage.setItem("pokemon", JSON.stringify(pokemon));
    window.location.href = "./labyrinth.html";
}   

function createDetailPage(pokemon){
    //name------------------------------
    let title = document.getElementById("name-title");
    let name = document.getElementById("name");
    let id = document.getElementById("id");
    let p = document.createElement("p");
    let span = document.createElement("span");
    let fullName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    p.innerHTML = fullName;
    if(pokemon.id < 10) span.innerHTML = "N° 00"+ pokemon.id;
    else if(pokemon.id < 100) span.innerHTML = "N° 0"+ pokemon.id;
    else span.innerHTML = "N° "+ pokemon.id;
    title.appendChild(p);
    title.appendChild(span);

    //image-----------------------------
    let left_side = document.getElementById("left-side");
    let image = document.createElement("div");
    image.className = "img";
    image.style.backgroundImage = "url("+pokemon.image+")";
    left_side.appendChild(image);

    //types-----------------------------
    let types = document.getElementById("types");
    for(let i = 0; i < pokemon.types.length; i++){
        let typesTitle = document.createElement("p");
        typesTitle.className = "pk-type";
        typesTitle.innerHTML = pokemon.types[i];
        types.appendChild(typesTitle);
        typesTitle.style.backgroundColor = typeColors[pokemon.types[i]];
    }
    if(pokemon.types.length == 1)
        document.getElementById("info-container").style.background = 'linear-gradient(to left top, '+ typeColors[pokemon.types[0]]+', rgb(0, 0, 0))';
    else
        document.getElementById("info-container").style.background = 'linear-gradient(to left top, '+ typeColors[pokemon.types[0]]+', '+ typeColors[pokemon.types[1]]+')';


    //info-----------------------------
    let weight = document.getElementById("weight");
    let height = document.getElementById("height");
    let abilities = document.getElementById("abilities");
    let base_experience = document.getElementById("base_experience");

    weight.innerHTML = pokemon.weight/10 + " kg";
    height.innerHTML = pokemon.height/10 + " m";
    for(let i = 0; i < pokemon.abilities.length; i++){
        let li = document.createElement("li");
        li.innerHTML =  "● "+pokemon.abilities[i];
        abilities.appendChild(li);
    }
    base_experience.innerHTML = pokemon.baseExperience + " xp";

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
    let gen = localStorage.getItem("gen");
    let evolutionLine = document.getElementById("evo-line");
    if(pokemon.name == pokemon.evolutionLine[0].name && pokemon.evolutionLine.length == 1){
        let div = document.createElement("div");
        div.className = "evo";
        let img = document.createElement("img");
        let id = pokemon.evolutionLine[0].id;
        if(id < 10) id = "00"+id;
        else if(id < 100) id = "0"+id;
        img.src = "./assets/images/pokedex/"+gen+"/"+id+".png";
        let p = document.createElement("p");
        p.className = "name";
        p.innerHTML = pokemon.evolutionLine[0].name[0].toUpperCase() + pokemon.evolutionLine[0].name.slice(1);
        div.appendChild(img);
        div.appendChild(p);
        evolutionLine.appendChild(div);
    }else{
        for(let i = 0; i < pokemon.evolutionLine.length; i++){
            let div = document.createElement("div");
            div.className = "evo";
            let img = document.createElement("img");
            let id = pokemon.evolutionLine[i].id;
            if(id < 10) id = "00"+id;
            else if(id < 100) id = "0"+id;
            img.src = "./assets/images/pokedex/"+gen+"/"+id+".png";
            let p = document.createElement("p");
            p.className = "name";
            p.innerHTML = pokemon.evolutionLine[i].name[0].toUpperCase() + pokemon.evolutionLine[i].name.slice(1);
            div.appendChild(img);
            div.appendChild(p);
            evolutionLine.appendChild(div);
            if(i < pokemon.evolutionLine.length-1){
                let arrow = document.createElement("div");
                arrow.className = "arrow";
                arrow.innerHTML = svgArrow;
                evolutionLine.appendChild(arrow);
            }
        }
    }
}

let svgArrow = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M9 6l6 6l-6 6" /> </svg>';

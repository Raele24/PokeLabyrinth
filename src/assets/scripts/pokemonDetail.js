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


}

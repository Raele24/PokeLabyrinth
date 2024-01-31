window.onload = checkPokemonPresence();


async function checkPokemonPresence(){
    let id = localStorage.getItem("pokemonId");
    if(id == null){
        window.location.href = "./index.html";
    }
    else{
        const pokemon = await loadPokemonDetail(id);
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
    //name
    let title = document.getElementById("name-title");
    let name = document.getElementById("name");
    let id = document.getElementById("id");
    let p = document.createElement("p");
    let span = document.createElement("span");
    p.innerHTML = pokemon.name;
    span.innerHTML = "N° "+ pokemon.id;
    title.appendChild(p);
    title.appendChild(span);

}

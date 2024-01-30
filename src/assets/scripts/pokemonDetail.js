//window.onload = checkPokemonPresence();


async function checkPokemonPresence(){
    let id = localStorage.getItem("pokemonId");
    if(id == null){
        alert("No pokemon selected");
        window.location.href = "index.html";
    }
    else{
        const pokemon = await loadPokemonDetail(id);
        console.log(pokemon);
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
    window.location.href = "labyrinth.html";
}   

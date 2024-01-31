const pokedexData = json;
const gen1 = pokedexData.gen1;
const gen2 = pokedexData.gen2;
const gen3 = pokedexData.gen3;
const gen4 = pokedexData.gen4;
const gen5 = pokedexData.gen5;
const gen6 = pokedexData.gen6;
const gen7 = pokedexData.gen7;
const gen8 = pokedexData.gen8;
const gen9 = pokedexData.gen9;
const past = pokedexData.past;
const generationsNames = { gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, past };

const pokeList = document.getElementById('pokeList');
const selectedGen = document.getElementById('selectedGen');
const region = document.getElementById('region');

window.onload = function () {
  selectedGen.value = "gen1";
  loadPokemon();
}

function loadPokemon() {

  pokeList.innerHTML = "";
  region.innerHTML = "";

  let gen = selectedGen.value;
  let genName = generationsNames[gen];
  let imgRegion = document.createElement("img");
  imgRegion.src = "../src/assets/images/regions/" + generationsRegions[gen] + ".png";
  region.appendChild(imgRegion);
  let nameRegion = document.createElement("h3");
  nameRegion.innerHTML = generationsRegions[gen];
  region.appendChild(nameRegion);

  genName.start = parseInt(genName.start);
  genName.end = parseInt(genName.end);  //parse needed for 999+ pokemon
  for (let i = genName.start; i <= genName.end; i++) {
    if (i < 10) i = "00" + i;
    else if (i < 100) i = "0" + i;
    let pokemonName;
    let pokemonTypes = [];
    let pokemonId;

    let div = document.createElement("div");
    div.className = "singlePokemon";
    div.id = i;
    div.onclick = function () { preparePokemonDetail(i) };

    div.addEventListener("mouseover", function () {
      loadShortDetail(pokemonName, pokemonTypes, pokemonId, i, overlay);
    });

    let overlay = document.createElement("div");
    overlay.className = "overlay";

    let imgElement = document.createElement("img");
    imgElement.src = "../src/assets/images/pokedex/" + gen + "/" + i + ".png";
    imgElement.width = 215;
    imgElement.height = 215;

    div.appendChild(imgElement);
    div.appendChild(overlay);
    pokeList.appendChild(div);
  }
}

function preparePokemonDetail(id) {
  
  openPokemonDetail(id);
  
}

function openPokemonDetail(id) {
  localStorage.setItem("pokemonId", id);
  window.location.href = "./pokemonDetail.html";
}

async function loadShortDetail(pokemonName, pokemonTypes, pokemonId, i, overlay) {
  if(overlay.hasChildNodes()) return; 
  let descriptionElment = document.createElement("div");
  descriptionElment.id = "description";
  descriptionElment.className = "description";
  overlay.appendChild(descriptionElment)

  let id;
  if (i < 10) id = i.split("00")[1];
  else if (i < 100) {
    if (i % 10 == 0) id = i.split("0")[1] + "0";
    else id = i.split("0")[1];
  } else id = i;

  let pokemonShortDetail = await getShortPokemonDto(id);
  pokemonName = pokemonShortDetail.name;
  pokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  pokemonTypes = pokemonShortDetail.types;
  pokemonId = pokemonShortDetail.id;


  let idElement = document.createElement("p");
  idElement.id = "id";
  idElement.className = "id";
  idElement.innerHTML = "N° " + pokemonId;
  descriptionElment.appendChild(idElement);

  let nameElement = document.createElement("h5");
  nameElement.id = "name";
  nameElement.className = "name";
  nameElement.innerHTML = pokemonName;
  descriptionElment.appendChild(nameElement);


  for (let i = 0; i < pokemonTypes.length; i++) {
    let typeElement = document.createElement("span");
    typeElement.id = "type";
    typeElement.className = "type";
    typeElement.style.backgroundColor = typeColors[pokemonTypes[i]];
    typeElement.innerHTML = pokemonTypes[i];
    descriptionElment.appendChild(typeElement);
  }
}






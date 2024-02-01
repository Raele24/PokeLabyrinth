const API_URL = 'https://pokeapi.co/api/v2/pokemon';

async function getPokemon(pokemonName) {
    const response = await fetch(`${API_URL}/${pokemonName}`);
    const pokemon = await response.json();
    const result = await createPokemonDto(pokemon);
    return result;
}

async function getPokemonById(pokemonId) {
    const response = await fetch(`${API_URL}/${pokemonId}`);
    const pokemon = await response.json();
    const result = await createPokemonDto(pokemon);
    return result;
}

async function createPokemonDto(pokemon) {

    const evolutionLine = await getEvolutionChainComplete(pokemon);
    const descriptionEn = await getPokemonDescriptionEnglish(pokemon);
    const descriptionIt = await getPokemonDescriptionItalian(pokemon);
    let  vari = await getAllVarieties(pokemon);
    const varieties = vari.filter(variety => variety.name !== pokemon.name);


    const pokemonDto = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other['official-artwork'].front_default,
        gif: pokemon.sprites.other.showdown.front_default,
        gifShiny: pokemon.sprites.other.showdown.front_shiny,
        types: pokemon.types.map(type => type.type.name),
        stats: pokemon.stats.map(stat => {
            return {
                name: stat.stat.name,
                value: stat.base_stat
            }
        }),
        moves: pokemon.moves.map(move => move.move.name),
        abilities: pokemon.abilities.map(ability => ability.ability.name),
        height: pokemon.height,
        weight: pokemon.weight,
        baseExperience: pokemon.base_experience,
        evolutionLine,
        varieties,
        descriptionEn,
        descriptionIt

    }
    return pokemonDto;
}

async function getOfficialArtwork(id) { 
    const response = await fetch(`${API_URL}/${id}`);
    const pokemon = await response.json();
    const result = pokemon.sprites.other['official-artwork'].front_default;
    return result;
}


async function getEvolutionChainComplete(pokemon) {
    const evolutionChain1 = await getEvolutionChain(pokemon.species.url);
    const evolutionChain = await getEvolutionChain(evolutionChain1.evolution_chain.url);
    let evolutionLines = [];
    function recursiveExtract(chain, currentLine) {
        if (chain.species) {
            currentLine.push({
                id: chain.species.url.split("/")[6],
                name: chain.species.name
            });
            if (chain.evolves_to && chain.evolves_to.length > 0) {
                // Crea una copia di currentLine per ogni possibile evoluzione
                chain.evolves_to.forEach((evolution) => {
                    recursiveExtract(evolution, [...currentLine]);
                });
            } else {
                // Aggiungi l'intera linea evolutiva all'array
                evolutionLines.push([...currentLine]);
            }
        }

    }
    
    recursiveExtract(evolutionChain.chain,[]);

    const uniqueEvolutionLines = evolutionLines.filter(
        (line, index, self) =>
            index ===
            self.findIndex(
                (otherLine) => JSON.stringify(otherLine) === JSON.stringify(line)
            )
    );
    
    return uniqueEvolutionLines;
}
async function getEvolutionChain(url) {
    const response = await fetch(url);
    const evolutionChain = await response.json();
    return evolutionChain;
}

async function getAllVarieties(pokemon) {
    let varietiesList = [];
    const response = await getEvolutionChain(pokemon.species.url);
    const varieties = response.varieties.filter(variety => {
        varietiesList.push({
            name: variety.pokemon.name,
            url: variety.pokemon.url,
            id: variety.pokemon.url.split("/")[6]
        });
    }
    );
    return varietiesList;
}

async function getPokemonDescriptionEnglish(pokemon) {
    const response = await fetch(pokemon.species.url);
    const species = await response.json();
    const description = species.flavor_text_entries.find(entry => entry.language.name === 'en');
    if (description == null) return "Not available";
    return description.flavor_text;
}

async function getPokemonDescriptionItalian(pokemon) {
    const response = await fetch(pokemon.species.url);
    const species = await response.json();
    const description = species.flavor_text_entries.find(entry => entry.language.name === 'it');
    if (description == null) return "Non disponibile";
    return description.flavor_text;
}


async function getShortPokemonDto(pokemonId) {
    const response = await fetch(`${API_URL}/${pokemonId}`);
    const pokemon = await response.json();
    const shortPokemonDto = {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map(type => type.type.name)
    }
    return shortPokemonDto;
}
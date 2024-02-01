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
    const megaEvolutions = await getMegaEvolutions(pokemon);
    const gmaxEvolutions = await getGmaxEvolutions(pokemon);
    const galarForm = await getGalarForm(pokemon);
    const alolaForm = await getAlolaForm(pokemon);
    const therianForm = await getTherianForm(pokemon);


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
        megaEvolutions,
        gmaxEvolutions,
        galarForm,
        alolaForm,
        therianForm,
        descriptionEn,
        descriptionIt

    }
    return pokemonDto;
}


async function getEvolutionChainComplete(pokemon) {
    const evolutionChain1 = await getEvolutionChain(pokemon.species.url);
    const evolutionChain = await getEvolutionChain(evolutionChain1.evolution_chain.url);
    let evolutionLine = [];
    function recursiveExtract(chain) {
        if (chain.species) {
            evolutionLine.push({
                id: chain.species.url.split("/")[6],
                name: chain.species.name
            });
        }
        
        if (chain.evolves_to && chain.evolves_to.length > 0) {
            recursiveExtract(chain.evolves_to[0]);
        }
    }
    
    recursiveExtract(evolutionChain.chain);
    
    return evolutionLine;
}
async function getEvolutionChain(url) {
    const response = await fetch(url);
    const evolutionChain = await response.json();
    return evolutionChain;
}

async function getMegaEvolutions(pokemon) {
    const response = await getEvolutionChain(pokemon.species.url);;
    const megaEvolutions = response.varieties.filter(variety => {
        return variety.pokemon.name.includes("-mega") ? {
            name: variety.pokemon.name.includes("-mega"),
            url: variety.pokemon.url
        } : null

    }
    );
    return megaEvolutions;
}

async function getGmaxEvolutions(pokemon) {
    const response = await getEvolutionChain(pokemon.species.url);;
    const gmaxEvolutions = response.varieties.filter(variety => {
        return variety.pokemon.name.includes("-gmax") ? {
            name: variety.pokemon.name.includes("-gmax"),
            url: variety.pokemon.url
        } : null
    }
    );
    return gmaxEvolutions;
}

async function getGalarForm(pokemon) {
    const response = await getEvolutionChain(pokemon.species.url);;
    const galarForm = response.varieties.filter(variety => {
        return variety.pokemon.name.includes("-galar") ? {
            name: variety.pokemon.name.includes("-galar"),
            url: variety.pokemon.url
        } : null
    }
    );
    return galarForm;
}

async function getAlolaForm(pokemon) {
    const response = await getEvolutionChain(pokemon.species.url);;
    const alolaForm = response.varieties.filter(variety => {
        return variety.pokemon.name.includes("-alola") ? {
            name: variety.pokemon.name.includes("-alola"),
            url: variety.pokemon.url
        } : null
    }
    );
    return alolaForm;
}

async function getTherianForm(pokemon) {
    const response = await getEvolutionChain(pokemon.species.url);;
    const therianForm = response.varieties.filter(variety => {
        return variety.pokemon.name.includes("-therian") ? {
            name: variety.pokemon.name.includes("-therian"),
            url: variety.pokemon.url
        } : null
    }
    );
    return therianForm;
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
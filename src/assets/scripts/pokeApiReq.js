const API_URL = 'https://pokeapi.co/api/v2/pokemon';

/**
 * Retrieves information about a specific Pokemon from the PokeAPI.
 * @param {string} pokemonName - The name of the Pokemon to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the Pokemon data.
 */
async function getPokemon(pokemonName) {
    const response = await fetch(`${API_URL}/${pokemonName}`);
    const pokemon = await response.json();
    const result = await createPokemonDto(pokemon);
    return result;
}

/**
 * Retrieves a Pokemon by its ID from the PokeAPI.
 * @param {number} pokemonId - The ID of the Pokemon to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the Pokemon object.
 */
async function getPokemonById(pokemonId) {
    const response = await fetch(`${API_URL}/${pokemonId}`);
    const pokemon = await response.json();
    const result = await createPokemonDto(pokemon);
    return result;
}

/**
 * Creates a Pokemon DTO (Data Transfer Object) based on the given Pokemon object.
 * @param {Object} pokemon - The Pokemon object.
 * @returns {Object} - The Pokemon DTO.
 */
async function createPokemonDto(pokemon) {
    const evolutionLine = await getEvolutionChainComplete(pokemon);
    const descriptionEn = await getPokemonDescriptionEnglish(pokemon);
    const descriptionIt = await getPokemonDescriptionItalian(pokemon);
    let vari = await getAllVarieties(pokemon);
    const varieties = vari.filter(variety => variety.name !== pokemon.name);
    const forms = await getAllForms(pokemon);


    const pokemonDto = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other['official-artwork'].front_default ? pokemon.sprites.other['official-artwork'].front_default : pokemon.sprites.other['home'].front_default,
        imageShiny: pokemon.sprites.other['official-artwork'].front_shiny ? pokemon.sprites.other['official-artwork'].front_shiny : pokemon.sprites.other['home'].front_shiny,
        imageFemale: pokemon.sprites.other['home'].front_female ? pokemon.sprites.other['home'].front_female : null,
        imageFemaleShiny: pokemon.sprites.other['home'].front_female_shiny ? pokemon.sprites.other['home'].front_female_shiny : null,
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
        forms,
        descriptionEn,
        descriptionIt,
        selectedImg: null,

    }
    return pokemonDto;
}

/**
 * Retrieves the official artwork URL for a given Pokemon ID.
 * @param {number} id - The ID of the Pokemon.
 * @returns {string} - The URL of the official artwork.
 */
async function getOfficialArtwork(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const pokemon = await response.json();
    const result = pokemon.sprites.other['official-artwork'].front_default ? pokemon.sprites.other['official-artwork'].front_default : pokemon.sprites.other['home'].front_default;
    return result;
}

/**
 * Retrieves the front default sprite URL for a given Pokemon ID from the PokeAPI.
 * @param {number} id - The ID of the Pokemon.
 * @returns {string|null} - The URL of the front default sprite, or null if not found.
 */
async function getFrontDefault(id) {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon-form/"+id+"/");
    const pokemon = await response.json();
    const result = pokemon.sprites.front_default ? pokemon.sprites.front_default : null;
    return result;
}

/**
 * Retrieves all forms of a given Pokemon.
 * @param {Object} pokemon - The Pokemon object.
 * @returns {Array} - An array of form objects.
 */
async function getAllForms(pokemon) {
    let forms = [];
    const result = pokemon.forms.map(form => {
        forms.push({
            name: form.name,
            url: form.url,
            id: form.url.split("/")[6]
        });
    });

    return forms = forms.filter(form => form.name !== pokemon.name);
}


/**
 * Retrieves the complete evolution chain for a given Pokemon.
 * it uses a recursive function to extract the evolution chain from the response.
 * @param {Object} pokemon - The Pokemon object.
 * @returns {Array} - The unique evolution lines of the Pokemon.
 */
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
                chain.evolves_to.forEach((evolution) => {
                    recursiveExtract(evolution, [...currentLine]);
                });
            } else {
                evolutionLines.push([...currentLine]);
            }
        }

    }

    recursiveExtract(evolutionChain.chain, []);

    const uniqueEvolutionLines = evolutionLines.filter(
        (line, index, self) =>
            index ===
            self.findIndex(
                (otherLine) => JSON.stringify(otherLine) === JSON.stringify(line)
            )
    );

    return uniqueEvolutionLines;
}

/**
 * Fetches the evolution chain data from the specified URL.
 * @param {string} url - The URL to fetch the evolution chain data from.
 * @returns {Promise<Object>} - A promise that resolves to the evolution chain data.
 */
async function getEvolutionChain(url) {
    const response = await fetch(url);
    const evolutionChain = await response.json();
    return evolutionChain;
}

/**
 * Retrieves all varieties of a given Pokemon.
 * @param {Object} pokemon - The Pokemon object.
 * @returns {Array} - An array of varieties, each containing the name, URL, and ID of the Pokemon.
 */
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

/**
 * Retrieves the English description of a given Pokemon.
 * @param {Object} pokemon - The Pokemon object.
 * @returns {Promise<string>} The English description of the Pokemon.
 */
async function getPokemonDescriptionEnglish(pokemon) {
    const response = await fetch(pokemon.species.url);
    const species = await response.json();
    const description = species.flavor_text_entries.find(entry => entry.language.name === 'en');
    if (description == null) return "Not available";
    return description.flavor_text;
}

/**
 * Retrieves the Italian description of a Pokemon.
 * @param {Object} pokemon - The Pokemon object.
 * @returns {Promise<string>} The Italian description of the Pokemon, or "Non disponibile" if not available.
 */
async function getPokemonDescriptionItalian(pokemon) {
    const response = await fetch(pokemon.species.url);
    const species = await response.json();
    const description = species.flavor_text_entries.find(entry => entry.language.name === 'it');
    if (description == null) return "Non disponibile";
    return description.flavor_text;
}


/**
 * Retrieves a short Pokemon DTO (Data Transfer Object) based on the provided Pokemon ID.
 * @param {number} pokemonId - The ID of the Pokemon.
 * @returns {Promise<Object>} - A Promise that resolves to a short Pokemon DTO.
 */
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

/**
 * Navigates back to the previous URL in the browser history.
 */
function backToUrl() {
    if (history.length == 0) {
        document.location = document.referrer;
    } else {
        history.go(-1);
    }
}
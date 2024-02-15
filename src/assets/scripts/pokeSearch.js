function searchPoke(){
    const pokeName = document.getElementById('pokeSearch').value;
    if(pokeName.trim() === ''){
        document.getElementById('pokeSearchList').innerHTML = '';
        document.getElementById('pokeSearchList').style.display = 'none';
        return;
    }
    getPokemon(pokeName).then(data => {

        if(data === null){
            document.getElementById('pokeSearchList').innerHTML = '';
            document.getElementById('pokeSearchList').style.display = 'none';
            return;
        }
        document.getElementById('pokeSearchList').style.display = 'flex';
        document.getElementById('pokeSearchList').innerHTML = `
            <div class="dropdown-content">
                <a onclick="goToDetailBySearch(${data.id})">${data.name}</a>
                <img src="${data.image}" alt="${data.name}" onclick="goToDetailBySearch(${data.id})">
                <p>Types: ${data.types.join(', ')}</p>
            </div>
        `;
    } 
    );
}

function goToDetailBySearch(id){
    id = parseInt(id);
    localStorage.setItem("pokemonId", id);
    window.location.href = "./pokemonDetail.html";
}

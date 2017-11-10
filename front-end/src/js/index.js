//Imports
import { getPokemons, deletePokemon, createPokemon, upPokemon } from "./api/pokemonApi.js"
let pokemonIDCount = 1;
// Ran when they select an X on a table element, will submit a DELETE request and
// remove them from the table.
function deletePokemonFromTableAndDB(event) {
    const element = event.target;
    event.preventDefault();
    deletePokemon(element.attributes["data-id"].value);
    const row = element.parentNode.parentNode;
    row
        .parentNode
        .removeChild(row);
}

function updatePokemonInTableAndDB(event) {
    const element = event.target;
    event.preventDefault();
    const row = element.parentNode.parentNode;

    let currentName = row.cells[1].innerHTML;
    let currentLevel = row.cells[2].innerHTML;
    let currentEggGroup = row.cells[3].innerHTML;

    row.cells[1].innerHTML = `<input id="inputPokemonNameUpdate" type="text" placeholder="${currentName}">`;
    row.cells[2].innerHTML = `<input id="inputPokemonLevelUpdate" type="number" placeholder="${currentLevel}">`;
    row.cells[3].innerHTML = `<input id="inputPokemonEggGroupUpdate" type="text" placeholder="${currentEggGroup}">`;
    row.cells[4].innerHTML = `<input type="button" onclick="updatePokemon(${element.attributes["data-id"].value})" value="Update">`;
}


//Given an array of pokemons, output them all to the table and apply delete events.
function loadPokemonsToScreen(pokemonList) {
    //output pokemons to table
    let pokemonsBody = "";
    pokemonList.forEach((pokemon) => {
        pokemonsBody += createTableDataFromPokemon(pokemon);
        pokemonIDCount++;
    });
    document
        .getElementById("pokemonDetails")
        .innerHTML = pokemonsBody;
    applyDeleteEvents();
    applyUpdateEvents();
}

// Go through all the elements in the table that have the deletePokemon tag, give
// them the event to delete themselves.
function applyDeleteEvents() {
    // find all elements that have the classname "deletePokemon" and give them onclick
    // events to delete them.
    const deleteLinks = document.getElementsByClassName("deletePokemon");
    Array.from(deleteLinks, (link) => {
        link.onclick = deletePokemonFromTableAndDB;
    });
}
function applyUpdateEvents() {
    // find all elements that have the classname "upPokemon" and give them onclick
    // events to update them.
    const updateLinks = document.getElementsByClassName("upPokemon");
    Array.from(updateLinks, (link) => {
        link.onclick = updatePokemonInTableAndDB;
    });
}

//Given a pokemon object, create HTML for it in the table.
function createTableDataFromPokemon({ id, name, level, eggGroup }) {
    return `
    <tr id = "row${id}">
        <td> <a href = "#" data-id="${id}" class="deletePokemon"> X </a> </td>
        <td>${name}</td>
        <td>${level}</td>
        <td>${eggGroup}</td>
        <td> <a href = "#" data-id="${id}" class="upPokemon"> U </a> </td>
    </tr>`;
}

// Get pokemon inputs from text boxes, then clear the text boxes, check if the inputs
// were all filled, submit a post request, get the result, append result to
// plevel.
function createAndAppendPokemon() {
    const pokemonInput = getPokemonFromInputs();
    clearInputs();
    if (isValidPokemon(pokemonInput)) {
        Promise
            .resolve(createPokemon(pokemonInput))
            .then((newPokemon) => {
                document
                    .getElementById("pokemonDetails")
                    .innerHTML += createTableDataFromPokemon(newPokemon);
                applyDeleteEvents();
                applyUpdateEvents();
            });
    }
}
function updatePokemon(id) {

    const pokemonUpdate = getUpPokemonFromInputs();
    pokemonUpdate.id = id;
    if (isValidPokemon(pokemonUpdate)) {
        Promise
            .resolve(upPokemon(pokemonUpdate, id))
            .then((upPokemon) => {
                const row = document.getElementById("row" + id);
                row.cells[1].innerHTML = upPokemon.name;
                row.cells[2].innerHTML = upPokemon.level;
                row.cells[3].innerHTML = upPokemon.eggGroup;
                row.cells[4].innerHTML = `<a href = "#" data-id="${id}" class="upPokemon"> U </a>`;
                applyDeleteEvents();
                applyUpdateEvents();
            });
    }
}



//Checks if a pokemon has all the valid fields
function isValidPokemon(pokemon) {
    return (pokemon.name && pokemon.level && pokemon.eggGroup);
}

//Clears the textboxes
function clearInputs() {
    document
        .getElementById("inputPokemonName")
        .value = "";
    document
        .getElementById("inputPokemonLevel")
        .value = "";
    document
        .getElementById("inputPokemonEggGroup")
        .value = "";
}

//Returns an object comprised of the data from the textboxes
function getPokemonFromInputs() {
    return {
        id: pokemonIDCount++,
        name: document
            .getElementById("inputPokemonName")
            .value,
        level: document
            .getElementById("inputPokemonLevel")
            .value,
        eggGroup: document
            .getElementById("inputPokemonEggGroup")
            .value
    }
}
function getUpPokemonFromInputs() {
    return {
        id: -1,
        name: document
            .getElementById("inputPokemonNameUpdate")
            .value,
        level: document
            .getElementById("inputPokemonLevelUpdate")
            .value,
        eggGroup: document
            .getElementById("inputPokemonEggGroupUpdate")
            .value
    }
}

// Expose the createAndAppendPokemon function for the button, otherwise it's stuck in
// here because of modules.
window.createAndAppendPokemon = createAndAppendPokemon;
window.updatePokemon = updatePokemon;

//On plevel load, load all pokemons.
window.onload = function () {
    //load pokemons into table, including delete events set to each element.
    const pokemonList = getPokemons().then(loadPokemonsToScreen);
}

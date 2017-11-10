const baseUrl = "http://localhost:3000/api/";

let onSuccess = (response) => {
    return response.json();
};
let onError = (error) => {
    console.log(error);
};

function get(url) {
    return fetch(baseUrl + url).then(onSuccess, onError);
}   
function del(url) {
    const request = new Request(baseUrl + url, {
        method: "DELETE"
    });
    return fetch(request).then(onSuccess, onError);
}
function create(pokemon, url) {
    const request = new Request(baseUrl + url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pokemon)
    });
    return fetch(request).then(onSuccess, onError);
}
function update(pokemon, url) {
    const request = new Request(baseUrl + url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pokemon)
    })
    return fetch(request).then(onSuccess, onError);
}

export function createPokemon(pokemon) {
    return create(pokemon, "pokemon");
}
export function getPokemons() {
    return get("pokemon");
}
export function deletePokemon(id) {
    return del(`pokemon/${id}`);
}
export function upPokemon(pokemon, id) {
    return update(pokemon, `pokemon/${id}`);
}
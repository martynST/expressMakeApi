//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const open = require("open");

//Express
const app = express();
const port = process.env.port || 3000;
const router = express.Router();

//Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Routing
app.use("/", router);

/* GET REQUESTS */
//Provide all pokemons on base url of https://localhost:3000/api/pokemon
router.get("/api/pokemon", (req, res) => {
    res.json(pokemons);
});

//Get a specific pokemon based on id provided such as /api/pokemon/2
router.get("/api/pokemon/:id", (req, res) => {
    const pokemonID = req.params.id;
    const currentPokemon = pokemons.find((pokemon) => pokemon.id == pokemonID);
    if (currentPokemon) {
        res.json(currentPokemon);
    } else {
        res.sendStatus(404);
    }
});

/* POST REQUESTS */
// Base url, takes a pokemon with the four attributes, checks if its valid and
// unique, then adds it to the array.
router.post("/api/pokemon/", (req, res) => {
    const postPokemon = req.body;
    const isValid = isValidPokemon(postPokemon) && !pokemons.find((a) => a.id == postPokemon.id);
    if (isValid) {
        pokemons.push(postPokemon);
        res.send(postPokemon);
    } else {
        res.sendStatus(500);
    }
});

/* PUT REQUESTS */
// Take a pokemon object at a specific ID url e.g. /api/pokemon/1 Replace contents of the
// pokemon with that id, with the pokemon recieved, not including the ID.
router.put("/api/pokemon/:id", (req, res) => {
    const pokemonID = req.params.id;
    const currentPokemon = pokemons.find((pokemon) => pokemon.id == pokemonID);
    if (currentPokemon) {
        const putPokemon = req.body;
        const isValid = isValidPokemon(putPokemon);
        if (isValid) {
            currentPokemon.name = putPokemon.name;
            currentPokemon.level = putPokemon.level;
            currentPokemon.eggGroup = putPokemon.eggGroup;
            res.send(currentPokemon);
        } else {
            res.sendStatus(404);
        }
    }
});

/* DELETE REQUESTS */
// Doesn't take any information, a delete request at a specific ID endpoint will
// delete the object.
router.delete("/api/pokemon/:id", (req, res) => {
    const pokemonID = req.params.id;
    const currentPokemon = pokemons.findIndex((pokemon) => pokemon.id == pokemonID);
    if (currentPokemon !== -1) {
        pokemons.splice(currentPokemon, 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

//Mock data instead of database
const pokemons = [
    {
        id: 1,
        name: "Chandelure",
        level: 57,
        eggGroup: "Amorphous"
    }
]

//Checks if the object has all required attributes
function isValidPokemon(pokemon) {
    return "id" in pokemon && "name" in pokemon && "level" in pokemon && "eggGroup" in pokemon;
}

//Run server
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        open(`http://localhost:${port}`)
    }
});

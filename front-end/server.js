//Dependencies
const express = require("express");
const open = require("open");
const path = require("path");
const app = express();
const port = 3001;

//Serve all the files in the src folder as static assets
app.use(express.static("src"));

//Start server
app.listen(port, (err) => {
    if (err) { console.log(err); }
    else { open(`http://localhost:${port}`); }
});
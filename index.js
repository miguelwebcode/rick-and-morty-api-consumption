import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { name } from 'ejs';

const app = express();
const PORT = 3000;
const BASEURL = "https://rickandmortyapi.com/api/";
let endpoints = {};

app.use(bodyParser.json());

//Use the public folder for static files.
app.use(express.static("public"));


//When the user goes to the home page it should render the index.ejs file.
app.get("/", async (req, res) => {
    let response = await axios.get(`${BASEURL}`);
    //Store the endpoints in a global variable to be used in other routes.
    let contentValue = [
        {
            name: "Characters",
            url: response.data.characters,
            description: "Get all characters"
        },
        {
            name: "Locations",
            url: response.data.locations,
            description: "Get all locations"
        },
        {
            name: "Episodes",
            url: response.data.episodes,
            description: "Get all episodes"
        }
    ];
    res.render("index.ejs", {content: contentValue});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
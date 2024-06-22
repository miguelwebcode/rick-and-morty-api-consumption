import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { name } from 'ejs';

const app = express();
const PORT = 3000;
const BASEURL = "https://rickandmortyapi.com/api/";
let endpoints = {characters: "character", locations: "location", episodes: "episode"};

//Use the public folder for static files.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));



//When the user goes to the home page it should render the index.ejs file.
app.get("/", async (req, res) => {
    try {
        let response = await axios.get(`${BASEURL}`);
        //Store the endpoints in a global variable to be used in other routes.
        let contentValue = {
            characters: {
                name: "Characters",
                url: response.data.characters,
                description: "Get all characters"
            },
            locations: {
                name: "Locations",
                url: response.data.locations,
                description: "Get all locations"
            },
            episodes: {
                name: "Episodes",
                url: response.data.episodes,
                description: "Get all episodes"
            }
        };
        res.render("index.ejs", {content: contentValue});
    } catch (error) {
        console.log(error);
    }
});


app.get("/characters", async (req, res) => {
    try {
        let response = await axios.get(`${BASEURL}${endpoints.characters}`);
        console.log(response.data);
        res.render("characters.ejs", {info: response.data.info, results: response.data.results});
    } catch (error) {
        console.log(error);
    }
});

app.get("/locations", async (req, res) => {
    try {
        let response = await axios.get(`${BASEURL}${endpoints.locations}`);
        console.log(response.data);
        res.render("locations.ejs", {info: response.data.info, results: response.data.results});

    } catch (error) {
        console.log(error);
    }
});

app.get("/episodes", async (req, res) => {
    try {
        let response = await axios.get(`${BASEURL}${endpoints.episodes}`);
        console.log(response.data);       
    } catch (error) {
        console.log(error);
    }
});



app.post("/characters", async (req, res) => {
    try {
        const pageNumber = req.body.page;
        console.log(`Page number: ${pageNumber}`);
        let response = await axios.get(`${BASEURL}${endpoints.characters}/?page=${pageNumber}`);
        console.log(response.data);
        res.render("characters.ejs", {info: response.data.info, results: response.data.results});
    } catch (error) {
        console.log(error);
    }
    
});

app.post("/locations", async (req, res) => {
    try {
        const pageNumber = req.body.page;
        console.log(`Page number: ${pageNumber}`);
        let response = await axios.get(`${BASEURL}${endpoints.locations}/?page=${pageNumber}`);
        console.log(response.data);
        res.render("locations.ejs", {info: response.data.info, results: response.data.results});
    } catch (error) {
        console.log(error);
    }
    
});

app.post("/getCharacterById", async (req, res) => {
    console.log("Get character by id");
    console.log(req.body);
    try {
        let response = await axios.get(`${BASEURL}${endpoints.characters}/${req.body.characterId}`);
        console.log(response.data);
        res.render("character-detail.ejs", {character: response.data});
    } catch (error) {
        console.log(error);
    }
});

app.post("/getLocationById", async (req, res) => {
    console.log("Get location by id");
    console.log(req.body);
    try {
        let response = await axios.get(`${BASEURL}${endpoints.locations}/${req.body.locationId}`);
        console.log(response.data);
        res.render("location-detail.ejs", {location: response.data});
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
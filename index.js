import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const PORT = 3000;
const BASEURL = "https://rickandmortyapi.com/api/";
let endpoints = {};

app.use(bodyParser.json());

//Use the public folder for static files.
app.use(express.static("public"));


//When the user goes to the home page it should render the index.ejs file.
app.get("/", async () => {
    let response = await axios.get(`${BASEURL}`);
    //Store the endpoints in a global variable to be used in other routes.
    endpoints = response.data;
    res.render("index.ejs", {content: endpoints});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
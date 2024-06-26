import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { name } from "ejs";

const app = express();
const PORT = 3000;
const BASEURL = "https://rickandmortyapi.com/api/";
let endpoints = {
  characters: "character",
  locations: "location",
  episodes: "episode",
};

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
        description: "Get all characters",
      },
      locations: {
        name: "Locations",
        url: response.data.locations,
        description: "Get all locations",
      },
      episodes: {
        name: "Episodes",
        url: response.data.episodes,
        description: "Get all episodes",
      },
    };
    res.render("index.ejs", { content: contentValue });
  } catch (error) {
    console.log(error);
  }
});

app.get("/characters", async (req, res) => {
  try {
    let response = await axios.get(`${BASEURL}${endpoints.characters}`);
    let currentPage = calculateCurrentPage(response.data.info);
    response.data.info.currentPage = currentPage;
    res.render("characters.ejs", {
      info: response.data.info,
      results: response.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/locations", async (req, res) => {
  try {
    let response = await axios.get(`${BASEURL}${endpoints.locations}`);
    let currentPage = calculateCurrentPage(response.data.info);
    response.data.info.currentPage = currentPage;
    res.render("locations.ejs", {
      info: response.data.info,
      results: response.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/episodes", async (req, res) => {
  try {
    let response = await axios.get(`${BASEURL}${endpoints.episodes}`);
    let currentPage = calculateCurrentPage(response.data.info);
    response.data.info.currentPage = currentPage;
    res.render("episodes.ejs", {
      info: response.data.info,
      results: response.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/characters", async (req, res) => {
  try {
    const pageNumber = req.body.page;
    let response = await axios.get(
      `${BASEURL}${endpoints.characters}/?page=${pageNumber}`
    );
    let currentPage = calculateCurrentPage(response.data.info);
    response.data.info.currentPage = currentPage;
    res.render("characters.ejs", {
      info: response.data.info,
      results: response.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/locations", async (req, res) => {
  try {
    const pageNumber = req.body.page;
    let response = await axios.get(
      `${BASEURL}${endpoints.locations}/?page=${pageNumber}`
    );
    let currentPage = calculateCurrentPage(response.data.info);
    response.data.info.currentPage = currentPage;
    res.render("locations.ejs", {
      info: response.data.info,
      results: response.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/episodes", async (req, res) => {
  try {
    const pageNumber = req.body.page;
    let response = await axios.get(
      `${BASEURL}${endpoints.episodes}/?page=${pageNumber}`
    );
    let currentPage = calculateCurrentPage(response.data.info);
    response.data.info.currentPage = currentPage;
    res.render("episodes.ejs", {
      info: response.data.info,
      results: response.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/getCharacterById", async (req, res) => {
  try {
    let response = await axios.get(
      `${BASEURL}${endpoints.characters}/${req.body.characterId}`
    );

    //Get the episode numbers from the character object.
    let arrayOfEpisodeNumbers = getArrayOfIds(response.data.episode);
    //Get the episodes based on the episode numbers.
    let getMultipleEpisodes = await axios.get(
      `${BASEURL}${endpoints.episodes}/${arrayOfEpisodeNumbers}`
    );
    //Add the episodes to the response object.
    response.data.episode = getMultipleEpisodes.data;

    //Check if response.data.episode is array
    if (!Array.isArray(response.data.episode)) {
      response.data.episode = [response.data.episode];
    }

    //Get the location and origin id from the response object.
    let locationId = response.data.location.url.split("/").pop();
    let originId = response.data.origin.url.split("/").pop();

    //Check if the location and origin name is unknown.
    if (response.data.origin.name !== "unknown") {
      //Get the origin location based on the origin id.
      let getOrigin = await axios.get(
        `${BASEURL}${endpoints.locations}/${originId}`
      );
      //Add the origin location to the response object.
      response.data.origin = getOrigin.data;
    }

    //Check if the location name is unknown.
    if (response.data.location.name !== "unknown") {
      //Get the location based on the location id.
      let getLocation = await axios.get(
        `${BASEURL}${endpoints.locations}/${locationId}`
      );
      //Add the location to the response object.
      response.data.location = getLocation.data;
    }

    res.render("character-detail.ejs", { character: response.data });
  } catch (error) {
    console.log(error);
  }
});

app.post("/getLocationById", async (req, res) => {
  try {
    let response = await axios.get(
      `${BASEURL}${endpoints.locations}/${req.body.locationId}`
    );
    let arrayOfResidentIds = getArrayOfIds(response.data.residents);
    let getMultipleResidents = await axios.get(
      `${BASEURL}${endpoints.characters}/${arrayOfResidentIds}`
    );
    response.data.residents = getMultipleResidents.data;
    res.render("location-detail.ejs", { location: response.data });
  } catch (error) {
    console.log(error);
  }
});

app.post("/getEpisodeById", async (req, res) => {
  try {
    let response = await axios.get(
      `${BASEURL}${endpoints.episodes}/${req.body.episodeId}`
    );
    let arrayOfCharacterIds = getArrayOfIds(response.data.characters);
    let getMultipleCharacters = await axios.get(
      `${BASEURL}${endpoints.characters}/${arrayOfCharacterIds}`
    );
    response.data.characters = getMultipleCharacters.data;
    res.render("episode-detail.ejs", { episode: response.data });
  } catch (error) {
    console.log(error);
  }
});

app.post("/search", async (req, res) => {
  try {
    let searchProperty = req.body.searchProperty;
    let searchValue = req.body.searchValue;
    let endPoint = req.body.endPoint;
    console.log("End point: ", endPoint);
    let response = "";

    //Check if the user wants to go to a specific page.
    if ("page" in req.body) {
      response = await axios.get(
        `${BASEURL}${endPoint}?page=${req.body.page}&${searchProperty}=${searchValue}`
      );
    } else {
      response = await axios.get(
        `${BASEURL}${endPoint}?${searchProperty}=${searchValue}`
      );
    }

    response.data.info.pageTitle = `${searchProperty[0].toUpperCase()}${searchProperty
      .slice(1)
      .toLowerCase()} - ${searchValue}`;
    let currentPage = calculateCurrentPage(response.data.info);
    response.data.info.currentPage = currentPage;
    response.data.info.searchProperty = searchProperty;
    response.data.info.searchValue = searchValue;
    response.data.info.endPoint = endPoint;
    res.render("filter-detail.ejs", {
      info: response.data.info,
      results: response.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function getArrayOfIds(array) {
  let arrayOfIds = [];
  array.forEach((episode) => {
    let episodeNumber = episode.split("/").pop();
    arrayOfIds.push(episodeNumber);
  });
  return arrayOfIds;
}

function calculateCurrentPage(info) {
  //Calculate the current page based on the next page url or previous page url.
  let match = 0;
  if (info.next !== null) {
    match = Number(info.next.match(/\d+/)) - 1;
  } else if (info.prev !== null) {
    match = Number(info.prev.match(/\d+/)) + 1;
  }
  return match;
}

import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const PORT = 3000;
const BASEURL = "https://rickandmortyapi.com/api/";

app.use(bodyParser.json());

// 3. Use the public folder for static files.
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
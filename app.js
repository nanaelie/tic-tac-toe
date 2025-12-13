import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import homeRoutes from "./routes/index.routes.js";
import gameRoutes from "./routes/game.routes.js";
import resultsRoutes from "./routes/results.routes.js";
import infosRoutes from "./routes/infos.routes.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));

app.get('/', (req, res) => {
    return res.render("index");
})

app.get('/game', (req, res) => {
    return res.render("game");
})

app.get('/infos', (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const pkg = JSON.parse(
      fs.readFileSync(path.join(__dirname, "/package.json"), "utf8")
    );

    const version_code = pkg.version + '(1)';
    const about = [
        "This Tic-Tac-Toe web application is a simple and lightweight project created for learning and experimentation.",
        "It focuses on clarity, ease of use, and delivering a smooth gameplay experience.",
        "Enjoy!"
    ];
    return res.render("infos", { about, version_code });
})

app.get('/results', (req, res) => {
    return res.render("results");
})

app.use((req, res) => {
    return res.status(404).render("404");
})

export default app;


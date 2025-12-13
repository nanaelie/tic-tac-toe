import express from "express";
import path from "path";

import homeRoutes from "./routes/index.routes.js";
import gameRoutes from "./routes/game.routes.js";
import resultsRoutes from "./routes/results.routes.js";
import infosRoutes from "./routes/infos.routes.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// app.use("/", homeRoutes);
// app.use("/game", gameRoutes);
// app.use("/infos", infosRoutes);
// app.use("/results", resultsRoutes);

app.use(express.static("public"));

app.get('/', (req, res) => {
    const data = ``;
    return res.render("index", { data });
})

app.get('/game', (req, res) => {
    const data = ``;
    return res.render("game", { data });
})

app.get('/infos', (req, res) => {
    const data = ``;
    return res.render("infos", { data });
})

app.get('/results', (req, res) => {
    const data = ``;
    return res.render("results", { data });
})

app.use((req, res) => {
    const data = ``;
    return res.status(404).render("404", { data: "" });
})

export default app;


import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import homeRoutes from "./routes/index.routes.js";
import gameRoutes from "./routes/game.routes.js";
import resultsRoutes from "./routes/results.routes.js";
import infosRoutes from "./routes/infos.routes.js";

import database from './config/db.js';

const app = express();

app.use(cookieParser(process.env.SECRET_KEY)); 

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateViewCounter() {
    const client = await database.connect();

    try {
        const result = await client.query(`SELECT counter FROM viewcounter LIMIT 1;`);

        let counter = 1;
        if (result.rows.length > 0) {
            counter = result.rows[0].counter + 1;
            await client.query(`UPDATE viewcounter SET counter = $1`, [counter]);
        } else {
            await client.query(`INSERT INTO viewcounter(counter) VALUES ($1)`, [counter]);
        }
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
}

app.get("/__ctn__", (req, res) => {
    const infos = {
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
    };

    console.log("Device info:", infos);
    
    res.cookie("is_admin", "true", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10
    });

    return res.redirect("/");
});

app.get('/', async (req, res) => {
    updateViewCounter();
    
    const isAdmin = req.signedCookies.is_admin === "true";
    let counter;
    
    if (isAdmin) {
        try {
            const result = await database.query("select counter from viewcounter");
            counter = 1;
            if (result.rows.length > 0) {
                counter = result.rows[0].counter;
            }
        } catch (err) { console.log(err) }
    }
    
    return res.render("index", { isAdmin, counter });
})

app.get('/game', (req, res) => {
    return res.render("game");
})

app.get('/infos', (req, res) => {
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


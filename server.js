import http from "http";
import app from "./app.js";

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () =>
    console.log(`Serveur sur http://localhost:${PORT}`)
);

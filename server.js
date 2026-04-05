import express from "express";
import { prepareDatabase } from "./src/db/prepareDatabase.js";
import { seedDb } from "./src/db/prepareDatabase.js";
import { generateEntitiesCRUD, registerEntityRoutes } from "./src/entities/entities.js";
import { registerMediaRoutes } from "./src/media/media.js";
import path from "node:path";
import cors from "cors";

const __dirname = process.cwd();
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "/src/dist")));
app.use(cors());

const PORT = process.env.PORT || 3000;

// Check database structure and create it if it doesn't exist
await prepareDatabase();
await seedDb();

// Register entities and entities management API routes
registerEntityRoutes(app);
generateEntitiesCRUD(app);

// Register media and media management API routes
registerMediaRoutes(app);

// Frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/src/dist/index.html"));
});

// Listen for requests
app.listen(PORT, () => console.log("Server running at http://localhost:" + PORT));
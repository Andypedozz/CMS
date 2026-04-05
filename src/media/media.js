import { db } from "../db/db.js";

export async function registerMediaRoutes(app) {

    // GET all media
    app.get("/api/media", async (req, res) => {
        const result = await db("Media").select("*");
        
        res.json(result);
    })

    // GET media by id
    app.get("/api/media/:id", async (req, res) => {
        const result = await db("Media").select("*").where({ id: req.params.id });
        
        res.json(result);
    })

    // POST create a new media
    app.post("/api/media", async (req, res) => {
        const result = await db("Media").insert(req.body);
        
        res.json(result);
    })

    // PUT update a media (just for renaming)
    app.put("/api/media/:id", async (req, res) => {
        const result = await db("Media").update(req.body).where({ id: req.params.id });
        
        res.json(result);
    })

    // DELETE a media
    app.delete("/api/media/:id", async (req, res) => {
        const result = await db("Media").delete().where({ id: req.params.id });
        
        res.json(result);
    })

}
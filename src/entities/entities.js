import { db } from "../db/db.js";

// Generate entities endpoints
export async function registerEntityRoutes(app) {
    
    // GET all entities
    app.get("/api/entities", async (req, res) => {
        const result = await db("Entity").select("*");
        
        res.json(result);
    })
    
    // GET an entity by id
    app.get("/api/entities/:id", async (req, res) => {
        const result = await db("Entity").select("*").where({ id: req.params.id });
        
        res.json(result);
    })
    
    app.get("/api/fields", async (req, res) => {
        const result = await db("Field").select("*");
        
        res.json(result);
    })

    app.get("/api/records", async (req, res) => {
        const result = await db("Record").select("*");
        
        res.json(result);
    })

    app.post("/api/records", async (req, res) => {
        const result = await db("Record").insert(req.body);
        
        res.json(result);
    })

    app.post("/api/fields", async (req, res) => {
        const result = await db("Field").insert(req.body);
        
        res.json(result);
    })
    
    // POST create a new entity
    app.post("/api/entities", async (req, res) => {
        const result = await db("Entity").insert(req.body).select("*");
        generateEntitiesCRUD(app);

        res.json(result);
    })
    
    // PUT update an entity
    app.put("/api/entities/:id", async (req, res) => {
        const result = await db("Entity").update(req.body).where({ id: req.params.id });
        
        res.json(result);
    })
    
    // DELETE an entity
    app.delete("/api/entities/:id", async (req, res) => {
        const result = await db("Entity").delete().where({ id: req.params.id });
        
        // Need to add cascade deletion
        
        res.json(result);
    })

    
}

// Generate CRUD for single entity data
export async function generateEntitiesCRUD(app) {
    const entities = await db("Entity").select("*");

    // Entities endpoints
    for (const entity of entities) {
        // GET all records of an entity
        app.get(`/api/${entity.slug}/`, async (req, res) => {
            const entityExists = await db("Entity").select("*").where({ id: entity.id });
            if (entityExists.length == 0) {
                return res.status(404).json({ message: "Entity not found" });
            }

            const result = await db("Record").select("*").where({ entityId: entity.id });
            
            res.json(result);
        });
        
        // GET one record of an entity
        app.get(`/api/${entity.slug}/:id`, async (req, res) => {
            const entityExists = await db("Entity").select("*").where({ id: entity.id });
            if (entityExists.length == 0) {
                return res.status(404).json({ message: "Entity not found" });
            }
            const result = await db("Record").select("*").where({ entityId: entity.id, id: req.params.id });
            
            res.json(result);
        });
        
        // GET all fields of an entity
        app.get(`/api/${entity.slug}/fields`, async (req, res) => {
            const entityExists = await db("Entity").select("*").where({ id: entity.id });
            if (entityExists.length == 0) {
                return res.status(404).json({ message: "Entity not found" });
            }
            const result = await db("Field").select("*").where({ entityId: entity.id });
            
            res.json(result);
        });
        
        // POST endpoints
        app.post(`/api/${entity.slug}/`, async (req, res) => {
            const result = await db("Record").insert(req.body);
    
            res.json(result);
        })

        // PUT endpoints
        app.post(`/api/${entity.slug}/:id`, async (req, res) => {
            const result = await db("Record").update(req.body).where({ entityId: entity.id, id: req.params.id });
    
            res.json(result);
        })

        // DELETE endpoints
        app.delete(`/api/${entity.slug}/:id`, async (req, res) => {
            const result = await db("Record").delete().where({ entityId: entity.id, id: req.params.id });
    
            res.json(result);
        })
    }
}
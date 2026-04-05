import { db } from "./db.js";

export async function prepareDatabase() {
    // User
    const userExists = await db.schema.hasTable("User");
    if (!userExists) {
        await db.schema.createTable("User", table => {
            table.increments("id", { primaryKey: true });
            table.string("email").unique();
            table.string("passwordHash");
            table.string("name");
            table.integer("roleId").references("id").inTable("Role");
            table.dateTime("createdAt").notNullable().defaultTo(db.fn.now());
            table.dateTime("updatedAt").notNullable().defaultTo(db.fn.now());
        })
    }
    
    // Role
    const roleExists = await db.schema.hasTable("Role");
    if (!roleExists) {
        await db.schema.createTable("Role", table => {
            table.increments("id", { primaryKey: true });
            table.string("name");
            table.string("description");
        })
    }
    
    // Permission
    const permissionExists = await db.schema.hasTable("Permission");
    if (!permissionExists) {
        await db.schema.createTable("Permission", table => {
            table.increments("id", { primaryKey: true });
            table.integer("roleId").references("id").inTable("Role");
            table.integer("entityId").references("id").inTable("Entity");
            table.boolean("canCreate");
            table.boolean("canRead");
            table.boolean("canUpdate");
            table.boolean("canDelete");
        })
    }
    
    // Entity
    const entityExists = await db.schema.hasTable("Entity");
    if (!entityExists) {
        await db.schema.createTable("Entity", table => {
            table.increments("id", { primaryKey: true });
            table.string("name");
            table.string("slug").unique();
            table.string("tableName");
            table.dateTime("createdAt").notNullable().defaultTo(db.fn.now());
            table.dateTime("updatedAt").notNullable().defaultTo(db.fn.now());
        })
    }
    
    // Field
    const fieldExists = await db.schema.hasTable("Field");
    if (!fieldExists) {
        await db.schema.createTable("Field", table => {
            table.increments("id", { primaryKey: true });
            table.integer("entityId").references("id").inTable("Entity");
            table.string("name");
            table.string("slug");
            table.string("type");
            table.boolean("required");
            table.boolean("uniqueField");
            table.string("defaultValue");
            table.string("configJson");
            table.integer("position");
    
            table.index(["entityId"]);
        })
    }
    
    // Relation
    const relationExists = await db.schema.hasTable("Relation");
    if (!relationExists) {
        await db.schema.createTable("Relation", table => {
            table.increments("id", { primaryKey: true });
            table.integer("fieldId").references("id").inTable("Field");
            table.string("relationType");
            table.integer("targetEntityId").references("id").inTable("Entity");
            table.string("pivotTable");
        })
    }
    
    // Record
    const recordExists = await db.schema.hasTable("Record");
    if (!recordExists) {
        await db.schema.createTable("Record", table => {
            table.increments("id", { primaryKey: true });
            table.integer("entityId").references("id").inTable("Entity");
            table.text("dataJson");
            table.integer("createdById").references("id").inTable("User");
            table.integer("updatedById").references("id").inTable("User");
            table.dateTime("createdAt").notNullable().defaultTo(db.fn.now());
            table.dateTime("updatedAt").notNullable().defaultTo(db.fn.now());
            table.string("status");
    
            table.index(["entityId"]);
        })
    }
    
    // RecordVersion
    const recordVersionExists = await db.schema.hasTable("RecordVersion");
    if (!recordVersionExists) {
        await db.schema.createTable("RecordVersion", table => {
            table.increments("id", { primaryKey: true });
            table.integer("recordId").references("id").inTable("Record");
            table.integer("entityId").references("id").inTable("Entity");
            table.text("dataJson");
            table.dateTime("createdAt").notNullable().defaultTo(db.fn.now());
            table.integer("createdById").references("id").inTable("User");
        })
    }
    
    // Media
    const mediaExists = await db.schema.hasTable("Media");
    if (!mediaExists) {
        await db.schema.createTable("Media", table => {
            table.increments("id", { primaryKey: true });
            table.string("filename");
            table.string("mimeType");
            table.integer("size");
            table.string("path");
            table.string("altText");
            table.integer("uploadedById").references("id").inTable("User");
            table.dateTime("createdAt").notNullable().defaultTo(db.fn.now());
        })
    }
    
    // Tag
    const tagExists = await db.schema.hasTable("Tag");
    if (!tagExists) {
        await db.schema.createTable("Tag", table => {
            table.increments("id", { primaryKey: true });
            table.string("name");
            table.string("slug").unique();
        })
    }
    
    // RecordTag
    const recordTagExists = await db.schema.hasTable("RecordTag");
    if (!recordTagExists) {
        await db.schema.createTable("RecordTag", table => {
            table.integer("recordId").references("id").inTable("Record");
            table.integer("tagId").references("id").inTable("Tag");
            table.primary(["recordId", "tagId"]);
        })
    }
    
    // ApiToken
    const apiTokenExists = await db.schema.hasTable("ApiToken");
    if (!apiTokenExists) {
        await db.schema.createTable("ApiToken", table => {
            table.increments("id", { primaryKey: true });
            table.string("name");
            table.string("tokenHash");
            table.dateTime("createdAt").notNullable().defaultTo(db.fn.now());
            table.dateTime("expiresAt");
        })
    }
    
    // WebHook
    const webHookExists = await db.schema.hasTable("WebHook");
    if (!webHookExists) {
        await db.schema.createTable("WebHook", table => {
            table.increments("id", { primaryKey: true });
            table.string("event");
            table.string("url");
            table.string("secret");
        })
    }
}

export async function seedDb() {

    // Roles
    const roles = await db("Role").select("*");
    if (roles.length == 0) {
        await db("Role").insert([
            { id: 1, name: "admin", description: "Administrator" },
            { id: 2, name: "editor", description: "Content editor" }
        ])
    }

    // Users
    const users = await db("User").select("*");
    if (users.length == 0) {
        await db("User").insert([
            {
                id: 1,
                email: "admin@test.com",
                passwordHash: "test",
                name: "Admin",
                roleId: 1
            },
            {
                id: 2,
                email: "editor@test.com",
                passwordHash: "test",
                name: "Editor",
                roleId: 2
            }
        ])
    }

    console.log("Seed data inserted")
}
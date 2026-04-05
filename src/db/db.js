import knex from "knex";

export const db = knex({
    client: "better-sqlite3",
    connection: {
        filename: "./database.sqlite"
    },
    useNullAsDefault: true
})

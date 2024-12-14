/**
 * @module schema
 * @description Handles table schema management and validation.
 */

import { logError, logSuccess } from "../logger/logger.js";
import { getTableFilePath, writeJSON } from "./storage.js";

/**
 * Create a new table schema and initialises the data file.
 * @param {string} query - SQL query to create a table.
 */
export function createTable(query) {
    const match = query.match(/CREATE TABLE (\w+) \((.+)\)/i);

    //   console.log(query, match);

    if (!match) {
        logError("Invalid CREATE TABLE query");
        throw new Error("Invalid CREATE TABLE query");
    }

    const tableName = match[1];
    if (tableName.toLocaleLowerCase() === "tables") {
        logError("Cannot create table named tables");
        throw new Error("Cannot create table named tables");
    }
    if (tableName.toLocaleLowerCase() === "columns") {
        logError("Cannot create table named columns");
        throw new Error("Cannot create table named columns");
    }

    const columns = match[2].split(",").map((col) => col.trim());
    const schema = columns.reduce((acc, curr) => {
        const [name, type] = curr.split(" ");
        if (!name || !type) {
            logError("Invalid column definition");
            throw new Error("Invalid column definition");
        }
        acc[name] = type.toUpperCase();
        return acc;
    }, {});

    const schemaPath = getTableFilePath(tableName, "schema");
    const tablePath = getTableFilePath(tableName, "data");

    writeJSON(schemaPath, schema);
    writeJSON(tablePath, []);
    logSuccess(`Table "${tableName}" created successfully`);
}

// createTable("CREATE TABLE users (id INT, name text)");

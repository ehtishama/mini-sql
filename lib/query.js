/**
 * @module query
 * @description Parses and executes SQL-like queries.
 */

import { logError, logSuccess } from "../logger/logger.js";
import { getTableFilePath, readJSON, writeJSON } from "./storage.js";

/**
 * Adds a new row to the table's data file.
 * @param {string} query - SQL INSERT query insert data.
 */
export function insertInto(query) {
    const match = query.match(/INSERT INTO (\w+) \((.+)\) VALUES \((.+)\)/i);

    if (!match) {
        logError("Invalid INSERT INTO query");
        throw new Error("Invalid INSERT INTO query");
    }

    const tableName = match[1];
    const columns = match[2].split(",").map((col) => col.trim());
    const values = match[3].split(",").map((val) => val.trim().replace(/'/g, "").replace(/"/g, ""));

    const schema = readJSON(getTableFilePath(tableName, "schema"));
    const data = readJSON(getTableFilePath(tableName, "data"));

    if (!schema || !data) {
        logError(`Table ${tableName} does not exist`);
        throw new Error(`Table ${tableName} does not exist`);
    }

    const row = {};
    columns.forEach((col, idx) => {
        if (!schema[col]) {
            logError(`Column ${col} does not exist`);
            throw new Error(`Column ${col} does not exist`);
        }

        row[col] = values[idx];
    });

    data.push(row);
    writeJSON(getTableFilePath(tableName, "data"), data);
    logSuccess(`New row inserted into ${tableName} successfully`);
}

/**
 * Select rows from a table as per query
 * @param {string} query - SQL query to select data
 */
export function select(query) {
    const match = query.match(/SELECT (.+) FROM (\w+)/i);
    if (!match) {
        logError("Invalid select query.");
        throw new Error("Invalid select query.");
    }

    const columns = match[1].split(",").map((col) => col.trim());
    const tableName = match[2];

    const data = readJSON(getTableFilePath(tableName, "data"));
    if (!data) {
        logError(`Table ${tableName} does not exist.`);
        throw new Error(`Table ${tableName} does not exist.`);
    }

    const filteredData = data;

    const result = filteredData.map((row) => {
        if (columns[0] === "*") {
            return row;
        }
        const selectedRow = {};
        columns.forEach((col) => (selectedRow[col] = row[col]));

        return selectedRow;
    });

    console.table(result);
    logSuccess("Select query executed successfully.");
}

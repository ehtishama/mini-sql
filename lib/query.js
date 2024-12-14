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
        // TODO: Homework - make it smart by checking what is missing in the query.
        // TODO: Homework - make it case insensitive
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
        // TODO: Homework - check for INT, FLOAT and BOOLEAN'S
    });

    data.push(row);
    writeJSON(getTableFilePath(tableName, "data"), data);
    logSuccess(`New row inserted into ${tableName} successfully`);
}

/**
 * Selects rows from a table as per query
 * @param {string} query - SQL query to select data
 */
export function select(query) {
    const match = query.match(/SELECT (.+) FROM (\w+)(?: WHERE (.+))?/i);
    if (!match) {
        logError("Invalid select query.");
        throw new Error("Invalid select query.");
    }

    const columns = match[1].split(",").map((col) => col.trim());
    const tableName = match[2];
    const condition = match[3];

    const data = readJSON(getTableFilePath(tableName, "data"));
    if (!data) {
        logError(`Table ${tableName} does not exist.`);
        throw new Error(`Table ${tableName} does not exist.`);
    }

    // const filteredData = consdition ? data.filter(row => {
    //     const conditionFn = row => condition.replace(/(w+)/g)
    // }) : data;

    const filteredData = data;

    const result = filteredData.map((row) => {
        if (columns[0] === "*") {
            return row;
        }
        const selectedRow = {};
        columns.forEach((col) => (selectedRow[col] = row[col]));

        return selectedRow;
    });

    logSuccess("Select query executed successfully.");
    console.table(result);
}

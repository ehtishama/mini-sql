/**
 * @module query
 * @description Parses and executes SQL-like queries.
 */

/**
 * @typedef {Object} Aggregation
 * @property {string} type - e.g. COUNT, AVG
 * @property {string} column - The name of column
 * @property {string} alias
 */

/**
 * An object containing parsed query components
 * @typedef {Object} ParsedQuery
 * @property {string} tableName - The X Coordinate
 * @property {Array<string>} columns - The Y Coordinate
 * @property {Array<Aggregation>} aggregations
 * @property {string} whereClause
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
// TODO:: Add JOINS

/**
 * Executes a SELECT query with optional aggregations.
 * Supports AVG and COUNT functions.
 * @param {string} query - SQL query to select data
 * @returns {Array<object>} The result set
 */
export function select(query) {
    try {
        const parsedQuery = parseSelectQuery(query);
        const data = readJSON(getTableFilePath(parsedQuery.tableName));
        if (!data) {
            logError(`Table ${parsedQuery.tableName} does not exist.`);
            throw new Error(`Table ${parsedQuery.tableName} does not exist.`);
        }

        let result = [];

        if (parsedQuery.aggregations.length === 0) {
            // NO aggregations to perform
            result = data
                .filter((row) => evaluateWhereClause(row, parsedQuery.whereClause))
                .map((row) => {
                    if (parsedQuery.columns.includes("*")) {
                        return row;
                    }
                    const selectedRow = {};
                    parsedQuery.columns.forEach((col) => (selectedRow[col] = row[col]));

                    return selectedRow;
                });
        } else {
            // perfrom aggregations
            const aggregationResults = {};

            parsedQuery.aggregations.forEach((agg) => {
                if (agg.type === "COUNT") {
                    if (agg.column === "*") {
                        aggregationResults[agg.alias] = data.length;
                    } else {
                        aggregationResults[agg.alias] = data.filter(
                            (row) => row[agg.column] !== undefined && row[agg.column] !== null,
                        ).length;
                    }
                } else if (agg.type === "AVG") {
                    const filteredData = parsedQuery.whereClause
                        ? data.filter((row) => evaluateWhereClause(row, parsedQuery.whereClause))
                        : data;

                    const numericData = filteredData
                        .filter((row) => {
                            try {
                                Number.parseInt(row[agg.column]);
                                return true;
                            } catch (_) {
                                return false;
                            }
                        })
                        .map((row) => Number.parseInt(row[agg.column]));

                    const sum = numericData.reduce((acc, val) => acc + val, 0);

                    aggregationResults[agg.alias] =
                        numericData.length > 0 ? sum / numericData.length : 0;
                }
            });

            result.push(aggregationResults);
        }
        console.table(result);
        logSuccess("Select query executed successfully.");

        return result;
    } catch (error) {
        logError("Select query failed.", error);
        throw error;
    }
}

/**
 * Parses a SELECT query to extract table name, columns, and aggregations.
 * @param {string} query - The SELECT query to parse
 * @returns {ParsedQuery} - Object containing parsed query components
 */
function parseSelectQuery(query) {
    const selectRegex = /SELECT\s+(.+)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i;
    const match = query.match(selectRegex);

    if (!match) {
        throw new Error("SELECT query syntax error");
    }

    const columnsPart = match[1].trim();
    const tableName = match[2].trim();
    const whereClause = match[3] ? match[3].trim() : null;

    const columns = [];
    const aggregations = [];

    const columnsSplit = columnsPart.split(",").map((col) => col.trim());

    columnsSplit.forEach((col) => {
        const countMatch = col.match(/^COUNT\((\w+|\*)\)\s+AS\s+(\w+)$/i);
        const avgMatch = col.match(/^AVG\((\w+|\*)\)\s+AS\s+(\w+)$/i);

        if (countMatch) {
            aggregations.push({
                type: "COUNT",
                column: countMatch[1],
                alias: countMatch[2] || "COUNT",
            });
        } else if (avgMatch) {
            aggregations.push({
                type: "AVG",
                column: avgMatch[1],
                alias: avgMatch[2] || "AVG",
            });
        } else {
            columns.push(col);
        }
    });

    return {
        tableName,
        columns,
        aggregations,
        whereClause,
    };
}

/**
 * Evaluates the WEHRE clause on a given row
 * @param {object} row - The data row of a table
 * @param {string|null} whereClause - The WHERE clause of SELECT query
 * @returns boolean - Whether the row satisfies the condition
 */
function evaluateWhereClause(row, whereClause) {
    if (!whereClause) {
        return true;
    }

    const condition = whereClause.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, "row.$&");
    try {
        const fn = new Function("row", `return ${condition}`);
        return fn(row);
    } catch (error) {
        logError("Error evaluating WHERE clause", error);
        return false;
    }
}

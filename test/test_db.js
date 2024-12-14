import { insertInto, select } from "../lib/query.js";
import { createTable } from "../lib/schema.js";
import { logger } from "../logger/logger.js";
import pc from "picocolors";

function testCreateTable_v1() {
    const createTableQuery = "CREATE TABLE users (id INT, name TEXT, age INT, student BOOlEAN)";

    try {
        createTable(createTableQuery);
        logger("[TEST]", pc.magenta, console.info, "Table creation test passed.\n");
    } catch (error) {
        logger("[TEST]", pc.red, console.error, "Table creation test failed.\n", error);
    }
}

function testInsertInto_v1() {
    const insertQuery_1 = `INSERT INTO users (id, name, age, student) VALUES (101, "Alice", 22, true)`;
    const insertQuery_2 = `INSERT INTO users (id, name, age, student) VALUES (102, "BOB", 25, true)`;
    const insertQuery_3 = `INSERT INTO users (id, name, age, student) VALUES (103, "John", 22, false)`;
    const insertQuery_4 = `INSERT INTO users (id, name, age, student) VALUES (104, "Tom", 28, true)`;
    const insertQuery_5 = `INSERT INTO users (id, name, age, student) VALUES (105, "MLH", 10, false)`;

    try {
        insertInto(insertQuery_1);
        insertInto(insertQuery_2);
        insertInto(insertQuery_3);
        insertInto(insertQuery_4);
        insertInto(insertQuery_5);
        logger("[TEST]", pc.magenta, console.info, "Insert Into test passed.\n");
    } catch (error) {
        logger("[TEST]", pc.red, console.error, "Insert Into test failed.\n", error);
    }
}

function testSelect_v1() {
    const selectQuery_1 = "SELECT id, name FROM users";
    const selectQuery_2 = "SELECT * FROM users";

    try {
        select(selectQuery_1);
        select(selectQuery_2);
        logger("[TEST]", pc.magenta, console.info, "Select query test passed.\n");
    } catch (error) {
        logger("[TEST]", pc.red, console.error, "Select query test failed.\n", error);
    }
}

export const main = () => {
    testCreateTable_v1();
    testInsertInto_v1();
    testSelect_v1();
};

main();

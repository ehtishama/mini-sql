import { backupDatabase, restoreDatabase } from "../lib/backup.js";
import { createIndex, searchWithIndex } from "../lib/indexing.js";
import { performWithLock } from "../lib/locks.js";
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
    const insertQuery_6 = `INSERT INTO users (id, name, age, student) VALUES (106, "GHW", 10, false)`;

    try {
        insertInto(insertQuery_1);
        insertInto(insertQuery_2);
        insertInto(insertQuery_3);
        insertInto(insertQuery_4);
        insertInto(insertQuery_5);
        insertInto(insertQuery_6);
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

function testCreateIndex_v1() {
    try {
        createIndex("users", "name");
        createIndex("users", "age");
        logger("[TEST]", pc.magenta, console.info, "Create index test passed\n");
    } catch (error) {
        logger("[TEST]", pc.red, console.error, "Create index failed\n", error);
    }
}

function testSearchWithIndex_v1() {
    try {
        searchWithIndex("users", "name", "John");
        searchWithIndex("users", "age", 10);
        logger("[TEST]", pc.magenta, console.info, "Search with index test passed\n");
    } catch (error) {
        logger("[TEST]", pc.red, console.error, "Search with index failed\n", error);
    }
}

function testBackupDatabase_v1() {
    try {
        backupDatabase("./backup");
        logger("[TEST]", pc.magenta, console.info, "Database backup test passed\n");
    } catch (error) {
        logger("[TEST]", pc.red, console.error, "Database backup test failed\n", error);
    }
}

function testRestoreDatabase_v1() {
    try {
        restoreDatabase("./backup");
        logger("[TEST]", pc.magenta, console.info, "Database restore test passed\n");
    } catch (error) {
        logger("[TEST]", pc.red, console.error, "Database restore test failed\n", error);
    }
}

async function testLocks_v1() {
    try {
        const insertQueries = [
            `INSERT INTO users (id, name, age, student) VALUES (107, "Eve", 23, true)`,
            `INSERT INTO users (id, name, age, student) VALUES (108, "Josh", 28, false)`,
        ];

        const performInsert = async (query, taskName) => {
            await performWithLock("users", async () => {
                logger(`[TEST]`, pc.magenta, console.info, `${taskName} started.`);
                insertInto(query);

                await new Promise((resolve) => setTimeout(resolve, 5000));
                logger(`[TEST]`, pc.magenta, console.info, `${taskName} completed.`);
            });
        };

        const promises = [
            performInsert(insertQueries[0], "Task 1"),
            performInsert(insertQueries[1], "Task 2"),
        ];

        await Promise.allSettled(promises);

        logger(`[TEST]`, pc.magenta, console.info, `Locks test passed.`);
    } catch (error) {
        logger(`[TEST]`, pc.red, console.error, `Lock test failed.\n`, error);
    }
}

export const main = () => {
    testCreateTable_v1();
    testInsertInto_v1();
    testSelect_v1();
    testCreateIndex_v1();
    testSearchWithIndex_v1();
    testBackupDatabase_v1();
    testRestoreDatabase_v1();
    testLocks_v1();
};

main();

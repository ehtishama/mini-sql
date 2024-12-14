/**
 * @module backup
 * @description Handles database backup and restore functionality
 */

import fs from "fs";
import path from "path";
import { DATABASE_PATH } from "./storage.js";
import { logError, logSuccess } from "../logger/logger.js";

/**
 * Backs up the entire database directory to a specified directory
 * @param {string} backupPath - Path where the backup would be saved
 */
export function backupDatabase(backupPath) {
    if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
    }

    const files = fs.readdirSync(DATABASE_PATH);
    files.forEach((file) => {
        const source = path.join(DATABASE_PATH, file);
        const dest = path.join(backupPath, file);

        fs.copyFileSync(source, dest);
    });

    logSuccess(`Database backup completed. The backup is available at ${backupPath}.`);
}

export function restoreDatabase(backupPath) {
    if (!fs.existsSync(backupPath)) {
        logError(`The backup directory ${backupPath} does not exist.`);
        throw new Error(`The backup directory ${backupPath} does not exist.`);
    }

    const files = fs.readdirSync(backupPath);
    files.forEach((file) => {
        const source = path.join(backupPath, file);
        const dest = path.join(DATABASE_PATH, file);

        fs.copyFileSync(source, dest);
    });

    logSuccess(`Database successfully restored from the backup at ${backupPath}.`);
}

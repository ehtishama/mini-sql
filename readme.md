# mini-sql-db

A file-based SQL database written in JavaScript. Uses SQLite-like syntax for querying and managing data.

## Folder Structure

```plaintext
mini-sql-db/
|--- lib/
| |--- storage.js # Create JSON files to store data and run read/write operations
| |--- schema.js # Table schema management and validation
| |--- query.js # Query parsing and execution
| |--- indexing.js # Implements indexing and search operation
| |--- backup.js # Database backup and restoration
| |--- mutext.js # Mutext Class
| |--- locks.js # Performs operation on table with locks
|--- logger/
| |--- logger.js # Logging utilities
|--- test/
| |--- test_db.js # unit tests
|--- index.js
|--- package.json
|--- README.md
```

## Setup

- Clone the project
- Run `npm install` inside the project directory
- Create `.env` file at the root
- Copy `.env.example` over to `.env`file
- Update the `MINI_SQL_DB_PATH` path in the `.env` file

## Test

- Run `node test/test_db.js` # This is the test file for all the lib functions.

### Test Sample Output

```bash
[16 Dec 2024, 16:08:20.626] [SUCCESS] Table "users" created successfully
[16 Dec 2024, 16:08:20.638] [TEST] Table creation test passed.

[16 Dec 2024, 16:08:20.640] [SUCCESS] New row inserted into users successfully
[16 Dec 2024, 16:08:20.641] [SUCCESS] New row inserted into users successfully
[16 Dec 2024, 16:08:20.642] [SUCCESS] New row inserted into users successfully
[16 Dec 2024, 16:08:20.642] [SUCCESS] New row inserted into users successfully
[16 Dec 2024, 16:08:20.643] [SUCCESS] New row inserted into users successfully
[16 Dec 2024, 16:08:20.644] [SUCCESS] New row inserted into users successfully
[16 Dec 2024, 16:08:20.645] [TEST] Insert Into test passed.

┌─────────┬───────┬─────────┐
│ (index) │ id    │ name    │
├─────────┼───────┼─────────┤
│ 0       │ '101' │ 'Alice' │
│ 1       │ '102' │ 'BOB'   │
│ 2       │ '103' │ 'John'  │
│ 3       │ '104' │ 'Tom'   │
│ 4       │ '105' │ 'MLH'   │
│ 5       │ '106' │ 'GHW'   │
└─────────┴───────┴─────────┘
[16 Dec 2024, 16:08:20.648] [SUCCESS] Select query executed successfully.
┌─────────┬───────┬─────────┬──────┬─────────┐
│ (index) │ id    │ name    │ age  │ student │
├─────────┼───────┼─────────┼──────┼─────────┤
│ 0       │ '101' │ 'Alice' │ '22' │ 'true'  │
│ 1       │ '102' │ 'BOB'   │ '25' │ 'true'  │
│ 2       │ '103' │ 'John'  │ '32' │ 'false' │
│ 3       │ '104' │ 'Tom'   │ '28' │ 'true'  │
│ 4       │ '105' │ 'MLH'   │ '10' │ 'false' │
│ 5       │ '106' │ 'GHW'   │ '10' │ 'false' │
└─────────┴───────┴─────────┴──────┴─────────┘
[16 Dec 2024, 16:08:20.652] [SUCCESS] Select query executed successfully.
[16 Dec 2024, 16:08:20.652] [TEST] Select query test passed.

[16 Dec 2024, 16:08:20.654] [SUCCESS] Index created on column: "name" of table "users"
[16 Dec 2024, 16:08:20.655] [SUCCESS] Index created on column: "age" of table "users"
[16 Dec 2024, 16:08:20.655] [TEST] Create index test passed

[16 Dec 2024, 16:08:20.657] [INFO] Found 1 matches for John in table users
┌─────────┬───────┬────────┬──────┬─────────┐
│ (index) │ id    │ name   │ age  │ student │
├─────────┼───────┼────────┼──────┼─────────┤
│ 0       │ '103' │ 'John' │ '32' │ 'false' │
└─────────┴───────┴────────┴──────┴─────────┘
[16 Dec 2024, 16:08:20.659] [INFO] Found 2 matches for 10 in table users
┌─────────┬───────┬───────┬──────┬─────────┐
│ (index) │ id    │ name  │ age  │ student │
├─────────┼───────┼───────┼──────┼─────────┤
│ 0       │ '105' │ 'MLH' │ '10' │ 'false' │
│ 1       │ '106' │ 'GHW' │ '10' │ 'false' │
└─────────┴───────┴───────┴──────┴─────────┘
[16 Dec 2024, 16:08:20.661] [TEST] Search with index test passed

[16 Dec 2024, 16:08:20.667] [SUCCESS] Database backup completed. The backup is available at ./backup.
[16 Dec 2024, 16:08:20.667] [TEST] Database backup test passed

[16 Dec 2024, 16:08:20.670] [SUCCESS] Database successfully restored from the backup at ./backup.
[16 Dec 2024, 16:08:20.671] [TEST] Database restore test passed

[16 Dec 2024, 16:08:20.671] [INFO] [Lock] Mutex created for table "users"
[16 Dec 2024, 16:08:20.672] [DEBUG] [Mutex] Lock acquired.
[16 Dec 2024, 16:08:20.672] [DEBUG] [Mutex] Lock busy, request queued.
[16 Dec 2024, 16:08:20.673] [INFO] [Lock] Lock acquired for the table "users"
[16 Dec 2024, 16:08:20.673] [INFO] [Lock] Performing operation on table "users"
[16 Dec 2024, 16:08:20.673] [TEST] Task 1 started.
[16 Dec 2024, 16:08:20.674] [SUCCESS] New row inserted into users successfully
[16 Dec 2024, 16:08:20.675] [TEST] Task 1 completed.
[16 Dec 2024, 16:08:20.676] [DEBUG] [MUTEX] Passing the lock to the next function in the queue.
[16 Dec 2024, 16:08:20.676] [DEBUG] [Mutex] Lock acquired.
[16 Dec 2024, 16:08:20.677] [INFO] [Lock] Lock released for table "users"
[16 Dec 2024, 16:08:20.677] [INFO] [Lock] Lock acquired for the table "users"
[16 Dec 2024, 16:08:20.678] [INFO] [Lock] Performing operation on table "users"
[16 Dec 2024, 16:08:20.678] [TEST] Task 2 started.
[16 Dec 2024, 16:08:20.679] [SUCCESS] New row inserted into users successfully
[16 Dec 2024, 16:08:20.690] [TEST] Task 2 completed.
[16 Dec 2024, 16:08:20.691] [DEBUG] [Mutex] Lock released.
[16 Dec 2024, 16:08:20.691] [INFO] [Lock] Lock released for table "users"
[16 Dec 2024, 16:08:20.692] [TEST] Locks test passed.
┌─────────┬─────────────┐
│ (index) │ total_users │
├─────────┼─────────────┤
│ 0       │ 8           │
└─────────┴─────────────┘
[16 Dec 2024, 16:08:20.694] [SUCCESS] Select query executed successfully.
[16 Dec 2024, 16:08:20.695] [TEST] Aggregation test for "total_users" passed

┌─────────┬───────────┐
│ (index) │ age_count │
├─────────┼───────────┤
│ 0       │ 8         │
└─────────┴───────────┘
[16 Dec 2024, 16:08:20.697] [SUCCESS] Select query executed successfully.
[16 Dec 2024, 16:08:20.697] [TEST] Aggregation test for "age_count" passed

┌─────────┬─────────────┐
│ (index) │ average_age │
├─────────┼─────────────┤
│ 0       │ 22.375      │
└─────────┴─────────────┘
[16 Dec 2024, 16:08:20.699] [SUCCESS] Select query executed successfully.
[16 Dec 2024, 16:08:20.699] [TEST] Aggregation test for "average_age" passed

┌─────────┬──────────────────────────┐
│ (index) │ average_age_more_than_10 │
├─────────┼──────────────────────────┤
│ 0       │ 26.5                     │
└─────────┴──────────────────────────┘
[16 Dec 2024, 16:08:20.701] [SUCCESS] Select query executed successfully.
[16 Dec 2024, 16:08:20.702] [TEST] Aggregation test for "average_age_more_than_10" passed

[16 Dec 2024, 16:08:20.703] [TEST] Aggregation tests passed
```

### Example Usage

```javascript
import { createTable, insertInto } from "mini-sql-db";

createTable("CREATE TABLE products (id int, name txt, quantity int)");
insertInto("INSERT INTO products (id, name, quantity) VALUES (101, 'Apple', 10)");
```

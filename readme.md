# mini-sql-db

A file-based SQL database written in JavaScript. Uses SQLite-like syntax for querying and managing data.

## Folder Structure

```plaintext
mini-sql-db/
|--- lib/
| |--- storage.js # Create JSON files to store data and run read/write operations
| |--- schema.js # Table schema management and validation
| |--- query.js # Query parsing and execution
|--- logger/
| |--- logger.js # Logging utilities
|--- test/
| |--- test_db.js # unit tests 
|--- index.js
|--- package.json
|--- README.md
|--- sql_syntax.txt
```

## Setup

- Clone the project
- Run `npm install` inside the project directory
- Create `.env` file at the root
- Copy `.env.example` over to `.env`

## Test

- Run `node test/test_db.js` # This is the test file for all the lib functions.

### Test Sample Output
[14 Dec 2024, 14:32:00.498] [INFO] Database directory created.: ./database/
[14 Dec 2024, 14:32:00.517] [SUCCESS] Table "users" created successfully
[14 Dec 2024, 14:32:00.518] [TEST] Table creation test passed.

[14 Dec 2024, 14:32:00.519] [SUCCESS] New row inserted into users successfully
[14 Dec 2024, 14:32:00.520] [SUCCESS] New row inserted into users successfully
[14 Dec 2024, 14:32:00.521] [SUCCESS] New row inserted into users successfully
[14 Dec 2024, 14:32:00.522] [SUCCESS] New row inserted into users successfully
[14 Dec 2024, 14:32:00.522] [SUCCESS] New row inserted into users successfully
[14 Dec 2024, 14:32:00.523] [TEST] Insert Into test passed.

┌─────────┬───────┬─────────┐
│ (index) │ id    │ name    │
├─────────┼───────┼─────────┤
│ 0       │ '101' │ 'Alice' │
│ 1       │ '102' │ 'BOB'   │
│ 2       │ '103' │ 'John'  │
│ 3       │ '104' │ 'Tom'   │
│ 4       │ '105' │ 'MLH'   │
└─────────┴───────┴─────────┘
[14 Dec 2024, 14:32:00.526] [SUCCESS] Select query executed successfully.
┌─────────┬───────┬─────────┬──────┬─────────┐
│ (index) │ id    │ name    │ age  │ student │
├─────────┼───────┼─────────┼──────┼─────────┤
│ 0       │ '101' │ 'Alice' │ '22' │ 'true'  │
│ 1       │ '102' │ 'BOB'   │ '25' │ 'true'  │
│ 2       │ '103' │ 'John'  │ '22' │ 'false' │
│ 3       │ '104' │ 'Tom'   │ '28' │ 'true'  │
│ 4       │ '105' │ 'MLH'   │ '10' │ 'false' │
└─────────┴───────┴─────────┴──────┴─────────┘
[14 Dec 2024, 14:32:00.528] [SUCCESS] Select query executed successfully.
[14 Dec 2024, 14:32:00.529] [TEST] Select query test passed.

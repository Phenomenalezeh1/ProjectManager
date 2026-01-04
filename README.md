# Team Partner Matcher

A Node.js web application that randomly assigns team partners from a PostgreSQL database.

## Setup

1. Install PostgreSQL and create a database named `team_matcher`.

2. Update the database credentials in `server.js`:

   ```javascript
   const pool = new Pool({
     user: "your_username",
     host: "localhost",
     database: "team_matcher",
     password: "your_password",
     port: 5432,
   });
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Run the server:

   ```
   npm start
   ```

5. Open http://localhost:3000 in your browser.

## How it works

- Users enter their name.
- If they are new, they are added to the database.
- The system randomly pairs them with an unpaired student.
- Once paired, both students will see each other as partners.
- No student can have more than one partner.

## Database Schema

- `students` table: id, name (unique), partner_id (references id)

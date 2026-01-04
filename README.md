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

## Deployment

This app can be deployed to Railway for free.

1. Go to [Railway.app](https://railway.app) and sign up/login.

2. Create a new project and connect your GitHub repository: https://github.com/Phenomenalezeh1/ProjectManager

3. Add a PostgreSQL database to your project.

4. In your Railway project settings, set the environment variable `DATABASE_URL` to the database connection string provided by Railway.

5. Deploy the app. Railway will automatically build and deploy from your GitHub repo.

6. Once deployed, Railway will provide a public URL for your app.

## How it works

- Users enter their name.
- If they are new, they are added to the database.
- The system randomly pairs them with an unpaired student.
- Once paired, both students will see each other as partners.
- No student can have more than one partner.

## Database Schema

- `students` table: id, name (unique), partner_id (references id)

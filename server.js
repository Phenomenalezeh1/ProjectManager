const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Daredevil3@localhost:5432/team_matcher',
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

// Initialize database
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        partner_id INTEGER REFERENCES students(id)
      );
    `);
    // Insert sample students if not exists
    const students = ['Anyaorah', 'Augustus', 'Awa', 'Charles', 'Chuckwukere', 'Chukuma', 'Dozieobi','Egemba','Enyinnaya','Etim','Emenike','Awuchi'];
    for (const name of students) {
      await pool.query('INSERT INTO students (name) ON CONFLICT (name) DO NOTHING VALUES ($1)', [name]);
    }
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initDB();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/enter', async (req, res) => {
  const { name } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Check if student exists
    let student = await client.query('SELECT * FROM students WHERE name = $1', [name]);
    if (student.rows.length === 0) {
      // Add new student
      student = await client.query('INSERT INTO students (name) VALUES ($1) RETURNING *', [name]);
    } else {
      student = student.rows[0];
    }

    if (student.partner_id) {
      // Already has partner
      const partner = await client.query('SELECT name FROM students WHERE id = $1', [student.partner_id]);
      await client.query('COMMIT');
      res.json({ partner: partner.rows[0].name });
    } else {
      // Find a random unpaired student
      const unpaired = await client.query(`
        SELECT * FROM students 
        WHERE partner_id IS NULL AND id != $1 
        ORDER BY RANDOM() 
        LIMIT 1
      `, [student.id]);

      if (unpaired.rows.length === 0) {
        await client.query('COMMIT');
        res.json({ partner: 'No available partners' });
      } else {
        const partner = unpaired.rows[0];
        // Pair them
        await client.query('UPDATE students SET partner_id = $1 WHERE id = $2', [partner.id, student.id]);
        await client.query('UPDATE students SET partner_id = $1 WHERE id = $2', [student.id, partner.id]);
        await client.query('COMMIT');
        res.json({ partner: partner.name });
      }
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
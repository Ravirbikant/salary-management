require('dotenv').config()
const db = require('./src/db/database')
const app = require('./src/app')

db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    country TEXT NOT NULL,
    salary REAL NOT NULL,
    department TEXT,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

const count = db.prepare('SELECT COUNT(*) as count FROM employees').get()
if (count.count === 0) {
    console.log('Empty database, seeding...')
    require('./src/seed.js')
}

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
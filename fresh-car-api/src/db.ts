import "reflect-metadata"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import * as fs from "fs"
import * as path from "path"
import bcrypt from "bcrypt"

const dbPath = "./freshcar.db" // adjust this to your desired database file path
const dbDir = path.dirname(dbPath)

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir)
}

if (!fs.existsSync(dbPath)) {
  fs.closeSync(fs.openSync(dbPath, "w"))
}

const dbConnection = async () => {
  await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })
}

const insertInitialUsers = async () => {
  const adminUsername = "admin"
  const adminPassword = "123456"
  const adminRole = "admin"

  const userUsername = "user"
  const userPassword = "123456"
  const userRole = "user"

  // Check if admin exists
  const adminQuery = `SELECT * FROM users WHERE username = ?`
  db.get(adminQuery, adminUsername, async (err, row) => {
    if (err) {
      console.error(err.message)
    } else if (!row) {
      // Insert admin
      const adminHash = await bcrypt.hash(adminPassword, 10)
      const insertAdminQuery = `INSERT INTO users (username, password, role) VALUES (?,?,?)`
      db.run(insertAdminQuery, adminUsername, adminHash, adminRole)
    }
  })

  // Check if user exists
  const userQuery = `SELECT * FROM users WHERE username = ?`
  db.get(userQuery, userUsername, async (err, row) => {
    if (err) {
      console.error(err.message)
    } else if (!row) {
      // Insert user
      const userHash = await bcrypt.hash(userPassword, 10)
      const insertUserQuery = `INSERT INTO users (username, password, role) VALUES (?,?,?)`
      db.run(insertUserQuery, userUsername, userHash, userRole)
    }
  })
}

const db = new sqlite3.Database("freshcar.db", (err) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log("Connected to the database.")

    // Create tables if they don't exist
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL
        );
      `)

      db.run(`
        CREATE TABLE IF NOT EXISTS cars (
          id INTEGER PRIMARY KEY,
          make TEXT,
          model TEXT,
          type TEXT,
          year INTEGER,
          color TEXT,
          mileage INTEGER,
          price DOUBLE,
          image TEXT,
          plateNo TEXT
        );
      `)

      // Create table if it doesn't exist
      db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY,
          car_id INTEGER,
          user_id INTEGER,
          start_date DATE,
          end_date DATE,
          status TEXT,
          FOREIGN KEY (car_id) REFERENCES cars(id)
        );
      `)
    })

    insertInitialUsers()
  }
})

export default dbConnection

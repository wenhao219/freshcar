import express, { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sqlite3 from "sqlite3"

const router = express.Router()
const db = new sqlite3.Database("freshcar.db")

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body
  const query = `SELECT * FROM users WHERE username =?`

  db.get(query, username, async (err: any, row: any) => {
    console.log(err)
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }
    if (!row) {
      return res.status(404).json({ error: "bbbInvalid username or password" })
    }
    const isValid = await bcrypt.compare(password, row.password)
    if (!isValid) {
      return res.status(404).json({ error: "aaaInvalid username or password" })
    }
    const token = jwt.sign({ userId: row.id, role: row.role }, "freshcar", {
      expiresIn: "1h",
    })
    if (row) {
      ;(req.session.role = row.role), (req.session.user_sid = row.id)
    }
    res.json({ ID: row.id, username: row.username, role: row.role })
  })
})

router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body

  // Check if user with same username already exists
  const query = `SELECT * FROM users WHERE username =?`
  db.get(query, username, async (err: any, row: any) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }
    if (row) {
      return res.status(400).json({ error: "Username already taken" })
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10)

    // Insert new user
    const insertQuery = `INSERT INTO users (username, password, role) VALUES (?,?,?)`
    db.run(insertQuery, username, hash, "user")

    res.sendStatus(201)
  })
})

router.get("/me", async (req: Request, res: Response) => {
  const token = req.header("Authorization")
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  const decoded: any = jwt.verify(token, "freshcar")
  const query = `SELECT id, username, role FROM users WHERE id =?`
  db.get(query, decoded.userId, (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }
    res.json(row)
  })
})

router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" })
    }
    res.json({ message: "Logged out successfully" })
  })
})

export default router

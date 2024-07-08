import express, { Request, Response } from "express"
import sqlite3 from "sqlite3"
import { isLoggedIn } from "./validateAuth.middleware"
import { APIURL } from "../src"

const db = new sqlite3.Database("freshcar.db")

const router = express.Router()

router.get("/", isLoggedIn, async (req: Request, res: Response) => {
  const { minPrice, maxPrice, type } = req.query
  let query = `SELECT * FROM cars`
  const params: any[] = []

  if (minPrice && maxPrice) {
    query += ` WHERE price BETWEEN ? AND ?`
    params.push(minPrice)
    params.push(maxPrice)
  } else if (minPrice) {
    query += ` WHERE price >= ?`
    params.push(minPrice)
  } else if (maxPrice) {
    query += ` WHERE price <= ?`
    params.push(maxPrice)
  }

  if (type) {
    if (params.length > 0) {
      query += ` AND type = ?`
    } else {
      query += ` WHERE type = ?`
    }
    params.push(type)
  }
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }
    const data = rows.map((row: any) => ({
      id: row.id,
      make: row.make,
      model: row.model,
      year: row.year,
      color: row.color,
      price: row.price,
      type: row.type,
      plateNo: row.plateNo,
      mileage: row.mileage,
      image: `${APIURL}${row.image.replace("\\", "/")}`, // Serve the image from the uploads folder
    }))
    res.json(data)
  })
})

// Get a car's details by ID
router.get("/:id", isLoggedIn, (req: Request, res: Response) => {
  const id = parseInt(req.params.id)

  // Retrieve the car from the database
  const query = `SELECT * FROM cars WHERE id = ?`
  db.get(query, id, (err, row: any) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    } else if (!row) {
      return res.status(404).send("Car not found")
    }

    const data = {
      id: row.id,
      make: row.make,
      model: row.model,
      year: row.year,
      type: row.type,
      color: row.color,
      mileage: row.mileage,
      plateNo: row.plateNo,
      price: row.price,
      image: `${APIURL}${row.image.replace("\\", "/")}`, // Serve the image from the uploads folder
    }
    res.json(data)
  })
})

export default router

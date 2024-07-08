import express, { Request, Response } from "express"
import sqlite3 from "sqlite3"
import bcrypt from "bcrypt"
import fs from "fs"
import { isLoggedIn } from "./validateAuth.middleware"
import { APIURL } from "../src"

const db = new sqlite3.Database("freshcar.db")

interface CarInventory {
  make: string
  model: string
  year: number
  color: string
  price: string
  mileage: number
  image: any
  type: string
  plateNo: string
}
const router = express.Router()
const carInventory: CarInventory[] = []

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

router.get("/users", isLoggedIn, (req: Request, res: Response) => {
  const query = `SELECT * FROM users where role = "user"`
  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }
    const data =
      rows.length > 0
        ? rows.map((e: any) => {
            return {
              ID: e.id,
              username: e.username,
              role: e.role,
            }
          })
        : []
    res.json(data)
  })
})

// Add a new car to the inventory
router.post("/inventory", isLoggedIn, (req: Request, res: Response) => {
  if (req.session && req.session.role === "admin") {
    const { make, model, year, color, mileage, price, type, plateNo } = req.body
    const newCar: CarInventory = {
      make,
      model,
      year,
      color,
      mileage,
      price,
      type,
      plateNo,
      image: req.file ? req.file.path : "", // Store the uploaded image filename
    }
    carInventory.push(newCar)
    const insertCarQuery = `INSERT INTO cars (make, model, year, color, mileage, image, price, type, plateNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    db.run(
      insertCarQuery,
      newCar.make,
      newCar.model,
      newCar.year,
      newCar.color,
      newCar.mileage,
      newCar.image,
      newCar.price,
      newCar.type,
      newCar.plateNo,
      (err: any) => {
        if (err) {
          console.error(err.message)
        } else {
          res
            .status(201)
            .send(`Car added to inventory: ${newCar.make} ${newCar.model}`)
        }
      }
    )
  } else {
    res.status(403).send("Only admins can add new cars")
  }
})

// Get all cars in the inventory
router.get("/inventory", isLoggedIn, (req: Request, res: Response) => {
  const query = `SELECT * FROM cars`
  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }
    const data = rows.map((row: any) => ({
      id: row.id,
      make: row.make,
      model: row.model,
      year: row.year,
      color: row.color,
      plateNo: row.plateNo,
      mileage: row.mileage,
      image: `${APIURL}${row.image.replace("\\", "/")}`, // Serve the image from the uploads folder
    }))
    res.json(data)
  })
})

// Get a car's details by ID
router.get("/inventory/:id", isLoggedIn, (req: Request, res: Response) => {
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
      plateNo: row.plateNo,
      mileage: row.mileage,
      price: row.price,
      image: `${APIURL}${row.image.replace("\\", "/")}`, // Serve the image from the uploads folder
    }
    res.json(data)
  })
})

// Update a car in the inventory
router.put("/inventory/:id", isLoggedIn, (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const { make, model, year, color, mileage, price, type, plateNo } = req.body

  // Retrieve the car from the database
  const query = `SELECT * FROM cars WHERE id = ?`
  db.get(query, id, (err, row: any) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    } else if (!row) {
      return res.status(404).send("Car not found")
    }

    // Update the car details
    let updateQuery = `UPDATE cars SET make = ?, model = ?, year = ?, color = ?, mileage = ?, price = ?, type = ?, plateNo = ?`
    let params = [make, model, year, color, mileage, price, type, plateNo]

    if (req.file) {
      // Delete the previous image if it exists
      const previousImagePath = row.image
      if (previousImagePath) {
        const filePath = previousImagePath
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err)
          }
        })
      }
      updateQuery += `, image = ?`
      params.push(req.file.path)
    }

    updateQuery += " WHERE id = ?"
    params.push(id)

    db.run(updateQuery, params, (err: any) => {
      if (err) {
        console.error(err.message)
      } else {
        res.send(`Car updated: ${make} ${model}`)
      }
    })
  })
})

// Remove a car from the inventory
router.delete("/inventory/:id", isLoggedIn, (req: Request, res: Response) => {
  const id = parseInt(req.params.id)

  // Retrieve the car from the database
  const query = `SELECT * FROM cars WHERE id = ?`
  db.get(query, id, (err, row: any) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    } else if (!row) {
      return res.status(404).send("Car not found")
    }

    // Delete the image if it exists
    const previousImagePath = row.image
    if (previousImagePath) {
      const filePath = previousImagePath
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err)
        }
      })
    }

    // Delete the car from the database
    const deleteQuery = `DELETE FROM cars WHERE id = ?`
    db.run(deleteQuery, id, (err) => {
      if (err) {
        console.error(err.message)
      } else {
        res.send(`Car removed: ${id}`)
      }
    })
  })
})

export default router

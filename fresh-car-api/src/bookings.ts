import express, { Request, Response } from "express"
import sqlite3 from "sqlite3"
import { promisify } from "util"
import { APIURL } from "../src"
import { isLoggedIn } from "./validateAuth.middleware"

const db = new sqlite3.Database("freshcar.db")
const run = promisify(db.run).bind(db)
const get = promisify(db.get).bind(db)

const router = express.Router()

// POST /bookings
router.post("/", isLoggedIn, isLoggedIn, async (req: Request, res: Response) => {
  try {
    const { carId, startDate, endDate } = req.body
    const userId = req.session.user_sid
    // Validate input data
    if (!carId || !userId || !startDate || !endDate) {
      res.status(400).json({ error: "Invalid request body" })
      return
    }

    const result = await run(
      `
      INSERT INTO bookings (car_id, user_id, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?)
    `,
      carId,
      userId,
      startDate,
      endDate,
      "BOOKING"
    )
    const lastRow = await get("SELECT last_insert_rowid() AS lastID")
    if (lastRow) {
      res.json({ id: lastRow.lastID })
    } else {
      res.status(500).json({ error: "Failed to create booking" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// GET /bookings
router.get("/", isLoggedIn, async (req: Request, res: Response) => {
  try {
    const userId = req.session.user_sid
    db.all(
      `SELECT * FROM bookings WHERE user_id =?`,
      userId,
      async (err, rows: any) => {
        if (err) {
          console.error(err)
          res.status(500).json({ error: "Internal Server Error" })
        } else {
          const bookings = []
          for (const booking of rows) {
            const carId = booking.car_id
            const carResult = await get(`SELECT * FROM cars WHERE id =?`, carId)
            let carRes = null
            if (carResult) {
              carRes = { ...carResult, image: `${APIURL}${carResult.image}` }
            } else {
              res.status(404).json({ error: "Car not found" })
              return
            }
            bookings.push({ booking: { ...booking }, car: carRes })
          }
          res.json(bookings)
        }
      }
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// GET /bookings/:id
router.get("/:id", isLoggedIn, async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await get(`SELECT * FROM bookings WHERE id = ?`, id)
    if (result) {
      const carId = result.car_id
      const carResult = await get(`SELECT * FROM cars WHERE id = ?`, carId)
      let carRes = null
      if (carResult) {
        carRes = { ...carResult, image: `${APIURL}${carResult.image}` }
      } else {
        res.status(404).json({ error: "Car not found" })
      }
      const userId = result.user_id
      const userResult = await get(`SELECT * FROM users WHERE id = ?`, userId)
      let username = null
      if (userResult) {
        username = userResult.username
      } else {
        res.status(404).json({ error: "User not found" })
      }
      res.json({ booking: { ...result, customerName: username }, car: carRes })
    } else {
      res.status(404).json({ error: "Booking not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// PUT /bookings/:id
router.put("/:id", isLoggedIn, async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const userId = req.session.user_sid
    const status = "CANCEL"

    // Validate input data
    if (!id || !userId) {
      res.status(400).json({ error: "Invalid request" })
      return
    }

    await run(
      `
      UPDATE bookings
      SET status = ?
      WHERE id = ? AND user_id = ?
    `,
      status,
      id,
      userId
    )
    res.sendStatus(204)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router

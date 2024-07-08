import express from "express"
import carsRouter from "./cars"
import bookingsRouter from "./bookings"
import adminRouter from "./admin"
import authRouter from "./auth"
import dbConnection from "./db"
import path from "path"
import multer from "multer"
import session from "express-session"
import cors from "cors"
import http from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

const port = 8090
const dbPath = "./database.db" // adjust this to your desired database file path
export const APIURL = "http://localhost:8090/"

declare module "express-session" {
  export interface SessionData {
    user_sid: { [key: string]: any }
    role: string
    last_request_time: { [key: string]: any }
  }
}

const app: express.Application = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const originalName = file.originalname
    const fileType = originalName.split(".").pop()
    const newFileName = `${Date.now()}.${fileType}`
    cb(null, newFileName)
  },
})
const upload = multer({ storage })
app.use(upload.single("image"))

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
)

const whiteList = ["http://localhost:3000", "http://localhost:8090"]
app.use(
  cors({
    credentials: true,
    origin: whiteList,
    methods: "GET,PUT,POST,DELETE",
  })
)
app.enable("trust proxy")

app.use("/cars", carsRouter)
app.use("/bookings", bookingsRouter)
app.use("/admin", adminRouter)
app.use("/auth", authRouter)

app.use("/uploads", express.static(path.join(__dirname + "/..", "uploads")))

http.createServer(app).listen(port, async () => {
  console.log(`Server listening on port ${port}`)
  await dbConnection()
  console.log(`Connected to SQLite database at ${dbPath}`)
})

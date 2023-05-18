import express, { Express } from "express"
import helmet from "helmet"
import morgan from "morgan"
import cors from 'cors'
import * as dotenv from 'dotenv'
import { usersRoute } from "./routes/users.route.js"
import { RefreshToken } from "./utils/RefreshToken.js"

dotenv.config()
RefreshToken.init()

const app: Express = express()
const port = 3000
const host = "127.0.0.1"

// default middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json({ limit: "50kb" }))
app.use(morgan("short"))
app.use(helmet())

// CORS
app.use(cors())

// Routes
app.use(usersRoute)

app.listen(port, () => {
    console.log(`Server listening at http://${host}:${port}`)
})

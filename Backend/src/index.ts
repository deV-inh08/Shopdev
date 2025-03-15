import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import authRouter from './routes/common/auth.common'
import databaseServices from './services/database.services'
config()
const app = express()

// middlewares
app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)

// connect database
databaseServices.connect().catch(console.dir)

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`)
})

import express from 'express'
import cors from 'cors'
import authRouter from './routes/common/auth.common'
import databaseServices from './services/database.services'
import { envConfig } from './constants/config'
const app = express()
const PORT = 3000

// connect database
databaseServices.connect()

// middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello express</h1>')
})

app.use('/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

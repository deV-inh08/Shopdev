import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import authCommonRouter from '~/routes/common/common-auth.route'
import databaseServices from './services/database.services'
config()
const app = express()

// middlewares
app.use(cors())
app.use(express.json())

app.use('/auth', authCommonRouter)

// connect database
databaseServices.connect().catch(console.dir)
// disconnect MongoDB
process.on('SIGINT', async () => {
  await databaseServices.disconnect()
  process.exit(0)
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`)
})

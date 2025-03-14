import { config } from 'dotenv'
config()

export const envConfig = {
  port: (process.env.PORT as string) || 3000,
  dbUserName: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME
} as const

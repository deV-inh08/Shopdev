import { Db, MongoClient } from 'mongodb'
import { envConfig } from '~/constants/config'

const uri = `mongodb+srv://${envConfig.dbUserName}:${envConfig.dbPassword}@shopdev.8i1jp.mongodb.net/?retryWrites=true&w=majority&appName=Shopdev`

class DatabaseServices {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('error:', error)
      throw error
    }
  }
}

const databaseServices = new DatabaseServices()
export default databaseServices

import { Collection, Db, MongoClient } from 'mongodb'
import { envConfig } from '~/constants/config'
import { RefreshTokenType } from '~/models/schemas/RefreshToken.schema'
import { UserType } from '~/models/schemas/User.schemas'

const uri = `mongodb+srv://${envConfig.dbUserName}:${envConfig.dbPassword}@shopdev.8i1jp.mongodb.net/?retryWrites=true&w=majority&appName=Shopdev`

class DatabaseServices {
  private client: MongoClient
  private db: Db
  constructor(uri: string) {
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
  async disconnect() {
    try {
      await this.client.close()
      console.log('Disconnect MongoDB')
    } catch (error) {
      console.log('error', error)
    }
  }

  // create collection 'User'
  get users(): Collection<UserType> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  // create collection refresh_token
  get refreshTokens(): Collection<RefreshTokenType> {
    return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION as string)
  }

  // create collection products
}

const databaseServices = new DatabaseServices(uri)
export default databaseServices

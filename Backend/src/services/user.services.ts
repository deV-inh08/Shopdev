import { ObjectId } from 'mongodb'
import type { StringValue } from 'ms'
import { TokenType, UserVefifyStatus } from '~/constants/enums'
import { RegisterBody } from '~/models/request/user.request'
import { signToken } from '~/utils/jwt'
import databaseServices from './database.services'
import { User } from '~/models/schemas/User.schemas'
import { hassPassword } from '~/utils/crypto'

class UserServices {
  // sign with: user_id, veerify status ||verify email
  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVefifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      option: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  async register(payload: RegisterBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVefifyStatus.Unverified
    })
    console.log(email_verify_token)
    // insert user in DB
    databaseServices.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        password: hassPassword(payload.password)
      })
    )
  }
}

const userServices = new UserServices()
export default userServices

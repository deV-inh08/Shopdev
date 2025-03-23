import { ObjectId } from 'mongodb'
import type { StringValue } from 'ms'
import { TokenType, UserVefifyStatus } from '~/constants/enums'
import { RegisterReqBody } from '~/models/request/user.request'
import { signToken } from '~/utils/jwt'
import databaseServices from './database.services'
import { User } from '~/models/schemas/User.schemas'
import { hassPassword } from '~/utils/crypto'
import { RefreshToken } from '~/models/schemas/RefreshToken.schema'

class UserServices {
  // sign access_token: user_id | verify (Unverify)
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVefifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      option: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }
  // sign refresh_token: user_id | verify (Unverify)
  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVefifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      option: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }
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

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVefifyStatus.Unverified
    })
    // insert user in DB
    await databaseServices.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        password: hassPassword(payload.password)
      })
    )
    // generate access_token & refresh token
    const access_token = await this.signAccessToken({
      user_id: user_id.toString(),
      verify: UserVefifyStatus.Unverified
    })
    const refresh_token = await this.signRefreshToken({
      user_id: user_id.toString(),
      verify: UserVefifyStatus.Unverified
    })
    // insert refresh token in DB
    await databaseServices.refreshTokens.insertOne(new RefreshToken({ user_id, token: refresh_token }))
    // return to controller
    return {
      access_token,
      refresh_token
    }
  }

  async login({ _id, verify }: { _id: string; verify: UserVefifyStatus }) {
    // generate new access_token and refresh_token
    const access_token = await this.signAccessToken({
      user_id: _id.toString(),
      verify: verify
    })
    const refresh_token = await this.signRefreshToken({
      user_id: _id.toString(),
      verify: verify
    })
    // insert refresh token in DB
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(_id),
        token: refresh_token
      })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExits(email: string): Promise<boolean> {
    const user = await databaseServices.users.findOne({
      email
    })
    return Boolean(user)
  }

  // delete refresh_token in DB
  async logOut(refresh_token: string) {
    const result = await databaseServices.refreshTokens.deleteOne({ token: refresh_token })
    return result
  }
}

const userServices = new UserServices()
export default userServices

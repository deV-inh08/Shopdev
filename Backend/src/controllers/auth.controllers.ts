import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UserVefifyStatus } from '~/constants/enums'
import { USERS_MESSAGE } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/status'
import { RegisterReqBody, LoginReqBody, LogoutReqBody, RefreshAccessToken, TokenPayload } from '~/models/request/user.request'
import databaseServices from '~/services/database.services'
import userServices from '~/services/user.services'
import { hassPassword } from '~/utils/crypto'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await userServices.register(req.body)
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGE.REGISTER_SUCCESS,
      data: result
    })
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    })
  }
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  try {
    // find email in DB, if it have => success ortherwise failed
    // compare password user post to server, compare it in DB
    const { email, password } = req.body
    const user = await databaseServices.users.findOne({ email: email, password: hassPassword(password) })
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: USERS_MESSAGE.EMAIL_DOSE_NOT_EXIST
      })
    } else {
      const { _id } = user
      const result = await userServices.login({ _id: _id.toString(), verify: UserVefifyStatus.Verified })
      res.status(HTTP_STATUS.OK).json({
        message: USERS_MESSAGE.LOGIN_SUCCESS,
        data: result
      })
    }
  } catch (error: unknown) {
    console.log(error)
  }
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await userServices.logOut(refresh_token)
  return res.json({
    message: USERS_MESSAGE.REFRESH_TOKEN_DELETE_SUCCESS,
    data: result
  })
}

export const refreshTokenController = async (req: Request<ParamsDictionary, any, RefreshAccessToken>, res: Response) => {
  const { refresh_token } = req.body
  const { user_id, verify } = req.decoded_refresh_token as TokenPayload
  const result = await userServices.refreshAccessToken({ refresh_token, user_id, verify })
  return res.json({
    message: USERS_MESSAGE.REFRESH_ACCESS_TOKEN_SUCCESS,
    data: result
  })
}

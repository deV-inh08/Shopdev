import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { UserVefifyStatus } from '~/constants/enums'
import { USERS_MESSAGE } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/status'
import { errorResponse, ErrorWithStatus } from '~/models/Errors'
import { RegisterBody, LoginBody } from '~/models/request/user.request'
import databaseServices from '~/services/database.services'
import userServices from '~/services/user.services'
import { hassPassword } from '~/utils/crypto'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerController = async (req: Request<ParamsDictionary, any, RegisterBody>, res: Response) => {
  try {
    const result = await userServices.register(req.body)
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGE.REGISTER_SUCCESS,
      data: result
    })
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error instanceof Error ? error.message : 'Đăng ký thất bại'
    })
  }
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginBody>, res: Response) => {
  try {
    // find email in DB, if it have => success ortherwise failed
    // compare password user post to server, compare it in DB
    const { email, password } = req.body
    const user = await databaseServices.users.findOne({ email: email, password: hassPassword(password) })
    if (!user) {
      throw new ErrorWithStatus({ error: 'Email hoặc password không đúng', status: HTTP_STATUS.UNAUTHORIZED })
    } else {
      const { _id } = user
      const result = await userServices.login({ _id: _id.toString(), verify: UserVefifyStatus.Verified })
      res.status(200).json({
        message: USERS_MESSAGE.LOGIN_SUCCESS,
        data: result
      })
    }
  } catch (error: unknown) {
    if (error instanceof ErrorWithStatus) {
      errorResponse(res, error)
    }
  }
}

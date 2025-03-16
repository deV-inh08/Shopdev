import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGE } from '~/constants/messages'
import { RegisterBody } from '~/models/request/user.request'
import userServices from '~/services/user.services'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterBody>, res: Response) => {
  try {
    const result = await userServices.register(req.body)
    res.json({
      message: USERS_MESSAGE.REGISTER_SUCCESS,
      data: result
    })
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Đăng ký thất bại'
    })
  }
}

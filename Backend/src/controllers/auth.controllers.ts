import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterBody } from '~/models/request/user.request'
const registerController = async (req: Request<ParamsDictionary, any, RegisterBody>, res: Response, next: NextFunction) => {
 
}
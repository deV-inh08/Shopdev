import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/auth.controllers'
import {
  accessTokenValidator,
  loginValidator,
  registerValidator,
  refreshTokenValidator
} from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const authCommonRouter = Router()

/* 
Register a new user
Path: /register
Method: POST
Body: 
{
  name: string,
  email: string,
  password: string,
  confirm_password: string
}
*/
authCommonRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Login account
 * Path: /login
 * Method: POST
 * Body:
 * {
 *  email: string
 *  password: string
 * }
 */
authCommonRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Logout Account
 * Path: /logout
 * Method: POST
 * headers: Authorization: <Bearer access_token>
 * Body: {
 * access_token: string
 * }
 */
authCommonRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
export default authCommonRouter

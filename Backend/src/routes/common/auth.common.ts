import { Router } from 'express'
import { loginController, registerController } from '~/controllers/auth.controllers'
import { loginValidator, registerValidator } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const authRouter = Router()

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
authRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

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
authRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Logout Account
 * Path: /logout
 * Method: POST
 * Body: {
 * access_token: string
 * }
 */
authRouter.post('/logout')
export default authRouter

import { Router } from 'express'
import { loginController, registerController } from '~/controllers/auth.controllers'
import { loginValidator, registerValidator } from '~/middlewares/auth.middlewares'

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
authRouter.post('/register', registerValidator, registerController)

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
authRouter.post('/login', loginValidator, loginController)
// authRouter.get('/login', (req, res) => {
//   res.send('<h1>Hello1</h1>')
// })

export default authRouter

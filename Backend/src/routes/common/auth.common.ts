import { Router } from 'express'
import { registerController } from '~/controllers/auth.controllers'
import { registerValidator } from '~/middlewares/auth.middlewares'

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

export default authRouter

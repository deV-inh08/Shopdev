import { Router } from 'express'
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
authRouter.post('/register', registerValidator)

export default authRouter

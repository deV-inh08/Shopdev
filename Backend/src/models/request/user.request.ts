import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVefifyStatus } from '~/constants/enums'

export interface RegisterReqBody {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
}

export type LoginReqBody = Pick<RegisterReqBody, 'email' | 'password'>

export type LogoutReqBody = {
  refresh_token: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token__type: TokenType
  verify: UserVefifyStatus
}

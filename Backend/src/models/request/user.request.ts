import { JwtPayload } from "jsonwebtoken"
import { TokenType, UserVefifyStatus } from "~/constants/enums"

export interface RegisterBody {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
}

export type LoginBody = Pick<RegisterBody, 'email' | 'password'>

export interface TokenPayload extends JwtPayload {
  user_id: string
  token__type: TokenType
  verify: UserVefifyStatus
}

export interface LogOutRequestBody {
  refresh_token: string
}

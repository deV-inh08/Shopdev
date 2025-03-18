export interface RegisterBody {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
}

export type LoginBody = Pick<RegisterBody, 'email' | 'password'>

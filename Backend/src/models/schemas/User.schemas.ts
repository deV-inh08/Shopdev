import { ObjectId } from 'mongodb'
import { UserVefifyStatus } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  password: string
  country?: string
  city?: string
  state?: string
  zip_code?: string
  address?: string
  avatar?: string
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVefifyStatus
}

class User {
  _id?: ObjectId
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password: string
  country: string
  city: string
  state: string
  zip_code: string
  address: string
  avatar: string
  email_verify_token: string
  forgot_password_token: string
  verify: UserVefifyStatus
  constructor(user: UserType) {
    this._id = user._id || new ObjectId()
    this.first_name = user.first_name || ''
    this.last_name = user.last_name || ''
    this.email = user.email || ''
    this.password = user.password || ''
    this.country = user.country || ''
    this.city = user.city || ''
    this.state = user.state || ''
    this.zip_code = user.zip_code || ''
    this.address = user.address || ''
    this.avatar = user.avatar || ''
    this.phone_number = user.phone_number || ''
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVefifyStatus.Unverified
  }
}

export { UserType, User }

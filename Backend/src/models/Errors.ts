import { USERS_MESSAGE } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/status'

type ErrorType = Record<
  string, {
    msg: string
    [key: string]: any
  }
>

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string, status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityErrors extends ErrorWithStatus {
  errors: ErrorType
  constructor({ message = USERS_MESSAGE.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY }) // inheritance
    this.errors = errors
  }
}

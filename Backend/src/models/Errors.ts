import { USERS_MESSAGE } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/status'
import { FieldValidationError } from 'express-validator/lib'
import { Response } from 'express'

type ErrorType = Record<
  string, {
    msg: string
    [key: string]: string | number | FieldValidationError[] | any
  }
>

export class ErrorWithStatus extends Error {
  status: number
  error: string | ErrorThrow
  constructor({ error, status }: { error: string | ErrorThrow; status: number }) {
    super()
    this.status = status
    this.error = error
  }
}

export class EntityErrors extends ErrorWithStatus {
  errors: ErrorType
  constructor({ error = USERS_MESSAGE.VALIDATION_ERROR, errors }: { error?: string; errors: ErrorType }) {
    super({ status: HTTP_STATUS.UNPROCESSABLE_ENTITY, error }) // inheritance
    this.errors = errors
  }
}

export const errorResponse = (res: Response, error: ErrorWithStatus) => {
  if (error instanceof ErrorWithStatus) {
    const status = error.status as number
    // case just string
    if (typeof error.error === 'string') {
      const message = error.error
      return res.status(status).send({ message })
    }
    // case Error is Object
    const errorObject = error.error
    return res.status(status).send({
      message: 'Error',
      data: errorObject
    })
  }
}

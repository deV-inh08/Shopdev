import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { USERS_MESSAGE } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/status'
import { EntityErrors, ErrorWithStatus } from '~/models/Errors'

const checkSchemaRegister = checkSchema({
  first_name: {
    isString: {
      errorMessage: USERS_MESSAGE.FIRST_NAME_MUST_BE_A_STRING
    },
    isLength: {
      options: {
        min: 2,
        max: 10
      },
      errorMessage: USERS_MESSAGE.FIRST_NAME_MUST_BE_FROM_2_TO_10
    }
  },
  last_name: {
    isString: {
      errorMessage: USERS_MESSAGE.LAST_NAME_MUST_BE_A_STRING
    },
    isLength: {
      options: {
        min: 2,
        max: 10
      },
      errorMessage: USERS_MESSAGE.LAST_NAME_MUST_BE_FROM_2_TO_10
    }
  },
  email: {
    isEmail: {
      errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
    },
    trim: true
  },
  password: {
    notEmpty: {
      errorMessage: USERS_MESSAGE.PASSWORD_IS_REQUIRED
    },
    isString: {
      errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_A_STRING
    },
    isLength: {
      options: {
        min: 6,
        max: 50
      },
      errorMessage: USERS_MESSAGE.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      },
      errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_STRONG
    }
  },
  confirm_password: {
    notEmpty: {
      errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED
    },
    isString: {
      errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_A_STRING
    },
    isLength: {
      options: {
        min: 6,
        max: 50
      },
      errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      },
      errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRONG
    },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error(USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
        }
        return true
      }
    }
  }
})

export const registerValidator = async (req: Request, res: Response, next: NextFunction) => {
  await checkSchemaRegister.run(req)
  const errors = validationResult(req)
  // Lỗi trống => không có lỗi
  if (errors.isEmpty()) {
    next()
  }
  // if errors
  const errorsObject = errors.mapped()
  const entityErrors = new EntityErrors({ errors: {} })
  for (const key in errorsObject) {
    const { msg } = errorsObject[key]
    if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
      return next(msg)
    }
    entityErrors.errors[key] = errorsObject[key]
  }
  next(entityErrors)
}

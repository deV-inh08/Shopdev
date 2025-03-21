import { Request } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { ParamSchema } from 'express-validator/lib/middlewares/schema'
import { USERS_MESSAGE } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/status'
import { ErrorWithStatus } from '~/models/Errors'
import userServices from '~/services/user.services'
import { verifyToken } from '~/utils/jwt'
import validate from '~/utils/validate'

// declare schema
const emailSchema: ParamSchema = {
  isEmail: {
    errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
  },
  notEmpty: {
    errorMessage: USERS_MESSAGE.EMAIL_IS_REQUIRED
  },
  trim: true,
  custom: {
    options: async (email: string) => {
      const isExitsEmail = await userServices.checkEmailExits(email)
      // if email is exist
      if (isExitsEmail) {
        throw new Error(USERS_MESSAGE.EMAIL_ALREADY_EXIST)
      } else {
        return true
      }
    }
  }
}

const passwordSchema: ParamSchema = {
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
}

const confirmPasswordSchema: ParamSchema = {
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

// check schema register
const registerValidator = validate(
  checkSchema(
    {
      // first name
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
      // last name
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
      // email
      email: emailSchema,
      // password
      password: passwordSchema,
      // confirm password
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)

// schema Login && Validate Login
const loginValidator = validate(
  checkSchema(
    {
      email: emailSchema,
      password: passwordSchema
    },
    ['body']
  )
)

// validate access_token
export const accessTokenValidator = validate(
  checkSchema({
    Authorization: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
      },
      custom: {
        options: async (value: string, { req }) => {
          const access_token = value.split(' ')[1]
          if (!access_token) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          // verify access_token
          const decoded_authorization = await verifyToken({
            token: access_token,
            secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
          })
            // assign to request
            ; (req as Request).decoded_authorization = decoded_authorization
          return true
        }
      }
    }
  })
)

export { registerValidator, loginValidator }

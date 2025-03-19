import { checkSchema, validationResult } from 'express-validator'
import { USERS_MESSAGE } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/status'
import userServices from '~/services/user.services'
import validate from '~/utils/validate'

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
      email: {
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
              console.log('Validator - Throwing error for existing email')
              throw new Error(USERS_MESSAGE.EMAIL_ALREADY_EXIST)
            } else {
              return true
            }
          }
        }
      },
      // password
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
      // confirm password
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
    },
    ['body']
  )
)

// schema Login && Validate Login
const loginValidator = validate(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
      },
      trim: true
    },
    password: {
      isString: {
        errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_A_STRING
      },
      notEmpty: {
        errorMessage: USERS_MESSAGE.PASSWORD_IS_REQUIRED
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
          minSymbols: 1,
          minNumbers: 1
        },
        errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_STRONG
      }
    }
  })
)

export { registerValidator, loginValidator }

import { Request } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { ParamSchema } from 'express-validator/lib/middlewares/schema'
import { JsonWebTokenError } from 'jsonwebtoken'
import { USERS_MESSAGE } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/status'
import { ErrorWithStatus } from '~/models/Errors'
import databaseServices from '~/services/database.services'
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
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGE.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseServices.users.findOne({ email: value })
            if (!user) {
              throw new Error(USERS_MESSAGE.EMAIL_OR_PASSWORD_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      },
      password: passwordSchema
    },
    ['body']
  )
)

/** Why validate access_token
 * - access_token có thể không lưu trong DB vì nó chỉ có thời gian sống ngắn (thường từ 15 phút đến 1 giờ).
 * - Khi logout, nếu chỉ xóa refresh_token mà không kiểm tra access_token,
 *   hacker có thể tiếp tục sử dụng access_token trong thời gian nó chưa hết hạn.
 * - Việc verify access_token giúp xác thực người dùng hợp lệ trước khi cho phép logout.
 */

// validate access_token
const accessTokenValidator = validate(
  checkSchema({
    /** Authorization trong HTTP headers chứa thông tin xác thực người dùng.
     *  Thông thường, nó có dạng: Bearer <access_token>
     */
    Authorization: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
      },
      custom: {
        options: async (value: string, { req }) => {
          const access_token = value.split(' ')[1]
          if (!access_token) {
            // throw Error
            throw new ErrorWithStatus({
              message: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          // verify access_token
          /**
           * decoded_authorization là thông tin giải mã từ access_token, chứa các dữ liệu quan trọng như:
           * {
              "id": "12345",
              "email": "user@example.com",
              "role": "user",
              "iat": 1711332563,
              "exp": 1711336163
            }
           */
          const decoded_authorization = await verifyToken({
            token: access_token,
            secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
          })
            /** assign decoded to request
            * Tại sao phải gán vào request (req.decoded_authorization)?
            * Trong nhiều API (ví dụ: /user/profile, /cart), backend cần biết người dùng là ai.
            * Nếu middleware (như accessTokenValidator) đã decode và gán req.decoded_authorization,
            * các route handler phía sau có thể dùng ngay mà không cần giải mã lại access_token.
            * Tranh verifyToken lai nhieu lan
            */
            ; (req as Request).decoded_authorization = decoded_authorization
          return true
        }
      }
    }
  })
)


/**
 * Why validate refresh_token:
 * - thường được lưu trong cơ sở dữ liệu (DB) hoặc Redis, dùng để cấp lại access_token mới khi hết hạn
 * - Khi người dùng logout, hệ thống xác thực refresh_token trước để đảm bảo token này hợp lệ.
 * - Sau khi xác thực thành công, ta có thể xóa refresh_token khỏi DB để đảm bảo nó không thể sử dụng lại sau khi logout
 * */

// validator refresh_token
const refreshTokenValidator = validate(checkSchema({
  refresh_token: {
    trim: true,
    custom: {
      options: async (value: string, { req }) => {
        if (!value) {
          throw new ErrorWithStatus({
            status: HTTP_STATUS.UNAUTHORIZED,
            message: USERS_MESSAGE.REFRESH_TOKEN_IS_REQUIRED
          })
        }
        try {
          const [decoded_refresh_token, refresh_token] = await Promise.all([
            // verify refresh_token
            verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
            // find refresh_token
            databaseServices.refreshTokens.findOne({ token: value })
          ])
          // have not fresh_token in DB
          if (!refresh_token && refresh_token === null) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGE.USED_REFRESH_TOKEN_OR_NOT_EXITS,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          ; (req as Request).decoded_refresh_token = decoded_refresh_token
        } catch (error) {
          // Token is error( bị sửa đổi , Token không đúng định dạng, Token đã hết hạn )
          if (error instanceof JsonWebTokenError) {
            throw new ErrorWithStatus({
              message: (error as JsonWebTokenError).message,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          throw error
        }
        return true
      }
    }
  }
}))

export { registerValidator, loginValidator, accessTokenValidator, refreshTokenValidator }

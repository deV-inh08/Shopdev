// import { ObjectId } from 'mongodb'
// import type { StringValue } from 'ms'
// import { TokenType } from '~/constants/enums'
// import { RegisterBody } from '~/models/request/user.request'
// import { signToken } from '~/utils/jwt'

// class UserServices {
//   // sign with: user_id, veerify status
//   private signEmailVerifyToken({ user_id, verify }: { user_id: string, verify: string }) {
//     return signToken({
//       payload: {
//         user_id,
//         token_type: TokenType.EmailVerifyToken,
//         verify
//       },
//       privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
//       option: {
//         expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
//       }
//     })
//   }

//   register(payload: RegisterBody) {
//     const user_id = new ObjectId()
//   }
// }

// const userServices = new UserServices()
// export default userServices

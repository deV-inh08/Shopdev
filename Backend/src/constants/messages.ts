export const USERS_MESSAGE = {
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_ALREADY_EXIST: 'Email alrready exits',
  EMAIL_DOSE_NOT_EXIST: 'Email does not exits',

  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be 6 to 50',
  PASSWORD_MUST_BE_STRONG: 'Password must be strong',

  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password incorrect',

  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm Password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm Password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm Password length must be 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG: 'Confirm Password must be strong',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',

  LAST_NAME_MUST_BE_A_STRING: 'Last name must be a string',
  LAST_NAME_MUST_BE_FROM_2_TO_10: 'Last name length must be from 2 to 10',
  FIRST_NAME_MUST_BE_A_STRING: 'First name must be a string',
  FIRST_NAME_MUST_BE_FROM_2_TO_10: 'First name length must be from 2 to 10',

  REGISTER_SUCCESS: 'Register successfully',
  LOGIN_SUCCESS: 'Login successfully',

  VALIDATION_ERROR: 'Validation error',

  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_DELETE_SUCCESS: 'Refresh token delete success',
  REFRESH_ACCESS_TOKEN_SUCCESS: 'Refresh access token success',
  USED_REFRESH_TOKEN_OR_NOT_EXITS: 'Used refresh token or not exits'
} as const

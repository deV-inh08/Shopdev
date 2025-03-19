import { type RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { ValidationChain, validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/status'

export const validate = (validate: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validate.run(req)
    const errors = await validationResult(req)
    if (errors.isEmpty()) {
      next()
    } else {
      res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        errors: errors.array()
      })
    }
  }
}
export default validate

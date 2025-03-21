import { Request } from "express";
import { TokenPayload } from "~/models/request/user.request";

declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload
  }
}

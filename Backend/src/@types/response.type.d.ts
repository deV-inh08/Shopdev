interface SuccessReponse<Data> {
  message: string
  data: Data
}

interface ErrorThrow {
  [key: string]: string
}

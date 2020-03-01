
class RequestValidationError extends Error {
  constructor(validationError){
    super(validationError.message)
    this.name = 'RequestValidationError'
    this.detail = validationError.details
  }
}

export default RequestValidationError

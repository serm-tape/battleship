class ApiError extends Error {
  constructor(errorCode, httpStatusCode, message){
    super(message)
    this.name = 'ApiError'
    this.errorCode = errorCode
    this.httpStatusCode = httpStatusCode
  }
}

export default ApiError
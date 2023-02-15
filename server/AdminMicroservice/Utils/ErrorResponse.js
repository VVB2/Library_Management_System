/**
 * The structure of the Error that needs to be send in case of error
 */
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default ErrorResponse;
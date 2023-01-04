import ErrorResponse from "../utils/errorResponse.js";

const ErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (err.code === 11000) {
        const message = 'Username/Email Already in use!';
        error = new ErrorResponse(message, 400);
    }

    if (err.code === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};

export default ErrorHandler;

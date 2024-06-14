class AppError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string, stack = '') {
        super(message);
        this.statusCode = statusCode;

        // Correctly set the prototype explicitly
        Object.setPrototypeOf(this, new.target.prototype);

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError;
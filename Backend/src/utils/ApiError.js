class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong", // Default value if no message is provided
        errors = [],                     // Default empty array for multiple validation errors
        stack = ""                       // Default empty string for the error trace
    ){
        // 1. Calls the parent Error constructor and passes the message.
        super(message)

        // 2. Attaches the HTTP status code (e.g., 400, 404, 500) to the error object.
        this.statusCode = statusCode

        // 3. Explicitly sets data to null because an error response carires no successful data.
        this.data = null

        // 4. Ensures the message property is explicitly set and easily visible on the object.
        this.message = message

        // 5. A helper flag for the frontend to quickly know the request failed.
        this.success = false;

        // 6. Stores detailed arrays of errors (like "Password too short", "Invalid email").
        this.errors = errors

        // 7. Handles the error stack trace (the file path and line numbers where the error happened).
        if (stack) {
            // If a custom stack trace was passed, use it.
            this.stack = stack
        } else {
            // If no stack trace was passed, find the exact line where this error happened,
            // but hide this ApiError constructor code from the logs to keep them clean.
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}
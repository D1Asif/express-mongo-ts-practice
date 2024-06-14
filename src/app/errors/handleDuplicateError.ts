import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const statusCode = 400;

    const path = Object.keys(err.errorResponse.keyValue)[0];

    // Using match() to get the first match
    const extractedMessage = err.message.match(/"(.*?)"/)[1];

    const errorSources: TErrorSources = [
        {
            path,
            message: `'${extractedMessage}' already exists`
        }
    ]

    return {
        statusCode,
        message: "Duplicate Error",
        errorSources
    }
}

export default handleDuplicateError;
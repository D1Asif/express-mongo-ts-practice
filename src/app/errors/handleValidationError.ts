import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const statusCode = 400;
    const errorSources: TErrorSources = Object.values(err.errors).map((value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => (
        {
            path: value?.path,
            message: value?.message
        }
    ))
    return {
        statusCode,
        message: "Validation error",
        errorSources
    }
}

export default handleValidationError;
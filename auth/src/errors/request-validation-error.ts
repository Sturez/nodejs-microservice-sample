import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(private errors: ValidationError[]) {
        super('Invalid parameters');

        // Only because because we're extending a builtin class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg, field: err.param }
        });
    }
}


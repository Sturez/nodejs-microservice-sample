import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {

    constructor(public errors: ValidationError[]) {
        super();


        // Only because because we're extending a builtin class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}


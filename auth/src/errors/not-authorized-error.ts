import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor(public msg: string) {
        super(msg);

        // Only because because we're extending a builtin class
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors() {
        return [
            { message: this.msg }
        ]
    }
}


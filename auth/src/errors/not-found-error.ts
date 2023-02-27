import { CustomError } from "./custom-error";

export class NotFound extends CustomError {
    statusCode: number = 404;

    constructor() {
        super("Route error");

        Object.setPrototypeOf(this, NotFound.prototype);
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{ message: `Not found` }];
    }

}
export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);
        // Only because because we're extending a builtin class
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    /**
     * @description should get erros in input and return them as an array of object type {message: string, field?:string }
     * @returns {{ message: string; field?: string }[]}
     */
    abstract serializeErrors(): { message: string; field?: string }[]
}
import { ValidationError } from 'express-validator';

export class DatabaseConnectionError extends Error {

    reason = "Error connecting to database";

    constructor() {
        super();


        // Only because because we're extending a builtin class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}


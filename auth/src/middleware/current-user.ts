import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

// reach an existing type definition and add a new property
declare global {
    namespace Express {
        interface Request {
            /**
             * @description descrie the current logged in user
             * @returns {UserPayload}
             */
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session?.jwt) {
        return next();
    }

    try {

        const payload = jwt.verify(
            req.session.jwt,
            //we check everything in the index.ts --> start()
            process.env.JWT_KEY!
        ) as UserPayload;

        req.currentUser = payload;

    } catch (error) {
    }

    next();
}


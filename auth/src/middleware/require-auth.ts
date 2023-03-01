import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

/**
 * @requires current-user middleware is required for this to work.
 * @description If a user is not loggedin it will raise an error
 */
export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if(!req.currentUser)
        throw new NotAuthorizedError('Not authorized');
        
    next();   
};
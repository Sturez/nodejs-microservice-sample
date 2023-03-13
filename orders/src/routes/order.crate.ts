import { requireAuth, validateRequest } from '@sturez-org/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/orders',
    requireAuth,
    [
        body('ticketId')
            .notEmpty()
            // checks if an input has the structure of a mongoose ID
            // commented because the service is assuming the DBMS of another service. coupling them conceptually
            // .custom((input: string) => {
            //     return mongoose.Types.ObjectId.isValid(input);
            // })
            .withMessage('Ticket Id must be provided')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        

        res.send({});
    });

export { router as orderCreateRouter };
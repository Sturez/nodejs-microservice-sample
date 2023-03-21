import { requireAuth, validateRequest } from "@sturez-org/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";


const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token').not().isEmpty().withMessage('You must provide a token'),
        body('orderId').not().isEmpty().withMessage('You must provide a valid Order Id'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        res.status(201).send({ success: true });
    });

export { router as paymentCreateRoute };
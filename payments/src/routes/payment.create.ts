import { BadRequestError, currentUser, NotAuthorizedError, NotFound, OrderStatus, requireAuth, validateRequest } from "@sturez-org/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";


const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token').not().isEmpty().withMessage('You must provide a token'),
        body('orderId').not().isEmpty().withMessage('You must provide a valid Order Id'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order)
            throw new NotFound();

        if (order.userId !== req.currentUser?.id)
            throw new NotAuthorizedError('Not authorized');

        if (order.status === OrderStatus.Cancelled)
            throw new BadRequestError('The order is expired and you cannot pay for it');

        if (order.status === OrderStatus.Completed)
            throw new BadRequestError('The order is already completed');

        const charge = await stripe.charges.create({
            amount: order.price * 100, //price should be sent as cents
            currency: 'usd',
            source: token
        });

        console.log(charge);

        const payment = Payment.build({
            orderId,
            chargeId: charge.id
        })

        await payment.save();

        res.status(201).send({ success: true });
    });

export { router as paymentCreateRoute };
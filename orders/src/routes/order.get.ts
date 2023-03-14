import { NotAuthorizedError, NotFound, requireAuth } from '@sturez-org/common';
import express, { Request, Response } from 'express';
import { Order } from '../../models/order';

const router = express.Router();

router.get('/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate('ticket');

        if (!order) {
            throw new NotFound();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError('Not authorized');
        }

        res.status(200).send(order);
    });

export { router as orderGetRouter };
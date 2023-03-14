import { NotAuthorizedError, NotFound, OrderStatus, requireAuth } from '@sturez-org/common';
import express, { Request, response, Response } from 'express';
import { Order } from '../../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const orderId = req.params.orderId;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFound();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError("you're not authorized to access this resource");
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        res.send(204);
    });

export { router as orderDeleteRouter };
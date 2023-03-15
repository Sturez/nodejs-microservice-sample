import { NotAuthorizedError, NotFound, OrderStatus, requireAuth } from '@sturez-org/common';
import express, { Request, response, Response } from 'express';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const orderId = req.params.orderId;

        const order = await Order.findById(orderId).populate('ticket');

        if (!order) {
            throw new NotFound();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError("you're not authorized to access this resource");
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        const publisher = new OrderCancelledPublisher(natsWrapper.client);
        publisher.publish({
            id: order.id,
            ticket: {
                id: order.ticket.id
            }
        });

        res.send(204);
    });

export { router as orderDeleteRouter };
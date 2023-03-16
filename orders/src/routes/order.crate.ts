import { BadRequestError, NotAuthorizedError, NotFound, OrderStatus, requireAuth, validateRequest } from '@sturez-org/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// 15 minutes
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

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

        if (!req.currentUser) {
            throw new NotAuthorizedError('You should login to create a new order');
        }
        const { ticketId } = req.body;

        // find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFound();
        }

        // make sure the ticket is not reserved, already
        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('An order for the provided ticket is already placed');
        }

        // calculate expiration date for the order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // build the order and save to the database

        const order = Order.build({
            userId: req.currentUser.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket
        });

        await order.save();
        // publish order-created event

        const publisher = new OrderCreatedPublisher(natsWrapper.client);
        publisher.publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            version: order.version,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price
            }
        });

        res.status(201).send(order);
    });

export { router as orderCreateRouter };
import { BadRequestError, currentUser, NotAuthorizedError, NotFound, requireAuth, validateRequest } from "@sturez-org/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";


const router = express.Router();

router.put('/api/tickets/:id',
    currentUser,
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('title').isLength({ min: 3, max: 100 }).withMessage('Title lenht must be between 3 and 100 chars'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greather than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticketId = req.params.id;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFound();
        }

        if(ticket.orderId){
            throw new BadRequestError('The ticket is already reserved by another order.');
        }

        if (req.currentUser?.id !== ticket.userId)
            throw new NotAuthorizedError('You are not authorized to update this ticket.');

        ticket.set({
            title: req.body.title,
            price: req.body.price
        });

        await ticket.save();
        
        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        });


        res.send(ticket);
    });

export { router as updateTicketRouter };
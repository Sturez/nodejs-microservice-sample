import { NotFound } from "@sturez-org/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const getTicketRouter = express.Router();

getTicketRouter.get('/api/tickets/:id',
    async (req: Request, res: Response) => {
        
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket)
            throw new NotFound();

        res.status(200).send(ticket);
    });


export { getTicketRouter };
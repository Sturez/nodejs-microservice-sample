import { Listener, OrderCancelledEvent, Subjects } from "@sturez-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queueGroupNames";


export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message): Promise<void> {

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket)
            throw new Error('Ticket not found');

        ticket.set({ orderId: undefined });
        await ticket.save();

        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version
        });

        msg.ack();
    }

};

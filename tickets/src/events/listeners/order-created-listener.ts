import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@sturez-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queueGroupNames";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {

        //find the ticket the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error("Ticket not found");
        }
        // mark the ticket as reserved
        ticket.orderId = data.id;
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });

        //ack the messaging server
        msg.ack();
    }
};
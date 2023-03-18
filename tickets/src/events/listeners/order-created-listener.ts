import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@sturez-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
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

        //ack the messaging server
        msg.ack();
    }
};
import { Listener, Subjects, TicketUpdatedEvent } from "@sturez-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
        //const ticket = await Ticket.findById(data.id);
        const ticket = await Ticket.findOne({
            _id: data.id,
            version: data.version - 1
        });

        // if we won't find the right version of the ticket, we throw
        // the error. this should grant tickets to be parsed in the right order
        if (!ticket) {
            throw new Error("Ticket not found");
        }

        const { title, price } = data;

        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }

}
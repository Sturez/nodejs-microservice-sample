import { Listener, Subjects, TicketUpdatedEvent } from "@sturez-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
        //const ticket = await Ticket.findById(data.id);
        const ticket = await Ticket.findByEvent(data);

        // if we won't find the right version of the ticket, we throw
        // the error. this should grant tickets to be parsed in the right order
        if (!ticket) {
            throw new Error("Ticket not found");
        }

        // we should not use the mongoose auto increment plugin
        // in this way we are going to get the same ID & version from the event
        
        // const { title, price, version } = data;
        // ticket.set({ title, price, version });
        
        const { title, price } = data;

        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }

}
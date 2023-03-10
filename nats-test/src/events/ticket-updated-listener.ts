import nats from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from "@sturez-org/common";

export default class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName: string = 'payments-service';

    onMessage(data: TicketUpdatedEvent['data'], msg: nats.Message): void {
        try {
            console.log('Event data!', data);
            msg.ack();

        } catch (error) {

        }
    }

}
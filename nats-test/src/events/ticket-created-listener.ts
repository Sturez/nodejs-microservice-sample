import nats from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from "@sturez-org/common";

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName: string = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: nats.Message): void {
        try {
            console.log('Event data!', data);
            msg.ack();

        } catch (error) {

        }
    }

}
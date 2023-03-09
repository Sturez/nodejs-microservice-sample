import nats from 'node-nats-streaming';
import Listener from "./base.listener";
import { Subjects } from './subjects';
import TicketCreatedEvent from './ticket-created.event';

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
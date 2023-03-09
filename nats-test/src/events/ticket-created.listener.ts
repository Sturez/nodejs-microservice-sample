import nats from 'node-nats-streaming';
import Listener from "./Listener";

export default class TicketCreatedListener extends Listener {
    subject: string = 'ticket:created';

    queueGroupName: string = 'payments-service';

    onMessage(data: any, msg: nats.Message): void {
        try {
            console.log('Event data!', data);

            msg.ack();

        } catch (error) {

        }
    }

}
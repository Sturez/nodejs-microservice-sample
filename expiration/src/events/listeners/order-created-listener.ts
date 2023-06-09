import { Listener, Subjects } from "@sturez-org/common";
import { OrderCreatedEvent } from "@sturez-org/common/build/events/order-created-event";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queueGroupNames";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        expirationQueue.add({
            orderId: data.id
        }, 
        {
            delay: delay
        }
        );

        msg.ack();
    }
};
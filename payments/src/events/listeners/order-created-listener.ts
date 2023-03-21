import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@sturez-org/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupname } from "./queueGroupName";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName: string = queueGroupname;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {

        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        });

        await order.save();

        msg.ack();
    }
}
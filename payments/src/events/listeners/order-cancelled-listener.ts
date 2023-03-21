import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@sturez-org/common"
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupname } from "./queueGroupName";


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName: string = queueGroupname;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {

        const order = await Order.findOne({
            id: data.id,
            version: data.version - 1
        });

        if (!order)
            throw new Error("Order not found!");

        order.set({ status: OrderStatus.Cancelled });
        await order.save();
        msg.ack();
    }

}
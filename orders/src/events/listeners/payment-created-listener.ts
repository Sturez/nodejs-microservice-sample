import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@sturez-org/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order)
            throw new Error("Order Not found!!");

        order.set({ status: OrderStatus.Completed });
        await order.save();

        msg.ack();
    }

}
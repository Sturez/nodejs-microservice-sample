import { OrderCancelledEvent, OrderStatus } from "@sturez-org/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener";


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const ticketId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(), 
        price: 20,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        ticket: {
            id: ticketId,
        },
        version: 1
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, data, msg, order }
};

it('updates the order status', async () => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    const orderUpdated = await Order.findById(data.id);

    expect(orderUpdated?.status).toEqual(OrderStatus.Cancelled);
    expect(orderUpdated?.version).toEqual(data.version);

});
it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});


import { OrderCancelledEvent } from "@sturez-org/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    // create the Listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // create and save the ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 130,
        userId: new mongoose.Types.ObjectId().toHexString()
    });

    // setting the order id in a second time
    const orderId = new mongoose.Types.ObjectId().toHexString();
    ticket.set({ orderId })

    await ticket.save();


    // create the fake data event
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, orderId }
}

it('cancels an Order', async () => {

    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).not.toBeDefined();

}); 
it('publishes an event', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();

});
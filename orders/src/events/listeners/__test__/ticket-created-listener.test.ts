
import { TicketCreatedEvent } from '@sturez-org/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client)

    // create a fake data event
    const data: TicketCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 100,
        title: 'Test concert',
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    };

    // create a fake message obj
    // @ts-ignore --> we're using only the ack
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}

it('creates and saves a ticket', async () => {

    const { listener, data, msg } = setup();
    // call the onMessage function
    await listener.onMessage(data, msg);

    // check if the ticket is created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
    expect(ticket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = setup();
    // call the onMessage function
    await listener.onMessage(data, msg);

    //check the ack is created
    expect(msg.ack).toHaveBeenCalled();
});

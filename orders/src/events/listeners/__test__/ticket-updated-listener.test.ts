
import { TicketUpdatedEvent } from '@sturez-org/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // create a new ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 100,
        title: 'Test concert',
        version: 0
    });

    await ticket.save();

    // create a fake data event
    const data: TicketUpdatedEvent["data"] = {
        id: ticket.id,
        price: 10,
        title: 'New concert',
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: ticket.version + 1
    };

    // create a fake message obj
    // @ts-ignore --> we're using only the ack
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket };
}

it('finds, updates and saves the ticket', async () => {

    const { listener, data, msg } = await setup();
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
    const { listener, data, msg } = await setup();
    // call the onMessage function
    await listener.onMessage(data, msg);

    //check the ack is created
    expect(msg.ack).toHaveBeenCalled();
});


it('does not save events with wrong version number', async () => {
    const { listener, data, msg, ticket } = await setup();

    data.version = 10;

   try {
     await listener.onMessage(data, msg);
 
   } catch (error) {
    
   }

   expect(msg.ack).not.toHaveBeenCalled();

});
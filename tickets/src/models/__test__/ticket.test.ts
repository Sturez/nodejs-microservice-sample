import mongoose from "mongoose";
import { Ticket } from "../ticket";

it('implements OOC Optimistic Concurrency Control', async () => {
    // create instanc e of ticket
    const ticket = Ticket.build({
        title: 'concert 1',
        price: 20,
        userId: new mongoose.Types.ObjectId().toString()
    });

    // save it to DB

    await ticket.save();
    //fetch the ticket twice

    const fetched1 = await Ticket.findById(ticket.id);
    const fetched2 = await Ticket.findById(ticket.id);

    // make 2 different changes


    fetched1!.set({ price: 100 });
    fetched2!.set({ price: 1000 });

    // save the 1st fetched ticket and expect a success
    await fetched1!.save();

    // save the second fetched ticket (has the same Version number) 
    // expect failure

    try {
        await fetched2!.save();
    } catch (error) {
        return;
    }

    throw new Error('It should throw an OCC error!');
});
it('increments the version number after each save', async () => {
    // create instanc e of ticket
    const ticket = Ticket.build({
        title: 'concert 1',
        price: 20,
        userId: new mongoose.Types.ObjectId().toString()
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);

});
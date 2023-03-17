import mongoose from "mongoose";
import request from "supertest";
import { Ticket } from "../../../models/ticket";
import { app } from "../../app";


async function generateTicket() {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'Concert',
        price: 30
    });

    await ticket.save();

    return { ticket };
}

async function createOrder(ticketId: string, cookie: string[]) {
    return await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId });
}

it('has a route handler listening to /api/orders for get requests', async () => {
    const response = await request(app)
        .get('/api/orders')
        .send();

    expect(response.status).not.toEqual(404);
});


it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .get('/api/orders')
        .send();

    expect(response.status).toEqual(401);
});


it('fetches orders for a particular user', async () => {

    const user1Cookie = signin();
    const user2Cookie = signin();

    // creating 3 tickets
    const ticket1 = await generateTicket();
    const ticket2 = await generateTicket();
    const ticket3 = await generateTicket();

    // create 1 order for user 1 and 2 for user 2
    const { body: order1 } = await createOrder(ticket1.ticket.id, user1Cookie);
    const { body: order2 } = await createOrder(ticket2.ticket.id, user2Cookie);
    const { body: order3 } = await createOrder(ticket3.ticket.id, user2Cookie);

    // get the ticket lists for user 2
    const cookie = signin();
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2Cookie)
        .send();

    // expect 2 tickets (the one of user 2)
    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(2);

    // checking the tickets are the same as the ones i should see
    expect(response.body[0].id).toEqual(order2.id);
    expect(response.body[1].id).toEqual(order3.id);
    expect(response.body[0].id).not.toEqual(order1.id);
    expect(response.body[1].id).not.toEqual(order1.id);
});



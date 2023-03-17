import { OrderStatus } from "@sturez-org/common";
import mongoose from "mongoose";
import request from "supertest";
import { Order } from "../../../models/order";
import { Ticket, TicketDoc } from "../../../models/ticket";
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

async function generateOrder(ticket: TicketDoc) {
    const order = Order.build({
        userId: '123123',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket: ticket
    });

    await order.save();

    return { order };
}


async function createOrder(ticketId: string, cookie: string[]) {
    return await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId });
}

it('has a route handler listening to /api/orders for get requests', async () => {
    const { ticket } = await generateTicket();
    const { order } = await generateOrder(ticket);

    const cookie = global.signin()
    const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    const { ticket } = await generateTicket();
    const { order } = await generateOrder(ticket);

    const cookie = global.signin()
    const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .send({});

    expect(response.status).toEqual(401);
});

it('fails fetching orders of another user', async () => {

    const user1Cookie = signin();
    const user2Cookie = signin();

    // creating 1 ticket
    const { ticket } = await generateTicket();

    // create 1 order for user 1
    const { body: order1 } = await createOrder(ticket.id, user1Cookie);

    // get the ticket for user 2
    const response = await request(app)
        .get(`/api/orders/${order1.id}`)
        .set('Cookie', user2Cookie)
        .send();

    expect(response.status).toEqual(401);
});


it('404 for not existing orders', async () => {

    const user1Cookie = signin();

    // creating 1 ticket
    const { ticket } = await generateTicket();

    // create 1 order for user 1
    await createOrder(ticket.id, user1Cookie);

    const fakeId = new mongoose.Types.ObjectId();
    // get the fakeId ticket for user 1
    const response = await request(app)
        .get(`/api/orders/${fakeId}`)
        .set('Cookie', user1Cookie)
        .send();

    // expect the order not be found
    expect(response.status).toEqual(404);
});

it('fetches orders for a particular user', async () => {

    const user1Cookie = signin();

    // creating 1 ticket
    const { ticket } = await generateTicket();

    // create 1 order for user 1
    const { body: order1 } = await createOrder(ticket.id, user1Cookie);

    // get the ticket for user 1
    const response = await request(app)
        .get(`/api/orders/${order1.id}`)
        .set('Cookie', user1Cookie)
        .send();

    // expect the order
    expect(response.status).toEqual(200);

    // checking the tickets are the same as the ones i should see
    expect(response.body.id).toEqual(order1.id);
});


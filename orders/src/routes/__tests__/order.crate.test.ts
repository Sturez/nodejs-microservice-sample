import { OrderStatus } from "@sturez-org/common";
import mongoose from "mongoose";
import request from "supertest";
import { Order } from "../../../models/order";
import { Ticket, TicketDoc } from "../../../models/ticket";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";


async function generateTicket() {
    const ticket = Ticket.build({
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

}


it('has a route handler listening to /api/orders for post requests', async () => {
    const response = await request(app)
        .post('/api/orders')
        .send({});

    expect(response.status).not.toEqual(404);
});


it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/orders')
        .send({});

    expect(response.status).toEqual(401);
});


it('if the user is signed in sould access the orders', async () => {
    const cookie = signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it('thows error if no ticketId is associated with the data', async () => {
    const cookie = signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({});

    expect(response.status).toEqual(400);
});

it('returns an error if the ticket does not exists', async () => {

    const ticketId = new mongoose.Types.ObjectId();

    const cookie = signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId });

    expect(response.status).toEqual(404);

});

it('returns an error if the ticket is already reserved', async () => {

    const { ticket } = await generateTicket();
    await generateOrder(ticket);

    const cookie = signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id });

    expect(response.status).toEqual(400);
});

it('reserves a ticket', async () => {
    const { ticket } = await generateTicket();

    const cookie = signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id });

    expect(response.status).toEqual(201);

});

it('emits an event to notify an order', async () => {
    const { ticket } = await generateTicket();

    const cookie = signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id });

    expect(response.status).toEqual(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
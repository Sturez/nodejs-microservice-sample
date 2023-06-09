import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'this is a title',
            price: 10
        });

    expect(response.statusCode).toEqual(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'this is a title',
            price: 10
        });

    expect(response.statusCode).toEqual(401);

});

it('returns a 401 if the user does not own the ticket', async () => {

    const user1Cookie = signin();
    const user2Cookie = signin();

    const ticketTitle = 'this is valid';
    const createTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', user1Cookie)
        .send({
            title: ticketTitle,
            price: 10
        })

    expect(createTicket.status).toEqual(201);
    const ticketId = createTicket.body.id;
    expect(ticketId).toBeDefined();

    const updateTicketResponse = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', user2Cookie)
        .send({
            title: 'this is a title',
            price: 20
        });

    expect(updateTicketResponse.statusCode).toEqual(401);

});

it('returns a 400 if the user does not provide a valid price or title', async () => {

    const user1Cookie = signin();

    const ticketTitle = 'this is valid';
    const createTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', user1Cookie)
        .send({
            title: ticketTitle,
            price: 10
        })

    expect(createTicket.status).toEqual(201);
    const ticketId = createTicket.body.id;
    expect(ticketId).toBeDefined();

    const updateTicketResponse = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', user1Cookie)
        .send({
            title: '',
            price: 20
        });

    expect(updateTicketResponse.statusCode).toEqual(400);

    const updateTicketResponse2 = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', user1Cookie)
        .send({
            title: ticketTitle,
            price: '20a'
        });

    expect(updateTicketResponse2.statusCode).toEqual(400);

    const updateTicketResponse3 = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', user1Cookie)
        .send({
            title: ticketTitle,
            price: -20
        });

    expect(updateTicketResponse3.statusCode).toEqual(400);

});

it('updates the ticket if it is a valid input', async () => {
    const cookie = signin();

    const ticketTitle = 'this is valid';
    const createTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: ticketTitle,
            price: 10
        });

    expect(createTicket.status).toEqual(201);
    const ticketId = createTicket.body.id;
    expect(ticketId).toBeDefined();

    const newTitle = 'another valid title';
    const newPrice = 30;

    const updateTicketResponse = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice
        });

    expect(updateTicketResponse.statusCode).toEqual(200);
    expect(updateTicketResponse.body.title).toEqual(newTitle);
    expect(updateTicketResponse.body.price).toEqual(newPrice);

});

it('publishes an event if a ticket is being updated', async () => {
    const cookie = signin();

    const ticketTitle = 'this is valid';
    const createTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: ticketTitle,
            price: 10
        });

    expect(createTicket.status).toEqual(201);
    const ticketId = createTicket.body.id;
    expect(ticketId).toBeDefined();

    const newTitle = 'another valid title';
    const newPrice = 30;

    const updateTicketResponse = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice
        });

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects ticket update if the ticket is already reserved', async () => {
    const cookie = signin();

    // create a new ticket
    const ticketTitle = 'this is valid';
    const createTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: ticketTitle,
            price: 10
        });

    expect(createTicket.status).toEqual(201);
    const ticketId = createTicket.body.id;
    expect(ticketId).toBeDefined();

    // change ticket OrderId property

    const dbTicket = await Ticket.findById(ticketId);
    dbTicket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

    await dbTicket?.save();

    // edit the new ticket
    const newTitle = 'another valid title';
    const newPrice = 30;

    const updateTicketResponse = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice
        });

    expect(updateTicketResponse.statusCode).toEqual(400);
});
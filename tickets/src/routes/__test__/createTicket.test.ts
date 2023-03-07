import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).toEqual(401);
});

it('if the user is signed in sould access the tickets', async () => {
    const cookie = signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invlaid title is provided', async () => {
    const cookie = signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        }).expect(400);

    const response2 = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        }).expect(400);
});

it('returns an error if an invlaid price  is provided', async () => {
    const cookie = signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'this is valid',
            price: 'a11'
        }).expect(400);

    const response2 = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'this is valid'
        }).expect(400);
});

it('creates a ticket with valid input', async () => {
    let tickets = await Ticket.count({});

    expect(tickets).toEqual(0);
    const ticketTitle = 'this is valid';
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: ticketTitle,
            price: 10
        }).expect(201);

    let newTickets = await Ticket.find({});

    expect(newTickets.length).toEqual(1);
    expect(newTickets[0]["title"]).toEqual(ticketTitle);
    expect(newTickets[0]["price"]).toEqual(10);

});
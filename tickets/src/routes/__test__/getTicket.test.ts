import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns 404 if ticket is not found', async () => {
    const fakeId = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .get(`/api/tickets/${fakeId}`)
        .send();

    expect(response.statusCode).toEqual(404);
});

it('returns the ticket if the ticket is found', async () => {
    const ticketTitle = 'this is valid';
    const ticketPrice = 20;

    const createTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: ticketTitle,
            price: ticketPrice
        }).expect(201);

    const response = await request(app)
        .get(`/api/tickets/${createTicket.body.id}`)
        .send().expect(200);

    expect(response.body.title).toEqual(ticketTitle);
    expect(response.body.price).toEqual(ticketPrice);

});

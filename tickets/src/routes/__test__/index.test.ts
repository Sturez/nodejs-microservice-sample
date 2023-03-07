import request from "supertest";
import { app } from "../../app";

const createTicket = (ticket: any) => {
    const { ticketTitle, ticketPrice } = ticket;
    return request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: ticketTitle,
            price: ticketPrice
        });
}


it('can fetch a list of tickets', async () => {
    const ticketTitle = 'this is valid';
    const ticketPrice = 20;

    await createTicket({ ticketTitle, ticketPrice });
    await createTicket({ ticketTitle, ticketPrice });
    await createTicket({ ticketTitle, ticketPrice });

    const response = await request(app)
        .get('/api/tickets')
        .send();

    expect(response.statusCode).toEqual(200);

    expect(response.body.length).toEqual(3);

});
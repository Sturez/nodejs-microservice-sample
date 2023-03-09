import nats from 'node-nats-streaming';
import Publisher from './events/base.publisher';
import TicketCreatedPublisher from './events/ticket-created.publisher';

console.clear();

// stan is the client
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log('publisher connected to nats');

    const publihser = new TicketCreatedPublisher(stan);
    try {

        await publihser.publish({
            id: '123123',
            title: 'asdasd',
            price: 20
        });

    } catch (error) {
        console.error(error);

    }
});
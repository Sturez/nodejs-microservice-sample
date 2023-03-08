import nats, { Message, Subscription, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// stan is the client
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});


stan.on('connect', () => {
    console.log(' listener connected to NATS');

    const options = stan
        .subscriptionOptions()
        // this send the ack back to the publisher
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('order-service');

    const subscribtion: Subscription = stan.subscribe('ticket:created',
        'order-service-queueGroup',
        options);

    subscribtion.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data:${data}`);
        }

        msg.ack();
    });

    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });
});


process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());



abstract class Listner {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void;

    private client: Stan;
    protected ackWait: number = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscribtion = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscribtion.on('message', (msg: Message) => {
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();

        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'));
    }
}
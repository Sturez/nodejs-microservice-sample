import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';
const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error("JWT Key env variable must be defined");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI env variable must be defined");
    }

    if (!process.env.NATS_URL) {
        throw new Error("NATS_URL env variable must be defined");
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID env variable must be defined");
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLUSTER_ID env variable must be defined");
    }

    try {

        console.log("Connecting to NATS");
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        console.log("Connected!");
        
        
        console.log("Setting up listeners !");
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
        console.log("Listners ready !");


        console.log("Connecting to mongo");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected!");
    } catch (error) {
        console.error(error);
    }

    app.listen(3000, () => {
        console.log('Tickets service listening on port 3000');
    });
}

start();
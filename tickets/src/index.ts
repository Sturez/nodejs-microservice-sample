import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error("JWT Key env variable must be defined");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI env variable must be defined");
    }

    try {

        console.log("Connecting to NATS");
        await natsWrapper.connect('ticketing','123321','http://nats-srv:4222');

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        console.log("Connected!");

        console.log("Connecting to mongo");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected!");
    } catch (error) {
        console.error(error);
    }

    app.listen(3000, () => {
        console.log('Auth service listening on port 3000');
    });
}

start();
import mongoose from 'mongoose';
import { app } from './app';
const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error("JWT Key env variable must be defined");
    }

    try {
        console.log("Connecting to mongo");
        await mongoose.connect('mongodb://auth-mongo-srv');
        console.log("Connected!");
    } catch (error) {
        console.error(error);
    }

    app.listen(3000, () => {
        console.log('Auth service listening on port 3000');
    });
}

start();
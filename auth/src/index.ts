import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import mongoose, { mongo } from 'mongoose';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFound } from './errors/not-found-error';


const app = express();
// we need the app to trust Nginx
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    secure: true,
    signed: false
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
    throw new NotFound();
});

app.use(errorHandler);


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
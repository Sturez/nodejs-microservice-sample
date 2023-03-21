import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFound } from '@sturez-org/common';
import { paymentCreateRoute } from './routes/payment.create';


const app = express();
// we need the app to trust Nginx
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

app.use(paymentCreateRoute);

app.all('*', async (req, res) => {
    throw new NotFound();
});

app.use(errorHandler);

export { app };
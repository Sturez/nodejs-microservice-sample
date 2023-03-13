import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFound } from '@sturez-org/common';
import { orderListRouter } from './routes/order.list';
import { orderCreateRouter } from './routes/order.crate';
import { orderDeleteRouter } from './routes/order.delete';
import { orderGetRouter } from './routes/order.get';
 
const app = express();
// we need the app to trust Nginx
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

 app.use(orderListRouter);
 app.use(orderCreateRouter);
 app.use(orderDeleteRouter);
 app.use(orderGetRouter);


app.all('*', async (req, res) => {
    throw new NotFound();
});

app.use(errorHandler);

export { app };
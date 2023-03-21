import { OrderStatus } from '@sturez-org/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';

it('returns a 404 when purchasing an order that does not exists', async () => {

    const orderId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdasdasdsads',
            orderId: orderId
        }).expect(404);

});
it('returns a 401 when purchasing an order that does not belong to the user', async () => {

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdasdasdsads',
            orderId: order.id
        }).expect(401);

});
it('returns a 400 when purchasing a cancelled order', async () => {

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'asdasdasdsads',
            orderId: order.id
        }).expect(400);

});
it('returns a 400 when purchasing a completed order', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Completed
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'asdasdasdsads',
            orderId: order.id
        }).expect(400);

});
it('returns a 400 when purchasing a completed order', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'asdasdasdsads',
            orderId: order.id
        }).expect(201);

});

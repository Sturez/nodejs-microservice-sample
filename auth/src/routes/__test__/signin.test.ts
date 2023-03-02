import request from "supertest";
import { app } from "../../app";

it('fails with an email that have never been supplied', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('returns a 201 on successful signin', async () => {
    const req = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

        return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('returns a 400 on signin with invalid email', async () => {
    const req = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'testtest.com',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 on signin with wrong password', async () => {
    const req = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'testtest.com',
            password: 'passsssword'
        })
        .expect(400);
});

it('returns a 400 on signin without email', async () => {
    const req = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    return request(app)
        .post('/api/users/signin')
        .send({
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 on signin without password', async () => {
    const req = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com'
        })
        .expect(400);
});

it('Sets a cookie after successful signin ', async () => {
    const req = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    return expect(response.get('Set-Cookie')).toBeDefined();
});
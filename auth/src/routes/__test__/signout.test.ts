import request from "supertest";
import { app } from "../../app";


it('signout when when i\' ve never signed in', async () => {
    const signout = await request(app)
        .post('/api/users/signout')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);

});
it('signout when when i\' ve signed in', async () => {
    const signup = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    const signin = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    expect(signin.get('Set-Cookie')).toBeDefined();

    const signout = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    expect(signout.get('Set-Cookie')).toBeDefined();
    expect(signout.get('Set-Cookie')[0])
        .toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
});

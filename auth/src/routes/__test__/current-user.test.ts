import request from "supertest";
import { app } from "../../app";

it('get current user when I am logged in', async () => {
    const cookie = await global.signin();

    const currentuser = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(currentuser.body.currentUser.email).toEqual('test@test.com');
    expect(currentuser.body.currentUser.id).toBeDefined();

});

it('get unauthorized not authenticated', async () => {
       const currentuser = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(401);
});
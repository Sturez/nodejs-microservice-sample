import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;
declare global {
    var signin: () => string[];
}

beforeAll(async () => {
    process.env.JWT_KEY = '123456789';

    mongo = await MongoMemoryServer.create();
    const mongoURI = mongo.getUri();

    await mongoose.connect(mongoURI, {});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = () => {

    // build JWT payload {id, email}
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // create JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // build session object {jwt:MY_JWT}
    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);

    // take JSON and encode as Base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return string that's cookie in string data
    return [`session=${base64}`];
}
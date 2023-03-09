import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";


interface Event {
    subject: Subjects;
    data: any;
}

export default abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];
    client: Stan;

    /**
     * @description Creates a new instance of a publisher of the given type
     * @param {Stan} client NATS streaming server client
     */
    constructor(client: Stan) {
        this.client = client;

    }

    publish(data: T['data']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    reject(err);
                }
                console.log('event published: ', this.subject);
                resolve();
            });
        });
    }

}
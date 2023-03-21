import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {

    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error("Cannot access NATS client before connecting");
        }

        return this._client as Stan;
    }

    connect(clusterId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise<void>((resolve, reject) => {
            try {
                this._client?.on('connect', () => {
                    console.log('connected to ', clusterId);
                    resolve();
                });

                this._client?.on('error', (err) => {
                    console.log('Failed to connect to ', clusterId);
                    reject(err);
                });
            } catch (error) {
                reject(error);
            }

        });
    }

    dispose() {
        if (!this._client) {
            throw new Error("Cannot access NATS client before connecting");
        }
        this._client.close();
    }
};

export const natsWrapper = new NatsWrapper()



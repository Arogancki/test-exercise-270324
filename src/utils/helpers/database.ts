import { Logger } from 'pino';
import File from "./file";
// @ts-ignore
import { createClient } from 'redis';
import env from "../../configs/env";
import path from 'path'

interface IDatabaseArgs {
    logger: Logger;
    file: File;
}

const IS_TEST = env.NODE_ENV === 'test';

export default class Database {
    private logger: Logger;
    private file: File;
    private client = this.createNewClient();

    constructor({ logger, file }: IDatabaseArgs) {
        this.logger = logger;
        this.file = file;
    }

    async init() {
        await this.client.connect();
        await this.restoreSeed();
    }

    getCollectionName(collection: string) {
        return IS_TEST ? `${collection}-test` : collection;
    }

    async restoreSeed() {
        const collectionsPath = [__dirname, '..', '..', 'seed'];
        const collections = await this.file.readDir(...collectionsPath);
        const entities = (await Promise.all(
            collections.map(async collection => {
                const keys = await this.file.readDir(...collectionsPath, collection);

                return Promise.all(keys.map(async key => ({
                    collection: this.getCollectionName(collection),
                    key: path.parse(key).name.toLowerCase(),
                    // TODO: data should be validated before putting in
                    content: await this.file.readJsonFile(...collectionsPath, collection, key)
                })))
            })
        )).flat();

        await entities.reduce((acc, entity) =>
            IS_TEST
                ? acc.hSet(entity.collection, entity.key, entity.content)
                : acc.hSetNX(entity.collection, entity.key, entity.content),
            this.client.multi()
        ).exec();
    }

    async close() {
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }

    private createNewClient() {
        const client = createClient({
            url: env.REDIS_URL,
        });

        client.on('error', (err: any) => {
            this.logger.error('Redis Client Error', err);
            process.exit(1);
        });

        return client
    }

    getClient() {
        return this.client;
    }

    async upsert(collection: string, id: string, value: string) {
        return !!(await this.client.hSet(this.getCollectionName(collection), id, value));
    }

    async getJSON(collection: string, id: string) {
        const result = await this.client.hGet(this.getCollectionName(collection), id);

        return result ? JSON.parse(result) : null;
    }
}

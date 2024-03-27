import { RedisClientType } from "redis";
import Database from "./database";

interface ILockArgs {
    database: Database;
}

export default class Lock {
    private client: RedisClientType;

    constructor({ database }: ILockArgs) {
        this.client = database.getClient() as RedisClientType;
    }

    async withKey(key: string, fun: () => any) {
        const lock = `_lock-${key}`;

         // lock only for 30 sec, error handling should resolve this
        if (!await this.client.set(lock, "1", { NX: true, EX: 30 })) {
            return;
        }

        try {
            return await fun();
        } 
        catch (err) {
            throw err;
        }
        finally {
            await this.client.del(lock);
        }
    }
}

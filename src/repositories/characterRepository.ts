import Database from "../utils/helpers/database";
import { JSONObject } from "../types/JSONObject";

interface ICharacterRepositoryArgs {
    database: Database;
}

export default class CharacterRepository {
    private database: Database;

    constructor({ database }: ICharacterRepositoryArgs) {
        this.database = database;
    }

    async get(id: string) {
        return this.database.getJSON('characters', id);
    }

    async upsert(id: string, value: JSONObject) {
        return this.database.upsert('characters', id, JSON.stringify(value));
    }
}

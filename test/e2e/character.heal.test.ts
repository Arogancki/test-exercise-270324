import request from 'supertest';
import { DependencyContainer, Types } from "../../src/utils/dependency";
import { Express } from 'express';
import expressServerFactory from '../../src/factories/expressServerFactory';
import { asValue } from 'awilix';

const ENDPOINT = "/api/v1/character/heal";

let application: Express | null = null;
let mockedRollResult = 5;
const dependenceInstance = DependencyContainer.getInstance()
describe('Heal character', () => {
    beforeAll(async () => {
        dependenceInstance.register({
            diceService: asValue({
                doRoll: () => mockedRollResult,
            })
        });
        application = (await expressServerFactory(dependenceInstance.cradle)).application;
    })
    beforeEach(async () => {
        mockedRollResult = 5;
        await (dependenceInstance.resolve(Types.Database)?.restoreSeed());
    })

    test('does heal character', async () => {
        const response = await request(application).post(ENDPOINT).send({ name: 'briv' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25 }, after: { hitPoints: 30 } } });
    });

    test('heals given amount if present', async () => {
        const response = await request(application).post(ENDPOINT).send({ name: 'briv', amount: 15 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25 }, after: { hitPoints: 40 } } });
    });

    test('does not heal dead characters', async () => {
        await request(application).post('/api/v1/character/damage').send({ name: 'briv',type: 'piercing', amount: 100 });
        const response = await request(application).post(ENDPOINT).send({ name: 'briv', amount: 15 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ hitPointChange: { before: { hitPoints: 0 }, after: { hitPoints: 0 } } });
    });

    test('Validation works', async () => {
        const response = await request(application).post(ENDPOINT).send({});

        expect(response.statusCode).toBe(400);
    });
});

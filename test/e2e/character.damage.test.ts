import request from 'supertest';
import { DependencyContainer, Types } from "../../src/utils/dependency";
import { Express } from 'express';
import expressServerFactory from '../../src/factories/expressServerFactory';  // Path to your TypeScript Express app
import { asValue } from 'awilix';

const ENDPOINT = "/api/v1/character/damage";

let application: Express | null = null;
let mockedRollResult = 5;
const dependenceInstance = DependencyContainer.getInstance()
describe('Damage character', () => {
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

    test('does regular damage to character', async () => {
        const response = await request(application).post(ENDPOINT).send({ name: 'briv', type: 'piercing' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25 }, after: { hitPoints: 20 } } });
    });

    test('damages given amount if present', async () => {
        const response = await request(application).post(ENDPOINT).send({ name: 'briv', amount: 7, type: 'piercing' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25 }, after: { hitPoints: 18 } } });
    });

    test('does 0 damage to immune target', async () => {
        const response = await request(application).post(ENDPOINT).send({ name: 'briv', type: 'fire' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25 }, after: { hitPoints: 25 } } });
    });

    test('does half damage to resistant target', async () => {
        const response = await request(application).post(ENDPOINT).send({ name: 'briv', type: 'slashing' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25 }, after: { hitPoints: 23 } } });
    });

    test('life cannot go below 0', async () => {
        mockedRollResult = 35;
        const response = await request(application).post(ENDPOINT).send({ name: 'briv', type: 'piercing' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25 }, after: { hitPoints: 0 } } });
    });

    test('Validation works', async () => {
        const response = await request(application).post(ENDPOINT).send({ });

        expect(response.statusCode).toBe(400);
    });
});

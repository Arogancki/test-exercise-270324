import request from 'supertest';
import { DependencyContainer, Types } from "../../src/utils/dependency";
import { Express } from 'express';
import expressServerFactory from '../../src/factories/expressServerFactory';  
import { asValue } from 'awilix';

const ENDPOINT = "/api/v1/character/tempHp/add";

let application: Express | null = null;
let mockedRollResult = 5;
const dependenceInstance = DependencyContainer.getInstance()
describe('TempHp', () => {
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

    test('does add temp hp', async () => {
        const response = await request(application).post(ENDPOINT).send({ name: 'briv' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ tempHitPointsChange: { before: { tempHitPoints: 0 }, after: { tempHitPoints: 5 } } });
    });

    test('heals given amount if present', async () => {
        const response = await request(application).post(ENDPOINT).send({ name: 'briv', amount: 15 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ tempHitPointsChange: { before: { tempHitPoints: 0 }, after: { tempHitPoints: 15 } } });
    });

    test('does temp points stack', async () => {
        await request(application).post(ENDPOINT).send({ name: 'briv' });
        const response = await request(application).post(ENDPOINT).send({ name: 'briv' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ tempHitPointsChange: { before: { tempHitPoints: 5 }, after: { tempHitPoints: 10 } } });
    });

    test('does not add temp heal points to dead characters', async () => {
        await request(application).post('/api/v1/character/damage').send({ name: 'briv', type: 'piercing', amount: 100 });
        const response = await request(application).post(ENDPOINT).send({ name: 'briv' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ tempHitPointsChange: { before: { tempHitPoints: 0 }, after: { tempHitPoints: 0 } } });
    });

    test('does take temp hp before hp', async () => {
        await request(application).post(ENDPOINT).send({ name: 'briv' });

        const responseHit1 = await request(application).post('/api/v1/character/damage').send({ name: 'briv', type: 'piercing', amount: 3 });
        expect(responseHit1.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25, tempHitPoints: 5 }, after: { hitPoints: 25, tempHitPoints: 2 } } });

        const responseHit2 = await request(application).post('/api/v1/character/damage').send({ name: 'briv', type: 'piercing', amount: 3 });
        expect(responseHit2.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25, tempHitPoints: 2 }, after: { hitPoints: 24, tempHitPoints: 0 } } });
    });

    test('does take both temp hp and hp on huge hit', async () => {
        await request(application).post(ENDPOINT).send({ name: 'briv' });

        const response = await request(application).post('/api/v1/character/damage').send({ name: 'briv', type: 'piercing', amount: 100 });
        expect(response.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25, tempHitPoints: 5 }, after: { hitPoints: 0, tempHitPoints: 0 } } });
    });

    test('does not heal temp points', async () => {
        const responseTempHeal = await request(application).post(ENDPOINT).send({ name: 'briv' });
        expect(responseTempHeal.body).toMatchObject({ tempHitPointsChange: { before: { tempHitPoints: 0 }, after: { tempHitPoints: 5 } } });

        const responseDamage = await request(application).post('/api/v1/character/damage').send({ name: 'briv', type: 'piercing', amount: 10 });
        expect(responseDamage.body).toMatchObject({ hitPointChange: { before: { hitPoints: 25, tempHitPoints: 5 }, after: { hitPoints: 20, tempHitPoints: 0 } } });

        const responseHeal = await request(application).post('/api/v1/character/heal').send({ name: 'briv', amount: 10 });
        expect(responseHeal.body).toMatchObject({ hitPointChange: { before: { hitPoints: 20 }, after: { hitPoints: 30 } } });
    });

    test('Validation works', async () => {
        const response = await request(application).post(ENDPOINT).send({});

        expect(response.statusCode).toBe(400);
    });
});

import { test, expect } from "@playwright/test";
import { CocktailClient } from "../clients/cocktailClient";

test.describe('Cocktails API', () => {
    let client: CocktailClient;
    let firstId: number;

    test.beforeEach(async ({request}) => {
        client = new CocktailClient(request);

        const listResponse = await client.getAllCocktails();
        const listBody = await listResponse.json();
        firstId = listBody.data[0].id;
    });

    test('GET /cocktails => should return list of cocktails', async () => {
        const listResponse = await client.getAllCocktails();
        expect(listResponse.status()).toBe(200);

        const listBody = await listResponse.json();
        console.log('Full list body:', listBody);

        expect(Array.isArray(listBody.data)).toBeTruthy();
        expect(listBody.data.length).toBeGreaterThan(0);
        expect(listBody.data[0]).toHaveProperty('id');
        expect(listBody.data[0]).toHaveProperty('name');
    });

    test('GET /cocktails/{id} => should return single cocktail', async() => {
        const singleResponse = await client.getCocktailById(firstId);
        expect(singleResponse.status()).toBe(200);

        const singleBody = await singleResponse.json();
        console.log('Single cocktail body:', singleBody);

        expect(singleBody.id).toBe(firstId);
        expect(singleBody).toHaveProperty('name');
    });

    test('GET /cocktails/{invalid_id}', async() => {
        const invalidId = 999999;
        const response = await client.getCocktailById(invalidId);

        expect(response.status()).toBe(404);
        const body = await response.json();
        console.log("Error body:", body);
        expect(body).toBeTruthy();

        expect(body).toHaveProperty('name');
        expect(body.name).toBe('EntityNotFoundError');

        expect(body).toHaveProperty('statusCode');
        expect(body.statusCode).toBe(404);

        expect(body).toHaveProperty('message');
        expect(body.message).toContain('does not exist');
    })
});


import { APIRequestContext } from "@playwright/test";

export class CocktailClient {
    constructor(private request: APIRequestContext) {}

    async getAllCocktails() {
        return await this.request.get('https://boozeapi.com/api/v1/cocktails');
    }

    async getCocktailById(id: number) {
        return await this.request.get(`https://boozeapi.com/api/v1/cocktails/${id}`);
    }
}
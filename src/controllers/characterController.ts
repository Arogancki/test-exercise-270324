import { Request, Response, NextFunction } from "express";
import { DamageCharacterRequest, GetCharacterRequest, HealCharacterRequest } from "../dto/character";
import { DamageCharacterResponse, GetCharacterResponse, HealCharacterResponse } from "../responses/character";
import CharacterService from "../services/characterService";
import DamageService from "../services/damageService";
import HealService from "../services/healService";

interface ICharacterControllerArgs {
    characterService: CharacterService;
    damageService: DamageService;
    healService: HealService;
}

export default class CharacterController {
    private damageService: DamageService;
    private healService: HealService;
    private characterService: CharacterService;

    constructor({ damageService, characterService, healService }: ICharacterControllerArgs) {
        this.damageService = damageService;
        this.healService = healService;
        this.characterService = characterService;
    }

    public async getCharacter(req: Request & { query: GetCharacterRequest }, res: Response, next: NextFunction) {
        try {
            return res.json(new GetCharacterResponse(await this.characterService.get(req.query)));
        } catch (err) {
            return next(err);
        }
    }

    public async damageCharacter(req: Request & { body: DamageCharacterRequest }, res: Response, next: NextFunction) {
        try {
            return res.json(new DamageCharacterResponse(await this.damageService.damageCharacter(req.body)));
        } catch (err) {
            return next(err);
        }
    }

    public async healCharacter(req: Request & { body: HealCharacterRequest }, res: Response, next: NextFunction) {
        try {
            return res.json(new HealCharacterResponse(await this.healService.healCharacter(req.body)));
        } catch (err) {
            return next(err);
        }
    }
}

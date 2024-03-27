import { Request, Response, NextFunction } from "express";
import { AddTempHpCharacterRequest } from "../dto/character";
import { AddTempHpCharacterResponse } from "../responses/character";
import TempHpService from "../services/tempHpService";

interface ITempHpControllerArgs {
    tempHpService: TempHpService
}

export default class TempHpController {
    private tempHpService: TempHpService;

    constructor({ tempHpService }: ITempHpControllerArgs) {
        this.tempHpService = tempHpService;
    }

    public async addTempHp(req: Request & { body: AddTempHpCharacterRequest }, res: Response, next: NextFunction) {
        try {
            return res.json(new AddTempHpCharacterResponse(await this.tempHpService.addTempHp(req.body)));
        } catch (err) {
            return next(err);
        }
    }
}

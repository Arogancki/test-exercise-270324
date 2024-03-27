import { Router } from "express";
import TempHpController from '../controllers/tempHpController';
import { IValidator } from "../utils/helpers/validator";
import { HealCharacterRequest } from "../dto/character";

interface ITemphpRouterArgs {
    tempHpController: TempHpController;
    validator: IValidator;
}

export default function createTemphpRouter({ validator, tempHpController }: ITemphpRouterArgs) {
    const router = Router();

    router.post("/add", validator.body(HealCharacterRequest), tempHpController.addTempHp.bind(tempHpController));

    return router;
}

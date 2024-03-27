import { Router } from "express";
import { DamageCharacterRequest, HealCharacterRequest } from "../dto/character";
import { IValidator } from "../utils/helpers/validator";
import CharacterController from "../controllers/characterController";

interface ICharacterRouterArgs {
    characterController: CharacterController;
    validator: IValidator;
    temphpRouter: Router;
}

export default function createCharacterRouter({ validator, characterController, temphpRouter }: ICharacterRouterArgs) {
    const router = Router();

    router.get("/", characterController.damageCharacter.bind(characterController));
    router.post("/heal", validator.body(HealCharacterRequest), characterController.healCharacter.bind(characterController));
    router.post("/damage", validator.body(DamageCharacterRequest), characterController.damageCharacter.bind(characterController));

    router.use('/temphp', temphpRouter)

    return router;
}

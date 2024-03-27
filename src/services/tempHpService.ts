import CharacterService from "./characterService";
import DiceService from "./diceService";
import boom from "boom";
import { Character } from "../utils/ecs/character";
import Lock from '../utils/helpers/lock'
import { AddTempHpCharacterRequest } from "../dto/character";

interface ITempHpServiceArgs {
    characterService: CharacterService;
    diceService: DiceService;
    lock: Lock;
}

export default class TempHpService {
    private characterService: CharacterService;
    private diceService: DiceService;
    private lock: Lock;

    constructor({ characterService, diceService, lock }: ITempHpServiceArgs) {
        this.diceService = diceService;
        this.characterService = characterService;
        this.lock = lock;
    }

    async addTempHp({ name, amount }: AddTempHpCharacterRequest) {
        return this.lock.withKey(`lock-character-${name}`, async () => {
            const characterData = await this.characterService.get({ name });
            if (!characterData) {
                throw boom.notFound();
            }

            const character = new Character(characterData);
            const result = character.addTempHitPoints(amount || this.diceService.doRoll(20));

            await this.characterService.update(character);

            return result;
        })
    }
}

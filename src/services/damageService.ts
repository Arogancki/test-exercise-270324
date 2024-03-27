import CharacterService from "./characterService";
import DiceService from "./diceService";
import boom from "boom";
import { Character } from "../utils/ecs/character";
import { Damage } from "../utils/ecs/damage";
import DamageType from "../utils/enums/damageType";
import Lock from '../utils/helpers/lock'
import { DamageCharacterRequest } from "../dto/character";

interface IDamageServiceArgs {
    characterService: CharacterService;
    diceService: DiceService;
    lock: Lock;
}

export default class DamageService {
    private characterService: CharacterService;
    private diceService: DiceService;
    private lock: Lock;

    constructor({ characterService, diceService, lock }: IDamageServiceArgs) {
        this.diceService = diceService;
        this.characterService = characterService;
        this.lock = lock;
    }

    async damageCharacter({ name, type, amount }: DamageCharacterRequest) {
        return this.lock.withKey(`lock-character-${name}`, async () => {
            const characterData = await this.characterService.get({ name });
            if (!characterData) {
                throw boom.notFound();
            }

            const character = new Character(characterData);
            const damage = new Damage(amount || this.diceService.doRoll(20), type);
            const result = damage.apply(character);

            await this.characterService.update(character);

            return result;
        })
    }
}

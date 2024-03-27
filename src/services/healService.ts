import CharacterService from "./characterService";
import DiceService from "./diceService";
import boom from "boom";
import { Character } from "../utils/ecs/character";
import Lock from '../utils/helpers/lock'
import { HealCharacterRequest } from "../dto/character";
import { Heal } from "../utils/ecs/heal";

interface IHealServiceArgs {
    characterService: CharacterService;
    diceService: DiceService;
    lock: Lock;
}

export default class HealService {
    private characterService: CharacterService;
    private diceService: DiceService;
    private lock: Lock;

    constructor({ characterService, diceService, lock }: IHealServiceArgs) {
        this.diceService = diceService;
        this.characterService = characterService;
        this.lock = lock;
    }

    async healCharacter({ name, amount }: HealCharacterRequest) {
        return this.lock.withKey(`lock-character-${name}`, async () => {
            const characterData = await this.characterService.get({ name });
            if (!characterData) {
                throw boom.notFound();
            }

            const character = new Character(characterData);
            const heal = new Heal(amount || this.diceService.doRoll(20));
            const result = heal.apply(character);

            await this.characterService.update(character);

            return result;
        })
    }
}

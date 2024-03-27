import CharacterRepository from "../repositories/characterRepository";
import { Character } from "../utils/ecs/character";

interface ICharacterServiceArgs {
    characterRepository: CharacterRepository;
}

export default class CharacterService {
    private characterRepository: CharacterRepository;

    constructor({ characterRepository }: ICharacterServiceArgs) {
        this.characterRepository = characterRepository;
    }

    get({ name }: { name: string }) {
        return this.characterRepository.get(name);
    }

    update(character: Character) {
        return this.characterRepository.upsert(character.getKey(), character.getData());
    }
}

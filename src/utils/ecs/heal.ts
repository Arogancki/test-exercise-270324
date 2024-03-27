import { Character } from "./character";

export class Heal {
    healPoints: number;

    constructor(healPoints: number) {
        this.healPoints = healPoints;
    }

    apply(character: Character) {
        return character.changeHitPoints(this.healPoints)
    }
}

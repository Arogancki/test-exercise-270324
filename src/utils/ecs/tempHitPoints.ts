import { Character } from "./character";

export class Heal {
    healPoints: number;

    constructor(healPoints: number) {
        this.healPoints = healPoints;
    }

    apply(character: Character) {
        character.addTempHitPoints(this.healPoints);
    }
}

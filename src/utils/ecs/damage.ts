import { Character } from "./character";
import DamageType from "../enums/damageType";

export class Damage {
    damage: number;
    type: DamageType;

    constructor(damage: number, type: DamageType) {
        this.damage = damage;
        this.type = type;
    }

    apply(character: Character) {
        if (character.isImmune(this.type)) {
            return character.changeHitPoints(0)
        }

        if (character.isResistant(this.type)) {
            return character.changeHitPoints(-Math.floor(this.damage / 2))
        }

        return character.changeHitPoints(-this.damage)
    }
}

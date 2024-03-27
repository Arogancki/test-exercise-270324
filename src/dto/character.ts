import * as jf from "joiful";
import Validatable from "../utils/classes/validatable";
import DamageType from "../utils/enums/damageType";

const characterName = jf.string().min(1).max(100).lowercase().required();
const positiveNumber = jf.number().min(1).max(500);

export class GetCharacterRequest extends Validatable {
    @(characterName)
    name!: string;
}

export class DamageCharacterRequest extends Validatable {
    @(characterName)
    name!: string;

    @(jf.string().valid(Object.values(DamageType)).required())
    type!: DamageType;

    @(positiveNumber.optional())
    amount?: number;
}

export class HealCharacterRequest extends Validatable {
    @(characterName)
    name!: string;

    @(positiveNumber.optional())
    amount?: number;
}

export class AddTempHpCharacterRequest extends Validatable {
    @(characterName)
    name!: string;

    @(positiveNumber.optional())
    amount?: number;
}

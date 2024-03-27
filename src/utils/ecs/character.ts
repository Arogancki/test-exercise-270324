import { JSONObject } from "../../types/JSONObject";
import DamageType from "../enums/damageType";
import DefenseType from "../enums/defenseType";

export class Character {
    // using any is an anty-pattern
    // should be splitted into different components
    private entity: any;

    constructor(jsonData: JSONObject) {
        // this could be validated or splitted into
        // different components
        // but for simplicity ill keep it as it is
        this.entity = jsonData;
    }

    getKey() {
        // this should not be used as id
        // because there can be multiple characters
        // with the same name
        return this.entity.name.toLowerCase();
    }

    getData() {
        return this.entity;
    }

    isImmune(damageType: DamageType) {
        return this.entity?.defenses?.find?.((d: any) => d?.defense === DefenseType.Immunity && d?.type === damageType) || false;
    }

    isResistant(damageType: DamageType) {
        return this.entity?.defenses?.find?.((d: any) => d?.defense === DefenseType.Resistance && d?.type === damageType) || false;
    }

    addTempHitPoints(change: number) {
        this.entity.tempHitPoints = this.entity.tempHitPoints || 0;
        const before = { tempHitPoints: this.entity.tempHitPoints };

        if (this.isAlive()) {
            this.entity.tempHitPoints += change;
        }

        return {
            before,
            after: {
                tempHitPoints: this.entity.tempHitPoints,
            }
        }
    }

    isAlive() {
        return !!(this.entity.hitPoints > 0);
    }

    changeHitPoints(change: number) {
        const before = { hitPoints: this.entity.hitPoints } as { hitPoints: number, tempHitPoints?: number };
        const after = { hitPoints: this.entity.hitPoints } as { hitPoints: number, tempHitPoints?: number };

        if (this.isAlive()) {
            if (this.entity?.tempHitPoints && change < 0) {
                before.tempHitPoints = this.entity.tempHitPoints;
                this.entity.tempHitPoints += change;
                change -= change;

                if (this.entity.tempHitPoints < 0) {
                    change += this.entity.tempHitPoints;
                    this.entity.tempHitPoints = 0;
                }
                after.tempHitPoints = this.entity.tempHitPoints;
            }

            this.entity.hitPoints = Math.max(this.entity.hitPoints + change, 0);
            after.hitPoints = this.entity.hitPoints;
        }

        return {
            before,
            after,
        }
    }
}

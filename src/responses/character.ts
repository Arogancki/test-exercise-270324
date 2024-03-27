type HitPoints = {
    hitPoints: number;
    tempHitPoints?: number | undefined;
}

type HitPointChange = {
    after: HitPoints;
    before: HitPoints;
}

export class HealCharacterResponse {
    private hitPointChange: HitPointChange;
    constructor(hitPointChange: any) {
        this.hitPointChange = hitPointChange;
    }
}

export class DamageCharacterResponse {
    private hitPointChange: HitPointChange;
    constructor(hitPointChange: any) {
        this.hitPointChange = hitPointChange;
    }
}

export class GetCharacterResponse {
    private character: any;
    constructor(character: any) {
        this.character = character;
    }
}

export class AddTempHpCharacterResponse {
    private tempHitPointsChange: HitPointChange;
    constructor(tempHitPointsChange: any) {
        this.tempHitPointsChange = tempHitPointsChange;
    }
}

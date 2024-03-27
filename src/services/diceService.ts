export default class DamageService {
    doRoll(sides: number) {
        return Math.floor(Math.random() * sides) + 1;
    }
}

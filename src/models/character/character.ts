import { AbilityScores, CharacterEvents, CharacterState } from './types';

export class Character {
    static MAX_LEVEL = 12;

    state: CharacterState = CharacterState.CHOOSE_CLASS;
    name: string = 'Tav';
    levels: string[] = [];
    race?: string;
    baseAbilityScores?: AbilityScores;

    clone(): Character {
        return Object.assign(new Character(), this);
    }

    onEvent(event: CharacterEvents, value: any): Character {
        if (event === CharacterEvents.ADD_LEVEL) {
            return this.addClass(value);
        }

        if (event === CharacterEvents.SET_RACE) {
            return this.setRace(value);
        }

        if (event === CharacterEvents.SET_ABILITY_SCORES) {
            return this.setAbilityScores(value);
        }

        throw new Error('Invalid character event');
    }

    addClass(className: string): Character {
        if (this.levels.length >= Character.MAX_LEVEL) {
            throw new Error('Cannot exceed level 12');
        }

        const c = this.clone();

        if (c.state === CharacterState.CHOOSE_CLASS) {
            c.state = CharacterState.CHOOSE_RACE;
        }

        c.levels.push(className);

        return c;
    }

    setRace(raceName: string): Character {
        const c = this.clone();

        if (c.state === CharacterState.CHOOSE_RACE) {
            c.state = CharacterState.CHOOSE_ABILITY_SCORES;
        }

        c.race = raceName;

        return c;
    }

    racialAbilityBonuses?: (keyof AbilityScores)[];

    setAbilityScores(values: {
        abilityScores: AbilityScores;
        bonusTwo: keyof AbilityScores;
        bonusOne: keyof AbilityScores;
    }): Character {
        this.baseAbilityScores = values.abilityScores;
        this.racialAbilityBonuses = [values.bonusTwo, values.bonusOne];

        // set next state
        // TODO: does this still rerender twice?

        return this.clone();
    }
}

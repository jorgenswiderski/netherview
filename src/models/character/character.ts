import { BackgroundInfo, RaceInfo } from '../../api/weave/types';
import { ICharacterFeatureCustomizationOption } from '../../components/character-planner/choice-picker/types';
import { AbilityScores, CharacterEvents, CharacterState } from './types';

export class Character {
    static MAX_LEVEL = 12;

    state: CharacterState = CharacterState.CHOOSE_RACE;
    name: string = 'Tav';
    levels: string[] = [];
    race?: RaceInfo;
    subrace?: ICharacterFeatureCustomizationOption;
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

        if (event === CharacterEvents.SET_BACKGROUND) {
            return this.setBackground(value);
        }

        throw new Error('Invalid character event');
    }

    addClass(className: string): Character {
        if (this.levels.length >= Character.MAX_LEVEL) {
            throw new Error('Cannot exceed level 12');
        }

        const c = this.clone();

        if (c.state === CharacterState.CHOOSE_CLASS) {
            c.state = CharacterState.CHOOSE_BACKGROUND;
        }

        c.levels.push(className);

        return c;
    }

    setRace({
        race,
        subrace,
    }: {
        race: RaceInfo;
        subrace?: ICharacterFeatureCustomizationOption;
    }): Character {
        const c = this.clone();

        c.state = CharacterState.CHOOSE_CLASS;
        c.race = race;
        c.subrace = subrace;

        return c;
    }

    background?: BackgroundInfo;

    setBackground(background: BackgroundInfo) {
        this.background = background;
        this.state = CharacterState.CHOOSE_ABILITY_SCORES;

        return this.clone();
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

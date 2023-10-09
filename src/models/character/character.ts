import { BackgroundInfo } from '../../api/weave/types';
import { ICharacterFeatureCustomizationOption } from '../../components/character-planner/feature-picker/types';
import { CharacterDecision } from './character-states';
import { AbilityScores, CharacterEvents } from './types';

export class Character {
    static MAX_LEVEL = 12;

    decisionQueue: CharacterDecision[] = [
        CharacterEvents.SET_RACE,
        CharacterEvents.SET_CLASS,
        CharacterEvents.SET_BACKGROUND,
        CharacterEvents.SET_ABILITY_SCORES,
    ].map((cd) => ({
        type: cd,
    }));

    name: string = 'Tav';

    nextDecision(): CharacterDecision | null {
        return this.decisionQueue[0] || null;
    }

    completeDecision(decision: CharacterEvents) {
        const index = this.decisionQueue.findIndex(
            (value) => value.type === decision,
        );

        if (index > -1) {
            this.decisionQueue.splice(index, 1);
        }
    }

    // In the onEvent method, complete the respective decision after processing.
    onEvent(event: CharacterEvents, value: any): Character {
        this.completeDecision(event);

        if (event === CharacterEvents.SET_CLASS) {
            this.addClass(value);
        } else if (event === CharacterEvents.SET_RACE) {
            this.setRace(value);
        } else if (event === CharacterEvents.SET_SUBRACE) {
            this.setSubrace(value);
        } else if (event === CharacterEvents.SET_ABILITY_SCORES) {
            this.setAbilityScores(value);
        } else if (event === CharacterEvents.SET_BACKGROUND) {
            this.setBackground(value);
        } else {
            throw new Error('Invalid character event');
        }

        return this.clone();
    }

    clone(): Character {
        return Object.assign(new Character(), this);
    }

    levels: string[] = [];

    addClass(className: string): void {
        if (this.levels.length >= Character.MAX_LEVEL) {
            throw new Error('Cannot exceed level 12');
        }

        this.levels.push(className);
    }

    race?: ICharacterFeatureCustomizationOption;

    setRace(race: ICharacterFeatureCustomizationOption): void {
        this.race = race;

        if (race.choices?.[0].length) {
            this.decisionQueue.unshift({
                type: CharacterEvents.SET_SUBRACE,
                choices: race.choices,
            });
        }
    }

    subrace?: ICharacterFeatureCustomizationOption;

    setSubrace(subrace: ICharacterFeatureCustomizationOption): void {
        this.subrace = subrace;
    }

    background?: BackgroundInfo;

    setBackground(background: BackgroundInfo): void {
        this.background = background;
    }

    baseAbilityScores?: AbilityScores;
    racialAbilityBonuses?: (keyof AbilityScores)[];

    setAbilityScores(values: {
        abilityScores: AbilityScores;
        bonusTwo: keyof AbilityScores;
        bonusOne: keyof AbilityScores;
    }): void {
        this.baseAbilityScores = values.abilityScores;
        this.racialAbilityBonuses = [values.bonusTwo, values.bonusOne];
    }
}

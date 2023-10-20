import { ICharacterOption } from 'planner-types/src/types/character-feature-customization-option';
import { ISpell } from 'planner-types/src/types/spells';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import { CharacterClassProgression } from '../../api/weave/types';
import { CharacterTreeDecision } from './character-tree-node/character-tree';

export interface AbilityScores {
    Strength: number;
    Dexterity: number;
    Constitution: number;
    Intelligence: number;
    Wisdom: number;
    Charisma: number;
}

export interface CharacterRaceOption extends ICharacterOption {}

export interface CharacterClassOption extends ICharacterOption {
    level: number;
    progression: CharacterClassProgression;
}

export interface CharacterBackgroundOption extends ICharacterOption {}

export interface ICharacter {
    clone(): ICharacter;
    classData: CharacterClassOption[];
    spellData: ISpell[];
    getTotalAbilityScores(): AbilityScores | null;
    getClassInfo(): CharacterClassInfo[];
}

export interface CharacterClassLevelInfo {
    node: CharacterTreeDecision;
    totalEffects: GrantableEffect[]; // excludes effects for subsequent levels
}

export interface CharacterClassInfo {
    levels: CharacterClassLevelInfo[];
    class: CharacterClassOption;
    subclass?: CharacterTreeDecision;
}

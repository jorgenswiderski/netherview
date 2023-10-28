import { ICharacterOption } from 'planner-types/src/types/character-feature-customization-option';
import { ISpell } from 'planner-types/src/types/action';
import { GrantableEffect } from 'planner-types/src/types/grantable-effect';
import {
    EquipmentSlot,
    IEquipmentItem,
} from 'planner-types/src/types/equipment-item';
import { CharacterClassProgression } from '../../api/weave/types';
import { CharacterTreeDecision } from './character-tree-node/character-tree';
import { CharacterEquipment } from '../items/types';

// FIXME: Convert to enum instead of string labels
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

export interface CharacterBackgroundOption extends ICharacterOption {
    id: number;
}

export interface ICharacter {
    clone(): ICharacter;
    baseClassData: CharacterClassOption[];
    spellData: ISpell[];
    getTotalAbilityScores(): AbilityScores | null;
    getClassInfo(): CharacterClassInfo[];
    getEquipment(): CharacterEquipment;
    equipItem(slot: EquipmentSlot, item: IEquipmentItem): ICharacter;
    getCurrentClassData(): ICharacterOption[];
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

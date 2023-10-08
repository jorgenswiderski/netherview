export enum CharacterState {
    CHOOSE_CLASS,
    CHOOSE_RACE,
    CHOOSE_BACKGROUND,
    CHOOSE_ABILITY_SCORES,
}

export enum CharacterEvents {
    ADD_LEVEL,
    SET_RACE,
    SET_BACKGROUND,
    SET_ABILITY_SCORES,
}

export interface AbilityScores {
    Strength: number;
    Dexterity: number;
    Constitution: number;
    Intelligence: number;
    Wisdom: number;
    Charisma: number;
}

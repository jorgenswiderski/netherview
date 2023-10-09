export enum CharacterEvents {
    SET_CLASS,
    SET_RACE,
    SET_SUBRACE,
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

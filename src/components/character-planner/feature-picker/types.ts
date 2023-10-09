// enum CharacterFeatureTypes {
//     RACE,
//     SUBRACE,
//     CLASS,
// }

export interface ICharacterFeatureCustomizationOption {
    name: string;
    description?: string;
    choices?: ICharacterFeatureCustomizationOption[][];
    image?: string;
}

export interface CharacterRaceOption
    extends ICharacterFeatureCustomizationOption {}
export interface CharacterClassOption
    extends ICharacterFeatureCustomizationOption {}
export interface CharacterBackgroundOption
    extends ICharacterFeatureCustomizationOption {}

import { CharacterPlannerStep } from 'planner-types/src/types/character-feature-customization-option';

export const CharacterPlannerStepDescriptions: Map<
    CharacterPlannerStep,
    string
> = new Map([
    [CharacterPlannerStep.SET_CLASS, "Choose your character's class."],
    [CharacterPlannerStep.SET_RACE, "Select your character's race."],
    [
        CharacterPlannerStep.SET_BACKGROUND,
        "Determine your character's background.",
    ],
    [
        CharacterPlannerStep.SET_ABILITY_SCORES,
        'Assign ability scores for your character.',
    ],
    [CharacterPlannerStep.LEVEL_UP, 'Level up your character.'],
    [
        CharacterPlannerStep.MULTICLASS,
        'Choose an additional class for your character.',
    ],
    [CharacterPlannerStep.CHOOSE_SUBRACE, 'Pick a subrace for your character.'],
    [
        CharacterPlannerStep.CHOOSE_SUBCLASS,
        'Select a subclass specialization for your character.',
    ],
    [
        CharacterPlannerStep.FEAT,
        'Select a Feat or gain an ability score improvement.',
    ],
]);

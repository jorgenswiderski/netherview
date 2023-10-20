import { CharacterPlannerStep } from 'planner-types/src/types/character-feature-customization-option';

export const CharacterPlannerStepDescriptions: Map<
    CharacterPlannerStep,
    string
> = new Map([
    [CharacterPlannerStep.PRIMARY_CLASS, "Choose your character's class."],
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
        CharacterPlannerStep.SECONDARY_CLASS,
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
    [
        CharacterPlannerStep.FEAT_SUBCHOICE,
        'Additional feat customization options.',
    ],
    [CharacterPlannerStep.FEAT_ABILITY_SCORES, 'Increase an ability score.'],
    [
        CharacterPlannerStep.LEARN_CANTRIPS,
        'Choose additional cantrips to learn.',
    ],
    [CharacterPlannerStep.LEARN_SPELLS, 'Choose additional spells to learn.'],
]);

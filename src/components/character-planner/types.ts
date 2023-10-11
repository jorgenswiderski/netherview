import { CharacterPlannerStep } from 'planner-types/src/types/character-feature-customization-option';

export interface CharacterWidgetProps {
    onEvent: (event: CharacterPlannerStep, value: any) => void;
}

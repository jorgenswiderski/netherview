import { CharacterEvents } from 'planner-types/src/types/character-feature-customization-option';

export interface CharacterWidgetProps {
    onEvent: (event: CharacterEvents, value: any) => void;
}

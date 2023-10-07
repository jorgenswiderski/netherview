import { CharacterEvents } from '../../models/character/types';

export interface CharacterWidgetProps {
    onEvent: (event: CharacterEvents, value: any) => void;
}

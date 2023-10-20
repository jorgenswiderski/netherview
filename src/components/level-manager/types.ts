import { CharacterTreeDecision } from '../../models/character/character-tree-node/character-tree';
import {
    CharacterClassInfo,
    CharacterClassLevelInfo,
    CharacterClassOption,
} from '../../models/character/types';

export interface CharacterClassInfoToggled extends CharacterClassInfo {
    levels: (CharacterClassLevelInfo & { disabled: boolean })[];
    class: CharacterClassOption;
    subclass?: CharacterTreeDecision;
}

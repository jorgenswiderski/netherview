import {
    CharacterPlannerStep,
    ICharacterChoice,
    ICharacterOption,
} from 'planner-types/src/types/character-feature-customization-option';
import {
    CharacterDecisionInfo,
    DecisionStateInfo,
    IPendingDecision,
} from '../character-states';
import {
    CharacterTreeDecision,
    CharacterTreeRoot,
} from '../character-tree-node/character-tree';
import { Utils } from '../../utils';

export class PendingDecision implements IPendingDecision {
    public info?: DecisionStateInfo;
    public type: CharacterPlannerStep;
    public options: ICharacterOption[];

    constructor(
        public parent: CharacterTreeDecision | CharacterTreeRoot | null,
        { type, options }: ICharacterChoice,
    ) {
        this.type = type;
        this.options = options;
        this.info = CharacterDecisionInfo[type];

        if (options.length === 0) {
            throw new Error(`Pending decision has no options`);
        }

        this.preloadOptions();
    }

    preloadOptions(): void {
        Utils.preloadOptionImages(this.options);
    }
}

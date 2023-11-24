import {
    CharacterPlannerStep,
    ICharacterChoice,
    ICharacterOption,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import CryptoJS from 'crypto-js';
import {
    characterDecisionInfo,
    DecisionStateInfo,
    IPendingDecision,
} from '../character-states';
import {
    CharacterTreeDecision,
    CharacterTreeRoot,
} from '../character-tree-node/character-tree';
import { Utils } from '../../utils';

export class PendingDecision implements IPendingDecision, ICharacterChoice {
    public info?: DecisionStateInfo;
    public type: CharacterPlannerStep;
    public options: ICharacterOption[];
    public count: number;
    public forcedOptions?: ICharacterOption[];
    public id: string;

    constructor(
        public parent: CharacterTreeDecision | CharacterTreeRoot | null,
        { type, options, count, forcedOptions }: ICharacterChoice,
        allowOptionless: boolean = false,
    ) {
        this.type = type;
        this.options = options;
        this.count = count ?? 1;
        this.forcedOptions = forcedOptions;
        this.info = characterDecisionInfo[type];

        if (!allowOptionless && options.length === 0) {
            throw new Error(`Pending decision has no options`);
        }

        this.preloadOptions();

        this.id = PendingDecision.generateUuid(
            type,
            parent?.name,
            (parent as any)?.type,
        );
    }

    preloadOptions(): void {
        Utils.preloadOptionImages(this.options);
    }

    // static history: Map<string, Record<string, any>> = new Map();

    static generateUuid(
        type: CharacterPlannerStep,
        parentName: string | undefined,
        parentType: CharacterPlannerStep | undefined,
    ): string {
        const hash = CryptoJS.SHA256(
            JSON.stringify({
                type,
                parentName,
                parentType,
            }),
        ).toString();

        // this.history.set(hash, {
        //     type,
        //     parentName: parent?.name,
        //     parentType: (parent as any)?.type,
        // });

        return hash;
    }
}

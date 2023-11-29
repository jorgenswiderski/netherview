import { ICharacterOption } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { GrantableEffect } from '@jorgenswiderski/tomekeeper-shared/dist/types/grantable-effect';
import { useEffect, useMemo } from 'react';
import {
    CharacterTreeDecision,
    CharacterTreeEffect,
} from '../../../models/character/character-tree-node/character-tree';
import { CharacterTreeNodeType } from '../../../models/character/character-tree-node/types';
import { useCharacter } from '../../../context/character-context/character-context';
import {
    IPendingDecision,
    characterDecisionInfo,
} from '../../../models/character/character-states';
import { Utils } from '../../../models/utils';

export function useFeaturePicker(decision: IPendingDecision) {
    const { options } = decision;
    const { character } = useCharacter();

    const makeOptionKey = (
        option: ICharacterOption | CharacterTreeDecision,
    ): string => {
        let grants: (CharacterTreeEffect | GrantableEffect)[];

        if (option instanceof CharacterTreeDecision) {
            grants = (option.children?.filter(
                (child) => child.nodeType === CharacterTreeNodeType.EFFECT,
            ) ?? []) as CharacterTreeEffect[];
        } else {
            grants = option.grants ?? [];
        }

        return JSON.stringify({
            name: option.name,
            grants: grants.map((child) => (child as any)?.id).filter(Boolean),
        });
    };

    const filteredOptions = useMemo(() => {
        if (characterDecisionInfo[decision.type].allowDuplicates) {
            return options;
        }

        const obtained = new Set<string>();

        const decisions = character.root.findAllNodes(
            (node) => node.nodeType === CharacterTreeNodeType.DECISION,
        ) as CharacterTreeDecision[];

        decisions.forEach((node) => {
            obtained.add(makeOptionKey(node));
        });

        return options.filter((option) => !obtained.has(makeOptionKey(option)));
    }, [options]);

    useEffect(() => {
        Utils.preloadOptionImages(filteredOptions);
    }, [filteredOptions]);

    return { filteredOptions };
}

import {
    StaticReferenceHandle,
    StaticReferenceIdentifier,
    StaticallyReferenceable,
} from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/types';
import { StaticReference } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/static-reference';
import { CharacterPlannerStep } from '@jorgenswiderski/tomekeeper-shared/dist/types/character-feature-customization-option';
import { CharacterTreeDecision, CharacterTreeEffect } from './character-tree';
import { CharacterBackgroundOption } from '../types';
import { WeaveApi } from '../../../api/weave/weave';

let ref: {
    pool: Map<number, CharacterTreeBackground>;
    create: (id: number) => StaticReferenceHandle;
};

export class CharacterTreeBackground
    extends CharacterTreeDecision
    implements StaticallyReferenceable
{
    id: number;

    constructor(public background: CharacterBackgroundOption) {
        const { grants, ...rest } = background;

        const option = {
            type: CharacterPlannerStep.SET_BACKGROUND,
            ...rest,
        };

        const children =
            background.grants && background.grants.length > 0
                ? background.grants.map(
                      (effect) =>
                          new CharacterTreeEffect({
                              image: background.image,
                              ...effect,
                          }),
                  )
                : undefined;

        super(option, null, children);

        this.id = background.id;
        ref.pool.set(this.id, this);
    }

    toJSON(): StaticReferenceHandle {
        return ref.create(this.id);
    }

    static async fromId(id: number): Promise<CharacterTreeBackground> {
        const backgroundData = await WeaveApi.backgrounds.getBackgroundById(id);

        return new CharacterTreeBackground(backgroundData);
    }
}

ref = StaticReference.registerClass(
    CharacterTreeBackground,
    StaticReferenceIdentifier.Background,
);

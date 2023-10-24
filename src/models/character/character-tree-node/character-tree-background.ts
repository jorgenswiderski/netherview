import { CharacterTreeDecision, CharacterTreeEffect } from './character-tree';
import { CharacterBackgroundOption } from '../types';
import {
    StaticReferenceHandle,
    StaticallyReferenceable,
} from '../../compressor/static-reference/types';
import { StaticReference } from '../../compressor/static-reference/static-reference';
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

        super(option, children);

        this.id = background.id;
        ref.pool.set(this.id, this);
    }

    toJSON(): StaticReferenceHandle {
        return ref.create(this.id);
    }

    static async fromId(id: number): Promise<CharacterTreeBackground> {
        const backgroundData = await WeaveApi.getBackgroundById(id);

        return new CharacterTreeBackground(backgroundData);
    }
}

ref = StaticReference.registerClass(CharacterTreeBackground, 'b');

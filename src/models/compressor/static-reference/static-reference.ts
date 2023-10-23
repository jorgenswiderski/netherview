import assert from 'assert';
import {
    StaticReferenceHandle,
    StaticReferenceIdentifier,
    StaticallyReferenceable,
} from './types';

export class StaticReference {
    static classes: Record<
        StaticReferenceIdentifier,
        {
            Class: new (...args: any[]) => any;
            // discriminator?: (value: StaticReferenceHandle) => boolean;
            // parser: (id: number, data: Record<string, any>) => any;
            pool: Map<number, any>;
            fromId: (id: number) => any;
        }
    > = {};

    static registerClass<T extends StaticallyReferenceable>(
        Class: new (...args: any[]) => T,
        identifier: StaticReferenceIdentifier,
    ): {
        pool: Map<number, any>;
        create: (id: number) => StaticReferenceHandle;
    } {
        if (StaticReference.classes[identifier]) {
            throw new Error(
                `Reference conflict between ${StaticReference.classes[identifier].Class.name} and ${Class.name}`,
            );
        }

        assert(typeof (Class as any).fromId === 'function');
        const pool = new Map<number, any>();

        StaticReference.classes[identifier] = {
            Class,
            pool,
            fromId: (Class as any).fromId,
        };

        return {
            pool,
            create: StaticReference.createReferenceFactory(identifier),
        };
    }

    static async parseValue(value: any): Promise<any> {
        if (typeof value !== 'object' || value === null) {
            return value;
        }

        if (typeof value.ref !== 'string') {
            return value;
        }

        const { ref } = value;
        const match = /([a-zA-Z]+)(\d+)/.exec(ref);

        if (!match) {
            throw new Error('malformed ref format');
        }

        const identifier = match[1];
        const id = parseInt(match[2], 10);
        const info = StaticReference.classes[identifier];

        if (info.pool.has(id)) {
            return info.pool.get(id);
        }

        const item = await info.fromId(id);
        info.pool.set(id, item);

        return item;
    }

    static async parseAllValues(obj: any): Promise<any> {
        if (Array.isArray(obj)) {
            return Promise.all(
                obj.map((value) => StaticReference.parseAllValues(value)),
            );
        }

        if (
            typeof obj === 'object' &&
            obj !== null &&
            obj.constructor === Object
        ) {
            if (typeof obj.ref === 'string') {
                return StaticReference.parseValue(obj);
            }

            return Object.fromEntries(
                await Promise.all(
                    Object.entries(obj).map(async ([key, val]) => [
                        key,
                        await StaticReference.parseAllValues(val),
                    ]),
                ),
            );
        }

        return obj;
    }

    static createReferenceFactory =
        (identifier: StaticReferenceIdentifier) => (id: number) => ({
            ref: `${identifier}${id}`,
        });
}

import pako from 'pako';
import baseX from 'base-x';
import { StaticReference } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/static-reference';
import { RecordCompressor } from '@jorgenswiderski/tomekeeper-shared/dist/models/compressable-record/compressable-record';
import { CharacterTreeRoot } from './character/character-tree-node/character-tree';
import { ICharacterTreeRoot } from './character/character-tree-node/types';
import { Utils } from './utils';
import { debug, error } from './logger';
import { CONFIG } from './config';

const BASE64 =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-=';

export const base64 = baseX(BASE64);

type JSONValue = string | number | boolean | null | JSONArray | JSONObject;

interface JSONArray extends Array<JSONValue> {}

interface JSONObject {
    [key: string]: JSONValue;
}

export enum InternOption {
    KEYS = 'keys',
    VALUES = 'values',
}

export class TreeCompressor {
    static calculateCompressionRate(
        originalData: any,
        compressedData: ArrayBuffer,
    ): number {
        const encodedOrig = Buffer.from(JSON.stringify(originalData)).toString(
            'base64',
        );

        const compressedSize = compressedData.byteLength;
        const compressionRate = (1 - compressedSize / encodedOrig.length) * 100;

        return compressionRate;
    }

    static getNumberAsBase64(n: number): string {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt32BE(n);

        return buffer.toString('base64');
    }

    static internStrings(
        data: JSONObject,
        option: InternOption = InternOption.VALUES,
    ): {
        value: JSONObject;
        map: Record<string, string>;
    } {
        const stringCounts = new Map<string, number>();

        function countStrings(objectToCount: JSONValue) {
            if (Array.isArray(objectToCount)) {
                objectToCount.forEach(countStrings);
            } else if (
                typeof objectToCount === 'object' &&
                objectToCount !== null
            ) {
                if (option === InternOption.KEYS) {
                    Object.keys(objectToCount).forEach((key) => {
                        if (typeof key === 'string') {
                            stringCounts.set(
                                key,
                                (stringCounts.get(key) || 0) + 1,
                            );
                        }
                    });
                }

                Object.values(objectToCount).forEach(countStrings);
            } else if (
                option === InternOption.VALUES &&
                typeof objectToCount === 'string'
            ) {
                stringCounts.set(
                    objectToCount,
                    (stringCounts.get(objectToCount) || 0) + 1,
                );
            }
        }

        countStrings(data);

        const sortedStrings = Array.from(stringCounts.entries())
            .filter(
                ([value, count]) =>
                    count * value.length > 7 + value.length + count,
            )
            .sort((a, b) => (b[0].length - 1) * b[1] - (a[0].length - 1) * a[1])
            .map(([str]) => str);

        const stringMap = new Map<string, string>();
        const usedIdentifiers = new Set(sortedStrings);
        let idCount = 0;

        function generateIdentifier() {
            let id = '';

            do {
                id = base64.encode([idCount]);
                idCount += 1;
            } while (usedIdentifiers.has(id));

            usedIdentifiers.add(id);

            return id;
        }

        sortedStrings.forEach((str) => {
            const identifier = generateIdentifier();
            stringMap.set(str, identifier);
        });

        function internStringsInObj(obj: JSONValue): JSONValue {
            if (Array.isArray(obj)) {
                return obj.map(internStringsInObj);
            }

            if (typeof obj === 'object' && obj !== null) {
                const newObj: Record<string, JSONValue> = {};

                // eslint-disable-next-line no-restricted-syntax
                for (const [key, value] of Object.entries(obj)) {
                    const newKey =
                        option === InternOption.KEYS && stringMap.has(key)
                            ? stringMap.get(key)!
                            : key;

                    const newValue = internStringsInObj(value);
                    newObj[newKey] = newValue;
                }

                return newObj;
            }

            if (
                option === InternOption.VALUES &&
                typeof obj === 'string' &&
                stringMap.has(obj)
            ) {
                return stringMap.get(obj)!;
            }

            return obj;
        }

        const internedObj = internStringsInObj(data) as JSONObject;

        return { value: internedObj, map: Object.fromEntries(stringMap) };
    }

    static reverseInternStrings(
        data: JSONObject,
        stringMap: Record<string, string>,
        option: InternOption = InternOption.VALUES,
    ): JSONObject {
        const reverseMap = new Map(
            Object.entries(stringMap).map(([key, value]) => [value, key]),
        );

        function reverseInternInObj(obj: JSONValue): JSONValue {
            if (Array.isArray(obj)) {
                return obj.map(reverseInternInObj);
            }

            if (typeof obj === 'object' && obj !== null) {
                const newObj: Record<string, JSONValue> = {};

                // eslint-disable-next-line no-restricted-syntax
                for (const [key, value] of Object.entries(obj)) {
                    const newKey =
                        option === InternOption.KEYS && reverseMap.has(key)
                            ? reverseMap.get(key)!
                            : key;

                    const newValue = reverseInternInObj(value);
                    newObj[newKey] = newValue;
                }

                return newObj;
            }

            if (
                option === InternOption.VALUES &&
                typeof obj === 'string' &&
                reverseMap.has(obj)
            ) {
                return reverseMap.get(obj)!;
            }

            return obj;
        }

        return reverseInternInObj(data) as JSONObject;
    }

    // static arrayBufferToBase62(buffer: ArrayBuffer): string {
    //     // Convert ArrayBuffer to Buffer for base-x compatibility
    //     const buf = Buffer.from(buffer);

    //     return base62.encode(buf);
    // }

    // static base62ToArrayBuffer(base62String: string): ArrayBuffer {
    //     const buffer = base62.decode(base62String);

    //     // Convert Buffer back to ArrayBuffer
    //     return buffer.buffer.slice(
    //         buffer.byteOffset,
    //         buffer.byteOffset + buffer.byteLength,
    //     );
    // }

    static async deflate(
        data: CharacterTreeRoot,
        validate: boolean = CONFIG.IS_DEV,
    ): Promise<string> {
        const startTime = Date.now();

        // const compressed = await this.compressJson(data);
        const copy = JSON.parse(JSON.stringify(data));

        const internedValues = TreeCompressor.internStrings(
            copy,
            InternOption.VALUES,
        );

        const internedKeys = TreeCompressor.internStrings(
            internedValues.value,
            InternOption.KEYS,
        );

        const interned = {
            o: internedKeys.value,
            v: internedValues.map,
            k: internedKeys.map,
        };

        // log(interned);

        const inputBytes = new TextEncoder().encode(JSON.stringify(interned));
        const compressed = pako.deflate(inputBytes);
        const encoded = Buffer.from(compressed).toString('base64');

        debug(
            `Reduced size of data by ${this.calculateCompressionRate(
                data,
                compressed,
            ).toFixed(2)}%`,
        );

        debug(`Final encoded string length: ${encoded.length}`);
        debug(`Deflation took ${(Date.now() - startTime).toFixed(0)} ms.`);

        if (validate) {
            const inf = await this.inflate(encoded);

            if (!Utils.compareObjects(data, inf)) {
                error(inf);
                throw new Error('Failed validation after deflating data');
            }
        }

        return encoded;
    }

    static async inflate(compressed: string): Promise<ICharacterTreeRoot> {
        const startTime = Date.now();

        const decoded = Buffer.from(compressed, 'base64');
        const inflated = pako.inflate(decoded);
        const decompressed = new TextDecoder().decode(inflated);

        const {
            o: interned,
            v: valueMap,
            k: keyMap,
        } = JSON.parse(decompressed);

        const reversedKeys = TreeCompressor.reverseInternStrings(
            interned,
            keyMap,
            InternOption.KEYS,
        );

        const reversedValues = TreeCompressor.reverseInternStrings(
            reversedKeys,
            valueMap,
            InternOption.VALUES,
        );

        const dereferenced =
            await StaticReference.parseAllValues(reversedValues);

        const decomp = await RecordCompressor.parseAllValues(dereferenced);
        debug(`Inflation took ${(Date.now() - startTime).toFixed(0)} ms.`);

        return decomp as unknown as ICharacterTreeRoot;
    }
}

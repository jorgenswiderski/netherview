import pako from 'pako';
import baseX from 'base-x';
import { StaticReference } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/static-reference';
import { RecordCompressor } from '@jorgenswiderski/tomekeeper-shared/dist/models/compressable-record/compressable-record';
import { InternJson } from '@jorgenswiderski/tomekeeper-shared/dist/models/intern-json/intern-json';
import { CharacterTreeRoot } from './character/character-tree-node/character-tree';
import { ICharacterTreeRoot } from './character/character-tree-node/types';
import { Utils } from './utils';
import { debug, error } from './logger';
import { CONFIG } from './config';

const BASE64 =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-=';

export const base64 = baseX(BASE64);

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
        const interned = InternJson.intern(data as any);
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

            if (!Utils.compareObjects(data, inf, ['parent'])) {
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
        const uninterned = InternJson.reverseIntern(JSON.parse(decompressed));
        const dereferenced = await StaticReference.parseAllValues(uninterned);
        const decomp = await RecordCompressor.parseAllValues(dereferenced);
        debug(`Inflation took ${(Date.now() - startTime).toFixed(0)} ms.`);

        return decomp as unknown as ICharacterTreeRoot;
    }
}

import { SharedUtils } from '@jorgenswiderski/tomekeeper-shared/dist/models/utils';
import assert from 'assert';
import { error } from './logger';
import { CONFIG } from './config';

type Difference = {
    path: string;
    value1: any;
    value2: any;
};

export class Utils extends SharedUtils {
    static textShadow = `text-shadow:
    -1px -1px 0px black,
    1px -1px 0px black,
    -1px 1px 0px black,
    1px 1px 0px black,
    -2px 0px 0px black,
    2px 0px 0px black,
    0px -2px 0px black,
    0px 2px 0px black;`;

    /**
     * Asynchronously fetches and returns the contents of a JSON file.
     *
     * @param filePath - Path to the JSON file, relative to the public directory.
     * @returns Promise resolving to the contents of the JSON file.
     */
    static async fetchJsonFile(filePath: string): Promise<any> {
        const response = await fetch(filePath);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(
                `Failed to fetch ${filePath}: ${response.statusText}`,
            );
        }

        return response.json();
    }

    static isNonEmptyArray(a?: any[] | null): boolean {
        return Array.isArray(a) && a.length > 0;
    }

    // Compare two objects using JSON.stringify, sorting the keys such that a different key order still counts as a valid comparison.
    static compareObjects(obj1: any, obj2: any, ignoredKeys?: string[]) {
        const a = Utils.deepCopyAndRemoveUndefined(obj1);
        const b = Utils.deepCopyAndRemoveUndefined(obj2);
        const diffs = this.deepCompare(a, b, ignoredKeys);

        return diffs.length === 0;
    }

    private static deepCopyAndRemoveUndefined<T>(
        obj: T,
        cache = new Map<any, any>(),
    ): T {
        // Return the cached result if we've seen this object before
        if (cache.has(obj)) {
            return cache.get(obj);
        }

        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            // Cache the partially constructed array
            const arrCopy: any[] = [];
            cache.set(obj, arrCopy);

            const result = obj.map((item) =>
                Utils.deepCopyAndRemoveUndefined(item, cache),
            ) as unknown as T;

            // Update the cached array with fully constructed array
            arrCopy.push(...(result as any));

            return result;
        }

        const newObj: Record<string, any> = {};
        cache.set(obj, newObj); // Cache the partially constructed object

        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined) {
                newObj[key] = Utils.deepCopyAndRemoveUndefined(value, cache);
            }
        }

        return newObj as T;
    }

    private static deepCompare(
        obj1: any,
        obj2: any,
        ignoredKeys?: string[],
        path: string = '',
    ): Difference[] {
        let differences: Difference[] = [];

        const keys1 = new Set(Object.keys(obj1));
        const keys2 = new Set(Object.keys(obj2));

        const allKeys = new Set([...keys1, ...keys2]);

        allKeys.forEach((key) => {
            if (ignoredKeys?.includes(key)) {
                return;
            }

            const newPath = path ? `${path}.${key}` : key;

            // eslint-disable-next-line no-prototype-builtins
            if (!obj1.hasOwnProperty(key)) {
                differences.push({
                    path: newPath,
                    value1: undefined,
                    value2: obj2[key],
                });
                // eslint-disable-next-line no-prototype-builtins
            } else if (!obj2.hasOwnProperty(key)) {
                differences.push({
                    path: newPath,
                    value1: obj1[key],
                    value2: undefined,
                });
            } else if (
                typeof obj1[key] === 'object' &&
                typeof obj2[key] === 'object' &&
                obj1[key] !== null &&
                obj2[key] !== null
            ) {
                differences = differences.concat(
                    this.deepCompare(
                        obj1[key],
                        obj2[key],
                        ignoredKeys,
                        newPath,
                    ),
                );
            } else if (obj1[key] !== obj2[key]) {
                differences.push({
                    path: newPath,
                    value1: obj1[key],
                    value2: obj2[key],
                });
            }
        });

        return differences;
    }

    static toProperCase(str: string): string {
        return str.replace(/\w\S*/g, function properCase(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    static safeAssert(statement: unknown, message?: string | Error) {
        try {
            assert(statement, message);
        } catch (err) {
            if (CONFIG.IS_DEV) {
                throw err;
            }

            error(err);
        }
    }
}

export const { safeAssert } = Utils;

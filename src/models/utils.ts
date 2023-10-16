import { ICharacterOption } from 'planner-types/src/types/character-feature-customization-option';

export class Utils {
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

    static preloadImages(
        input: string | string[] | Record<string, string>,
    ): void {
        const load = (url: string) => {
            const img = new Image();
            img.src = url;
        };

        if (typeof input === 'string') {
            load(input);
        } else if (Array.isArray(input)) {
            input.forEach(load);
        } else {
            Object.values(input).forEach(load);
        }
    }

    static preloadOptionImages(options?: ICharacterOption[]): void {
        if (!options) {
            return;
        }

        const imagesToPreload = options
            .flatMap((option) => [
                option.image,
                ...(option.grants ? option.grants.map((fx) => fx.image) : []),
            ])
            .filter(Boolean) as string[]; // Filters out null or undefined values

        Utils.preloadImages(imagesToPreload);
    }

    static isNonEmptyArray(a?: any[] | null): boolean {
        return Array.isArray(a) && a.length > 0;
    }
}

/**
 * Asynchronously fetches and returns the contents of a JSON file.
 *
 * @param filePath - Path to the JSON file, relative to the public directory.
 * @returns Promise resolving to the contents of the JSON file.
 */
export async function fetchJsonFile(filePath: string): Promise<any> {
    const response = await fetch(filePath);

    // Check if the request was successful
    if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
    }

    return response.json();
}

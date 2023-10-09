export interface BackgroundInfo {
    name: string;
    description: string;
    skills: string[];
    image: string;
}

export type BackgroundsInfo = { [key: string]: BackgroundInfo };

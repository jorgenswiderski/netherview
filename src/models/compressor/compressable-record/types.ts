export interface CompressableRecord {
    toJSON: () => CompressableRecordHandle;
}

export type CompressableRecordIdentifier = number;

export type CompressableRecordHandle = any[];

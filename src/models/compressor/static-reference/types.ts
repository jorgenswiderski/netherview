export interface StaticallyReferenceable {
    id: number;
    toJSON: () => StaticReferenceHandle;
}

export type StaticReferenceIdentifier = string;

export interface StaticReferenceHandle {
    ref: StaticReferenceIdentifier;
}

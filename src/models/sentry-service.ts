export class SentryService {
    static enabled = false;

    static enable(): void {
        this.enabled = true;
    }

    static disable(): void {
        this.enabled = false;
    }
}

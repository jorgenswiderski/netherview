export class Character {
    levels: string[] = [];

    static MAX_LEVEL = 12;

    clone(): Character {
        return Object.assign(new Character(), this);
    }

    addClass(className: string): Character {
        if (this.levels.length >= Character.MAX_LEVEL) {
            throw new Error('Cannot exceed level 12');
        }

        const c = this.clone();
        c.levels.push(className);

        return c;
    }
}

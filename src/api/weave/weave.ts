import { WeaveBuilds } from './builds';
import { WeaveActions } from './data/actions';
import { WeaveBackgrounds } from './data/backgrounds';
import { WeaveClasses } from './data/classes';
import { WeaveItems } from './data/items';
import { WeaveRaces } from './data/races';
import { WeaveSpells } from './data/spells';

export class WeaveApi {
    // /data
    static actions = new WeaveActions();
    static backgrounds = new WeaveBackgrounds();
    static classes = new WeaveClasses();
    static items = new WeaveItems();
    static races = new WeaveRaces();
    static spells = new WeaveSpells();

    static builds = new WeaveBuilds();
}

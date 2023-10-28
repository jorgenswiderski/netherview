import { CONFIG } from '../../models/config';
import { WeaveActions } from './data/actions';
import { WeaveBackgrounds } from './data/backgrounds';
import { WeaveClasses } from './data/classes';
import { WeaveItems } from './data/items';
import { WeaveRaces } from './data/races';
import { WeaveSpells } from './data/spells';

export class WeaveApi {
    static actions = new WeaveActions();
    static backgrounds = new WeaveBackgrounds();
    static classes = new WeaveClasses();
    static items = new WeaveItems();
    static races = new WeaveRaces();
    static spells = new WeaveSpells();

    static getImagePath = (imageName: string): string =>
        `${CONFIG.WEAVE.BASE_IMAGE_URL}/${imageName}`;
}

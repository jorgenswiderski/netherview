import { CONFIG } from '../../models/config';
import { WeaveActions } from './actions';
import { WeaveBackgrounds } from './backgrounds';
import { WeaveClasses } from './classes';
import { WeaveItems } from './items';
import { WeaveRaces } from './races';
import { WeaveSpells } from './spells';

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

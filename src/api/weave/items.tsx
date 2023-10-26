import {
    EquipmentSlot,
    IEquipmentItem,
    equipmentSlotTypes,
} from 'planner-types/src/types/equipment-item';
import { WeaveRouteBase } from './weave-route-base';

export class WeaveItems extends WeaveRouteBase {
    constructor() {
        super('/items');
    }

    getEquipmentItemInfo = async (
        slot: EquipmentSlot,
    ): Promise<IEquipmentItem[]> => {
        const types = equipmentSlotTypes[slot];

        const keyed: Record<string, IEquipmentItem[]> = await this.fetchFromApi(
            `/equipment/type?types=${types.join(',')}`,
        );

        return Object.values(keyed).flat();
    };

    getEquipmentItemInfoById = async (id: number): Promise<IEquipmentItem> => {
        const keyed: Record<string, IEquipmentItem> = await this.fetchFromApi(
            `/equipment/id?ids=${id}`,
        );

        return Object.values(keyed)[0];
    };
}

import {
    EquipmentSlot,
    IEquipmentItem,
    IWeaponItem,
    equipmentSlotTypes,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import { EquipmentItem } from './equipment-item';
import { WeaponItem } from './weapon-item';

export class EquipmentItemFactory {
    static isWeapon(item: IEquipmentItem): boolean {
        return [
            ...equipmentSlotTypes[EquipmentSlot.MeleeMainhand],
            ...equipmentSlotTypes[EquipmentSlot.RangedMainhand],
        ].includes(item.type);
    }

    static construct(item: IEquipmentItem) {
        if (EquipmentItemFactory.isWeapon(item)) {
            return new WeaponItem(item as IWeaponItem);
        }

        return new EquipmentItem(item);
    }
}

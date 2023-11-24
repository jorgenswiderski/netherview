import {
    IWeaponItem,
    WeaponCategory,
    WeaponHandedness,
    WeaponRange,
    WeaponRangeType,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import { DamageType } from '@jorgenswiderski/tomekeeper-shared/dist/types/damage';
import { StaticReference } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/static-reference';
import {
    StaticReferenceHandle,
    StaticReferenceIdentifier,
} from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/types';
import { EquipmentItem } from './equipment-item';
import { WeaveApi } from '../../api/weave/weave';

let ref: {
    pool: Map<number, EquipmentItem>;
    create: (id: number) => StaticReferenceHandle;
};

export class WeaponItem extends EquipmentItem implements IWeaponItem {
    category: WeaponCategory;
    rangeType: WeaponRangeType;
    handedness: WeaponHandedness;
    damage: string;
    damageType: DamageType;
    damageVersatile?: string;
    extraDamage?: string;
    extraDamage2?: string;
    range: WeaponRange;
    finesse: boolean;
    heavy: boolean;
    light: boolean;
    reach: boolean;
    thrown: boolean;
    cantDualWield: boolean;
    dippable: boolean;

    isWeapon: true = true;

    constructor(item: IWeaponItem) {
        super(item);

        this.category = item.category;
        this.rangeType = item.rangeType;
        this.handedness = item.handedness;
        this.damage = item.damage;
        this.damageType = item.damageType;
        this.damageVersatile = item.damageVersatile;
        this.extraDamage = item.extraDamage;
        this.extraDamage2 = item.extraDamage2;
        this.range = item.range;
        this.finesse = item.finesse;
        this.heavy = item.heavy;
        this.light = item.light;
        this.reach = item.reach;
        this.thrown = item.thrown;
        this.cantDualWield = item.cantDualWield;
        this.dippable = item.dippable;

        ref.pool.set(this.id, this);
    }

    toJSON(): StaticReferenceHandle {
        return ref.create(this.id);
    }

    static async fromId(id: number): Promise<WeaponItem> {
        const itemData = await WeaveApi.items.getEquipmentItemInfoById(id);

        return new WeaponItem(itemData as IWeaponItem);
    }
}

ref = StaticReference.registerClass(
    WeaponItem,
    StaticReferenceIdentifier.WeaponItem,
);

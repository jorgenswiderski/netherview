import {
    EquipmentSlot,
    IEquipmentItem,
    ItemRarity,
} from '@jorgenswiderski/tomekeeper-shared/dist/types/equipment-item';
import { CharacterTreeDecision } from '../character/character-tree-node/character-tree';

export interface ICharacterTreeEquipmentItem extends CharacterTreeDecision {
    equipmentSlot: EquipmentSlot;
    item: IEquipmentItem;
}

export type CharacterEquipment = Record<
    EquipmentSlot,
    ICharacterTreeEquipmentItem
>;

export const ItemColors = {
    [ItemRarity.NONE]: 'rgb(210, 210, 210)',
    [ItemRarity.common]: 'rgb(210, 210, 210)',
    [ItemRarity.uncommon]: '#01BD39',
    [ItemRarity.rare]: '#01BFFF',
    [ItemRarity['very rare']]: '#D1017B',
    [ItemRarity.legendary]: '#B7861D',
    [ItemRarity.story]: '#FF5901',
};

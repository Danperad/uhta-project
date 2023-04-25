import Consumable from './Сonsumable';

declare type Device = {
    id: number,
    title: string,
    producer: string,
    csss: number,
    nr3: number,
    inOperation: number,
    inStock: number,
    consumables: Consumable[]
}
export default Device;
import Consumable from './Сonsumable';

declare type Material = {
    name: string,
    producer: string,
    kccc: number,
    nr3: number,
    inOperation: number,
    inStock: number,
    materials: Consumable[]
}
export default Material;
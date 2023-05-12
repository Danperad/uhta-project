import Device from "./Device";

declare type Consumable = {
    id: number,
    title: string,
    producer: string,
    csss: number,
    nr3: number,
    unitType: string,
    inOperation: number,
    inStock: number,
    devices: Device[]
}
export default Consumable;

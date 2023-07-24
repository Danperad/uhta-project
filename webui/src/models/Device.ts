import {Binding} from "./index";

declare type Device = {
    id: number | undefined,
    title: string,
    producer: string | undefined,
    csss: number,
    nr3: number,
    unitType: string,
    inOperation: number,
    inStock: number,
    consumables: Binding[]
}
export default Device;
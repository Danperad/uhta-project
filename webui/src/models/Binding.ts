import {Device, Consumable} from "./index";

declare type Binding = {
    id: number | undefined,
    device: Device | undefined,
    consumable: Consumable | undefined,
    count: number
}
export default Binding
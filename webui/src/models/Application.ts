import Consumable from "./Consumable";
import Device from "./Device";

declare type Application = {
    number: number,
    date: Date,
    title: string,
    period: number,
    status: "Новая" | "На согласование" | "Согласована" ,
    consumables: Consumable[],
    devices: Device[]

}
export default Application;
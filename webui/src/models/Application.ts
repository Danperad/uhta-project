import {ApplicationConsumable, ApplicationDevice} from "./index";

declare type Application = {
    number: number | undefined,
    date: number,
    title: string,
    period: number | undefined,
    status: "Новая" | "На согласование" | "Согласована" ,
    consumables: ApplicationConsumable[],
    devices: ApplicationDevice[]

}
export default Application;
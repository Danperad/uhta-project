import Consumable from "./Сonsumable";

declare type Application = {
    number: number,
    date: Date,
    title: string,
    period: number,
    status: "Новая" | "На согласование" | "Согласована" ,
    materials: Consumable[]

}
export default Application;
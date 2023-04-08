import Consumable from "./Сonsumable";

declare type Order = {
    number: number,
    name: string,
    date: Date,
    status: "Новая" | "На согласование" | "Согласована" | undefined,
    materials: Consumable[]

}
export default Order;
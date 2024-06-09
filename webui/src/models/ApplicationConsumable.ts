import Consumable from "./Consumable";

declare type ApplicationConsumable = {
  applicationNumber?: number,
  consumable: Consumable,
  count: number,
  receivedQuantity?: number ,
  receiptDate?: number
}
export default ApplicationConsumable

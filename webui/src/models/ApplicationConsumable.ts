import Consumable from "./Consumable";

declare type ApplicationConsumable = {
  applicationNumber: number | undefined,
  consumable: Consumable,
  count: number,
  receivedQuantity: number,
  receiptDate: number
}
export default ApplicationConsumable

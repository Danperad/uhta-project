import Consumable from "./Consumable";

declare type ApplicationConsumable = {
  applicationNumber: number | undefined,
  consumable: Consumable,
  count: number
}
export default ApplicationConsumable

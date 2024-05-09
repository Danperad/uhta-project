import {Binding} from "./index";

declare type Consumable = {
  id: number | undefined,
  title: string,
  producer: string | undefined,
  csss: number,
  nr3: number,
  unitType: string,
  inOperation: number,
  inStock: number,
  devices: Binding[]
}
export default Consumable;

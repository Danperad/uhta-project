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
  minimalAmount: number,
  replacementFrequency: number,
  devices: Binding[],
}
export default Consumable;

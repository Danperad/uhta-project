import {Binding} from "./index";

declare type Device = {
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
  consumables: Binding[]
}
export default Device;

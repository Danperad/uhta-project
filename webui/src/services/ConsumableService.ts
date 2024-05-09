import axios from "axios";
import Consumable from "../models/Consumable";
import {ConsumableLoaded} from "../redux/actions/consumableAction";

interface LooseObject {
  [key: string]: any
}

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/consumables/`

class ConsumableService {
  async getAllConsumables(search: string | null = null) {
    const params: LooseObject = {}
    params['count'] = 20
    if (search !== null && search !== '') {
      params["search"] = search
    }
    try {
      const res = await axios.get(ApiUrl, {params: params})
      if (res.status % 100 > 3) return undefined
      return ConsumableLoaded(res.data);
    } catch (e) {
      console.log(e);
      return undefined
    }
  }

  async getConsumableByCsss(csss: number) {
    try {
      const res = await axios.get(`${ApiUrl}${csss}`)
      if (res.status % 100 > 3) return undefined
      return res.data as Consumable
    } catch (e) {
      console.log(e);
      return undefined
    }
  }

  async saveConsumable(consumable: Consumable) {
    try {
      const res = await axios.post(ApiUrl, consumable)
      if (res.status % 100 > 3) return undefined
      return res.data as Consumable
    } catch (e) {
      console.log(e);
      return undefined
    }
  }

  async deleteConsumableByCsss(csss: number) {
    const params: LooseObject = {}
    params['csss'] = csss
    try {
      const res = await axios.post(`${ApiUrl}delete`, {}, {params: params})
      if (res.status % 100 > 3) return false
      return res.data as boolean
    } catch (e) {
      console.log(e);
      return undefined
    }
  }
}

export default new ConsumableService();

import axios from "axios";
import Consumable from "../models/Consumable";

interface LooseObject{
    [key: string] : any
}
const ApiUrl = `${import.meta.env.VITE_API_URL}/api/consumables/`

class ConsumableService {
    getAllConsumables(search: string | null = null) {
        const params : LooseObject = {}
        params['count'] = 20
        if(search !== null && search !== '')
        {
            params["search"] = search
        }
        return axios.get(ApiUrl, {params: params}).then(res => {
            return res.data as Consumable[];
        })
    }
    getConsumableByCsss(csss: number) {
        return axios.get(ApiUrl + csss)
            .then((res) => {
                return res.data as Consumable;
            }).catch((error) => {
                console.log(error);
                return null
            });
    }
    saveConsumable(consumable: Consumable){
        return axios.post(ApiUrl, consumable)
            .then((res) => {
                if (res.status % 100 !== 2) return []
                const consumables : Consumable[] = res.data;
                return consumables;
            }).catch((error) => {
                console.log(error);
                return [];
            });
    }
}
export default new ConsumableService();
import axios from "axios";
import Consumable from "../models/Сonsumable";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/consumables/`

class MaterialService {
    getAllMaterials() {
        return axios.get(ApiUrl).then(res => {
            return res.data as Consumable[];
        })
    }
    getMaterialById(id: number) {
        return axios.get(ApiUrl + id)
            .then((res) => {
                return res.data as Consumable;
            })
            .catch((error) => {
                console.log(error);
                return null
            });
    }
}
export default new MaterialService();
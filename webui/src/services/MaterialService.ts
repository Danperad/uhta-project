import axios from "axios";
import Consumable from "../models/Сonsumable";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/consumables/`

class MaterialService {
    getMaterialByNr3(nr3: number) {
        return axios.get(ApiUrl + "bynr?nr3=" + nr3)
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
import axios from "axios";
import Consumable from "../models/Сonsumable";

const ApiUrl = "https://26dd74b6-9bf6-4097-a0e9-701f816e015f.mock.pstmn.io/api/materials/";

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
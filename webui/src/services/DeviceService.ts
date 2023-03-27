import axios from "axios";
import {Material} from "../models";

const ApiUrl = "https://26dd74b6-9bf6-4097-a0e9-701f816e015f.mock.pstmn.io/api/devices/";

class DeviceService {
    getDevices() {
        return axios.get(ApiUrl).then(res => {
            return res.data.devices as Material[];
        })
    }

    getDeviceByNr3(nr3: number){
        return axios.get(ApiUrl + "bynr?nr3=" + nr3 )
            .then((res) => {
                return res.data as Material;
            })
            .catch((error) => {
                console.log(error);
                return null
            });
    }
}

export default new DeviceService();
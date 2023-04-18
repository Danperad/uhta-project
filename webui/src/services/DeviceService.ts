import axios from "axios";
import {Material} from "../models";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/devices/`
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
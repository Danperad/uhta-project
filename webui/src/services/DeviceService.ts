import axios from "axios";
import {Device} from "../models";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/devices/`
class DeviceService {
    getAllDevices() {
        return axios.get(ApiUrl).then(res => {
            return res.data as Device[];
        })
    }

    getDeviceById(id: number){
        return axios.get(ApiUrl + id )
            .then((res) => {
                return res.data as Device;
            })
            .catch((error) => {
                console.log(error);
                return null
            });
    }

}

export default new DeviceService();
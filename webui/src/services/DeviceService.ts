import axios from "axios";
import {Material} from "../models";

const ApiUrl = "https://26dd74b6-9bf6-4097-a0e9-701f816e015f.mock.pstmn.io/api/devices";

class DeviceService {
    getDevices() {
        console.log("ssssss");
        return axios.get(ApiUrl).then(res => {
            console.log(res.data);
            return res.data.devices as Material[];
        })
    }
}

export default new DeviceService();
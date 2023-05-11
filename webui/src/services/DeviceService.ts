import axios from "axios";
import {Device} from "../models";
import {DeviceLoaded} from "../redux/actions/deviceAction";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/devices/`
interface LooseObject{
    [key: string] : any
}
class DeviceService {
    getAllDevices(search: string | null = null) {
        const params : LooseObject = {}
        params['count'] = 20
        if(search !== null && search !== '')
        {
           params["search"] = search
        }
        return axios.get(ApiUrl, {params: params}).then(res => {
            return DeviceLoaded(res.data);
        })
    }

    getDeviceByCsss(csss: number){
        return axios.get(ApiUrl + csss )
            .then((res) => {
                return res.data as Device;
            })
            .catch(error => {
                console.log(error);
                return null
            });
    }

    saveDevice(device: Device){
        return axios.post(ApiUrl, device)
            .then((res) => {
                if (res.status % 100 !== 2) return []
                const devices : Device[] = res.data;
                return devices;
            }).catch((error) => {
                console.log(error);
                return [];
            });
    }
    deleteDeviceByCsss(csss: number){
        const params : LooseObject = {}
        params['csss'] = csss
        return axios.post(`${ApiUrl}delete`, {},{params: params})
            .then((res) => {
                return res.data as boolean
            })
    }

    changeDeviceByCsss(csss: number){
        const params : LooseObject = {}
        params['csss'] = csss
        return axios.post(`${ApiUrl}change`, {},{params: params})
            .then((res) => {
                return res.data as boolean
            })
    }

}

export default new DeviceService();
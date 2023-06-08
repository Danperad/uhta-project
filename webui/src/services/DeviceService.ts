import axios from "axios";
import {Device} from "../models";
import {DeviceLoaded} from "../redux/actions/deviceAction";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/devices/`

interface LooseObject {
    [key: string]: any
}

class DeviceService {
    async getAllDevices(search: string | null = null) {
        const params: LooseObject = {}
        params['count'] = 20
        if (search !== null && search !== '') {
            params["search"] = search
        }
        try {
            const res = await axios.get(ApiUrl, {params: params})
            if (res.status % 100 > 3) return undefined
            return DeviceLoaded(res.data)
        } catch (e) {
            console.log(e);
            return undefined
        }
    }

    async getDeviceByCsss(csss: number) {
        try {
            const res = await axios.get(`${ApiUrl}${csss}`)
            if (res.status % 100 > 3) return undefined
            return res.data as Device
        } catch (e) {
            console.log(e);
            return undefined
        }
    }

    async saveDevice(device: Device) {
        try {
            const res = await axios.post(ApiUrl, device)
            if (res.status % 100 > 3) return undefined
            return res.data as Device;
        } catch (e) {
            console.log(e);
            return undefined
        }
    }

    async deleteDeviceByCsss(csss: number) {
        const params: LooseObject = {}
        params['csss'] = csss
        try {
            const res = await axios.post(`${ApiUrl}delete`, {}, {params: params})
            if (res.status % 100 > 3) return false
            return res.data as boolean;
        } catch (e) {
            console.log(e);
            return false
        }
    }
}

export default new DeviceService();
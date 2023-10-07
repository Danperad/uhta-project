import axios from "axios";
import {Application} from "../models";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/applications/`

interface LooseObject {
    [key: string]: any
}

class ApplicationService {
    async getAllApplications() {
        try {
            const res = await axios.get(ApiUrl)
            if (res.status % 100 > 3) return undefined
            return res.data as Application[];
        } catch (e) {
            console.log(e);
            return undefined
        }
    }
    async getApplicationByNumber(num: number) {
        try {
            const res = await axios.get(`${ApiUrl}${num}`)
            if (res.status % 100 > 3) return undefined
            return res.data as Application;
        } catch (e) {
            console.log(e);
            return undefined
        }
    }
    async addApplication(application: Application) {
        try {
            const res = await axios.post(ApiUrl, application)
            if (res.status % 100 > 3) return undefined
            return res.data as Application
        } catch (e) {
            console.log(e);
            return undefined
        }
    }
    async downloadFile(num: number) {
        try {
            const res = await axios({
                url: `${ApiUrl}get-xlsx?number=${num}`,
                method: "GET", responseType: "blob"
            })
            if (res.status % 100 > 3) return undefined
            return res.data
        } catch (e) {
            console.log(e);
            return undefined
        }
    }
    async archiveApplicationById(id: number) {
        const params: LooseObject = {}
        params['id'] = id
        try {
            const res = await axios.post(`${ApiUrl}archive`, {}, {params: params})
            if (res.status % 100 > 3) return false
            return res.data as boolean;
        } catch (e) {
            console.log(e);
            return false
        }
    }
    async deleteApplicationById(id: number) {
        const params: LooseObject = {}
        params['id'] = id
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

export default new ApplicationService();
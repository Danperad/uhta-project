import axios from "axios";
import {Application} from "../models";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/applications/`

interface LooseObject {
    [key: string]: any
}

class ApplicationService {
    async getAllApplications(
        search: string | null = null,
        inArchive: boolean,
        status: string | null = null,
        dateStart: string | null = null,
        dateEnd: string | null = null
    ) {
        const params: LooseObject = {}
        params['count'] = 20
        params['inArchive'] = inArchive
        if (search !== null && search !== '') {
            params["search"] = search
        }
        if(status !== null){
            params["status"] = status
        }
        if(dateStart !== null){
            params["dateStart"] = dateStart
        }
        if(dateEnd !== null){
            params["dateEnd"] = dateEnd
        }
        try {
            const res = await axios.get(ApiUrl, {params: params})
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
    async unarchiveApplicationById(id: number) {
        const params: LooseObject = {}
        params['id'] = id
        try {
            const res = await axios.post(`${ApiUrl}unarchive`, {}, {params: params})
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
import axios from "axios";
import {Application} from "../models";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/applications/`

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
            const res = await axios.get(`${ApiUrl}/${num}`)
            if (res.status % 100 > 3) return undefined
            return res.data as Application;
        } catch (e) {
            console.log(e);
            return undefined
        }
    }
}

export default new ApplicationService();
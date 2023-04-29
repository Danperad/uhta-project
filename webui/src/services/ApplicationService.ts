import axios from "axios";
import {Applications} from "../models";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/applications`

class ApplicationService {
    getAllApplications() {
        return axios.get(ApiUrl).then(res => {
            return res.data.orders as Applications[];
        })
    }

    getApplicationByNumber(num: number){
        return axios.get(ApiUrl + "/" + num )
            .then((res) => {
                return res.data as Applications;
            })
            .catch((error) => {
                console.log(error);
                return null
            });
    }

}

export default new ApplicationService();
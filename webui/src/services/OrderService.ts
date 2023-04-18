import axios from "axios";
import {Order} from "../models";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/applications/`

class OrderService {
    getOrder() {
        return axios.get(ApiUrl).then(res => {
            return res.data.orders as Order[];
        })
    }

    getOrderByNumber(num: number){
        return axios.get(ApiUrl + "bynum?num=" + num )
            .then((res) => {
                return res.data as Order;
            })
            .catch((error) => {
                console.log(error);
                return null
            });
    }

}

export default new OrderService();
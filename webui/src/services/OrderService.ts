import axios from "axios";
import {Order} from "../models";

const ApiUrl = "https://26dd74b6-9bf6-4097-a0e9-701f816e015f.mock.pstmn.io/api/orders/";

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
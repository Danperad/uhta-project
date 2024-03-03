import axios from "axios";
import {NewUser, User} from "../models";
import {UserLoaded} from "../redux/actions/userAction";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/user/`

interface LooseObject {
    [key: string]: any
}

class UserService{
    async getAllUsers(search: string | null = null) {
        const params: LooseObject = {}
        params['count'] = 20
        if (search !== null && search !== '') {
            params["search"] = search
        }
        try {
            const res = await axios.get(ApiUrl, {params: params})
            if (res.status % 100 > 3) return undefined
            return UserLoaded(res.data)
        } catch (e) {
            console.log(e);
            return undefined
        }
    }

    async getUserByLoginAndPassword(login: string, password: string) {
        try {
            const res = await axios.post(`${ApiUrl}/auth`, {login, password})
            if (res.status % 100 > 3) return undefined
            return res.data as User
        } catch (e) {
            console.log(e);
            return undefined
        }
    }
    async saveUser(user: NewUser) {
        try {
            const res = await axios.post(ApiUrl, user)
            if (res.status % 100 > 3) return undefined
            return res.data as User;
        } catch (e) {
            console.log(e);
            return undefined
        }
    }
    async deleteUserByLogin(login: string) {
        const params: LooseObject = {}
        params['login'] = login
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

export default new UserService();
import axios from "axios";
import {Logs} from "../models";

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/logs/`

interface LooseObject {
  [key: string]: any
}

class LogsService {
  async getAllLogs(
    search: string | null = null,
    status: string | null = null,
    dateStart: string | null = null,
    dateEnd: string | null = null
  ) {
    const params: LooseObject = {}
    params['count'] = 20
    if (search !== null && search !== '') {
      params["search"] = search
    }
    if (status !== null) {
      params["status"] = status
    }
    if (dateStart !== null) {
      params["dateStart"] = dateStart
    }
    if (dateEnd !== null) {
      params["dateEnd"] = dateEnd
    }
    try {
      const res = await axios.get(ApiUrl, {params: params})
      if (res.status % 100 > 3) return undefined
      return res.data as Logs[];
    } catch (e) {
      console.log(e);
      return undefined
    }
  }
  async addLog(log: Logs) {
    try {
      const res = await axios.post(ApiUrl, log)
      if (res.status % 100 > 3) return undefined
      return res.data as Logs
    } catch (e) {
      console.log(e);
      return undefined
    }
  }
}
export default new LogsService();

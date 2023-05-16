import axios from 'axios';

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/files/`

class FileUploadService{
    uploadMaterial(file: File){
        const data = new FormData()
        data.append('file', file)
        return axios.post(`${ApiUrl}upload`, data).then((res)=>
        {
            return res.status % 100 <= 3;
        })
    }
}
export default new FileUploadService();
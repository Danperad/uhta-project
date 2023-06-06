import axios from 'axios';

const ApiUrl = `${import.meta.env.VITE_API_URL}/api/files/`

class FileUploadService{
    async uploadMaterial(file: File) {
        const data = new FormData()
        data.append('file', file)
        try {
            const res = await axios.post(`${ApiUrl}upload`, data)
            return res.status % 100 <= 3;
        } catch (e) {
            console.log(e);
            return false
        }
    }
}
export default new FileUploadService();
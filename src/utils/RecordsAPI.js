import axios from '../../node_modules/_axios@0.18.0@axios';
const api = process.env.REACT_APP_Records_API_URL || "https://5b56f6f688d93a0014b024ab.mockapi.io"
export const getAll=()=>
    axios.get(`${api}/api/v1/records`)
export const create=(body)=>
    axios.post(`${api}/api/v1/records`,body)
export const update=(id,body)=>
    axios.put(`${api}/api/v1/records/${id}`,body)
export const remove=(id)=>
    axios.delete(`${api}/api/v1/records/${id}`)


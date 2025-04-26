import axios from "axios"


export const fetchApi = async (endpoint : string) =>{
    
    try {
       
        const res  = await axios.get(endpoint)
        if(res.status === 200){
            return res.data
        }
    } catch (error) {
        console.log("Error  :",error)
    }
}
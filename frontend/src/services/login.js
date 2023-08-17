import axios from 'axios'

const url = 'http://localhost:8000'

const login = async (credentials) => {
    const response = await axios.post(`${url}/login/`, credentials)
    return response.data
}

export default {
    login
}

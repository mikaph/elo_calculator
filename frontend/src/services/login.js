import axios from 'axios'

const ENV = process.env.NODE_ENV
let url = ''
if (ENV === 'production') {
    url = 'https://elo-calculator.northeurope.cloudapp.azure.com/api'
} else {
    url = 'http://localhost:8080/api'
}

const login = async (credentials) => {
    const response = await axios.post(`${url}/login/`, credentials)
    return response.data
}

const signup = async (credentials) => {
    const response = await axios.post(`${url}/signup/`, credentials)
    return response.data
}

export default {
    login, signup
}

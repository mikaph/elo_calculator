import axios from 'axios'

let token = null

const setToken = (newToken) => {
    token = `bearer ${newToken}`
}

const clearToken = () => {
    token = null
}

const postResult = async (resultObject) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post('/add_result/', resultObject, config)
    return response.data
}

const postSport = async (sportObject) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post('/add_sport/', sportObject, config)
    return response.data
}

export default {
    setToken, clearToken, postResult, postSport
}

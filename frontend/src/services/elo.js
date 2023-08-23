import axios from 'axios'

const ENV = process.env.NODE_ENV
let url = ''
if (ENV === 'production') {
    url = 'https://elo-calculator.northeurope.cloudapp.azure.com/api'
} else {
    url = 'http://localhost:8000/api'
}

let token = null

const setToken = (newToken) => {
    token = `bearer ${newToken}`
}

const clearToken = () => {
    token = null
}

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            clearToken()
            window.localStorage.clear()
        }
        return Promise.reject(error)
    }
)

const postResult = async (resultObject) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post(`${url}/add_result/`, resultObject, config)
    return response.data
}

const deleteResult = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.delete(`${url}/delete_result/${id}`, config)
    return response.data
}

const postSport = async (sportObject) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post(`${url}/add_sport/`, sportObject, config)
    return response.data
}

const getLeaderboard = async (sportName) => {
    const response = await axios.get(`${url}/leaderboard/${sportName}`)
    return response.data
}

const getSports = async () => {
    const response = await axios.get(`${url}/sports`)
    return response.data
}

const getPlayers = async (sportName) => {
    const response = await axios.get(`${url}/players/${sportName}`)
    return response.data
}

const getRecentGames = async (sportName) => {
    const response = await axios.get(`${url}/recent_games/${sportName}`)
    return response.data
}

export default {
    setToken,
    clearToken,
    postResult,
    deleteResult,
    postSport,
    getLeaderboard,
    getSports,
    getPlayers,
    getRecentGames
}

/* eslint-disable no-unused-vars */
import axios from 'axios'

// TODO Create the methods and use this url in them
const url = 'http://localhost:8000'

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

const postSport = async (sportObject) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post(`${url}/add_sport/`, sportObject, config)
    return response.data
}

const getLeaderboard = async (sportName) => {
    console.log('Leaderboard')
}

const getSports = async () => {
    console.log('Sports')
}

const getPlayers = async (sportName) => {
    console.log('Players')
}

const getRecentGames = async (sportName) => {
    console.log('Recent games')
}

export default {
    setToken,
    clearToken,
    postResult,
    postSport,
    getLeaderboard,
    getSports,
    getPlayers,
    getRecentGames
}

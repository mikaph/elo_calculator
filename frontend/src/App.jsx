import React, { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import useMediaQuery from '@mui/material/useMediaQuery'
import createTheme from '@mui/material/styles/createTheme'
import { Route, Routes, Navigate } from 'react-router-dom'
import ButtonAppBar from './components/AppBar'
import Leaderboard from './components/Leaderboard'
import baseTheme from './theme'
import RecentGames from './components/RecentGames'
import eloService from './services/elo'

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    const theme = React.useMemo(() => createTheme({
        ...baseTheme,
        palette: {
            mode: prefersDarkMode ? 'dark' : 'light'
        }
    }), [prefersDarkMode])

    const [playerData, setPlayerData] = useState([])
    const [sport, setSport] = useState('Ping pong')
    const [sportList, setSportList] = useState([])
    const [user, setUser] = useState(null)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedEloCalculatorUser')
        if (loggedUserJSON) {
            const userJson = JSON.parse(loggedUserJSON)
            setUser(userJson)
            eloService.setToken(userJson.token)
        }
    }, [])

    useEffect(() => {
        fetch('/sports').then((res) => {
            res.json().then((d) => {
                const arr = d.sort()
                setSportList(arr)
            })
        })

        const sportString = sport.toLowerCase().split(' ').join('_')
        fetch(`/leaderboard/${sportString}`).then((res) => {
            res.json().then((d) => {
                setPlayerData(d)
            })
        })
    }, [sport])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Grid container direction="column">
                    <Grid item my={2}>
                        <ButtonAppBar
                            sport={sport}
                            sportList={sportList}
                            setSport={setSport}
                            setPlayerData={setPlayerData}
                            user={user}
                            setUser={setUser}
                        />
                    </Grid>
                    <Grid item my={2}>
                        <Routes>
                            <Route path="*" element={<Navigate to="/leaderboard" replace />} />
                            <Route path="/leaderboard" element={<Leaderboard rows={playerData} />} />
                            <Route path="/recent_games" element={<RecentGames sport={sport} />} />
                        </Routes>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}

export default App

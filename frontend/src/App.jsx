import React, { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import useMediaQuery from '@mui/material/useMediaQuery'
import createTheme from '@mui/material/styles/createTheme'
import { Route, Routes, Navigate } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
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
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleEloError = (error) => {
        setUser(null)
        setErrorMessage('Session has expired, please login again')
        console.log(error)
        setErrorSnackbarOpen(true)
    }

    const closeErrorSnackbar = () => {
        setErrorSnackbarOpen(false)
    }

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
                            handleEloError={handleEloError}
                        />
                    </Grid>
                    <Grid item my={2}>
                        <Routes>
                            <Route path="*" element={<Navigate to="/leaderboard" replace />} />
                            <Route path="/leaderboard" element={<Leaderboard sport={sport} playerData={playerData} setPlayerData={setPlayerData} />} />
                            <Route path="/recent_games" element={<RecentGames sport={sport} />} />
                        </Routes>
                    </Grid>
                </Grid>
            </Container>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={errorSnackbarOpen}
                autoHideDuration={6000}
                onClose={closeErrorSnackbar}
                message={errorMessage}
                action={(
                    <IconButton size="small" aria-label="close" color="inherit" onClick={closeErrorSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            />
        </ThemeProvider>
    )
}

export default App

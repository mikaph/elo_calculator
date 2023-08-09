import React, { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import useMediaQuery from '@mui/material/useMediaQuery'
import createTheme from '@mui/material/styles/createTheme'
import ButtonAppBar from './components/AppBar'
import Leaderboard from './components/Leaderboard'
import baseTheme from './theme'

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
    const [sportList, setSportList] = useState(['Ping pong'])

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
                    <Grid item xs={12} my={2}>
                        <ButtonAppBar
                            sport={sport}
                            sportList={sportList}
                            setSport={setSport}
                        />
                    </Grid>
                    <Grid item xs={12} my={2}>
                        <Leaderboard rows={playerData} />
                        {/* Other routes here? Or hide/show? */}
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}

export default App

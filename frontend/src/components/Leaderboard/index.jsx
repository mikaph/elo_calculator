import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LeaderboardTable from './LeaderboardTable'
import eloService from '../../services/elo'

export default function Leaderboard({
    prefersDarkMode, sport, playerData, setPlayerData
}) {
    const navigate = useNavigate()

    useEffect(() => {
        if (sport) {
            eloService.getLeaderboard(sport).then((stats) => {
                setPlayerData(stats)
            }).catch((e) => {
                console.log(e)
            })
            const newPath = `${window.location.pathname}?sport=${sport}`
            navigate(newPath)
        }
    }, [sport])

    const placementGames = playerData.filter((g) => g.winloss.split('-').reduce((a, b) => (!Number.isNaN(a) && !Number.isNaN(b) ? parseInt(a, 10) + parseInt(b, 10) : 'Invalid input')) < 10)
    const actualGames = playerData.filter((g) => g.winloss.split('-').reduce((a, b) => (!Number.isNaN(a) && !Number.isNaN(b) ? parseInt(a, 10) + parseInt(b, 10) : 'Invalid input')) >= 10)

    return (
        <Grid container direction="column">
            <Grid item sx={{ width: '100%' }}>
                <Card>
                    <CardContent>
                        <Typography variant="h7" component="div">
                            Leaderboard
                        </Typography>
                        <LeaderboardTable prefersDarkMode={prefersDarkMode} rows={actualGames} />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item my={2} sx={{ width: '100%' }}>
                <Card>
                    <CardContent>
                        <Typography variant="h7" component="div">
                            Placement games
                        </Typography>
                        <LeaderboardTable prefersDarkMode={prefersDarkMode} rows={placementGames} />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

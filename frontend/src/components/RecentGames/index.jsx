import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import RecentGamesTable from './RecentGamesTable'
import eloService from '../../services/elo'

export default function RecentGames({
    sport, recentGames, setRecentGames, user, handleEloError
}) {
    const navigate = useNavigate()

    React.useEffect(() => {
        if (sport) {
            eloService.getRecentGames(sport).then((games) => {
                setRecentGames(games)
            }).catch((e) => {
                console.log(e)
            })
            const newPath = `${window.location.pathname}?sport=${sport}`
            navigate(newPath)
        }
    }, [sport])

    return (
        <Card>
            <CardContent>
                <Typography variant="h7" component="div">
                    Recent games
                </Typography>
                <RecentGamesTable
                    sport={sport}
                    recentGames={recentGames}
                    setRecentGames={setRecentGames}
                    user={user}
                    handleEloError={handleEloError}
                />
            </CardContent>
        </Card>
    )
}

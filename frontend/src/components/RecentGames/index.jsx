import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import RecentGamesTable from './RecentGamesTable'
import eloService from '../../services/elo'

export default function RecentGames({ sport, recentGames, setRecentGames }) {
    React.useEffect(() => {
        const sportString = sport.toLowerCase().split(' ').join('_')
        eloService.getRecentGames(sportString).then((games) => {
            const sortedGames = games.sort((a, b) => a.time < b.time)
            setRecentGames(sortedGames)
        }).catch((e) => {
            console.log(e)
        })
    }, [sport])

    return (
        <Card>
            <CardContent>
                <RecentGamesTable recentGames={recentGames} />
            </CardContent>
        </Card>
    )
}

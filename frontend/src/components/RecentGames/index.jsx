import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import RecentGamesTable from './RecentGamesTable'
import eloService from '../../services/elo'

export default function RecentGames({ sport }) {
    const [recentGames, setRecentGames] = React.useState([])

    React.useEffect(() => {
        const sportString = sport.toLowerCase().split(' ').join('_')
        eloService.getRecentGames(sportString).then((games) => {
            setRecentGames(games)
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

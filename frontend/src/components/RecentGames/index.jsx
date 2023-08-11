import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import RecentGamesTable from './RecentGamesTable'

export default function RecentGames({ sport }) {
    const [recentGames, setRecentGames] = React.useState([])

    React.useEffect(() => {
        const sportString = sport.toLowerCase().split(' ').join('_')
        fetch(`/recent_games/${sportString}`).then((res) => {
            res.json().then((d) => {
                setRecentGames(d)
            })
        })
    }, [sport])

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <RecentGamesTable recentGames={recentGames} />
            </CardContent>
        </Card>
    )
}

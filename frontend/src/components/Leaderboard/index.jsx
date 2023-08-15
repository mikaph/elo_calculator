import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useEffect } from 'react'
import LeaderboardTable from './LeaderboardTable'

export default function Leaderboard({ sport, playerData, setPlayerData }) {
    useEffect(() => {
        const sportString = sport.toLowerCase().split(' ').join('_')
        fetch(`/leaderboard/${sportString}`).then((res) => {
            res.json().then((d) => {
                setPlayerData(d)
            })
        })
    }, [sport])

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <LeaderboardTable rows={playerData} />
            </CardContent>
        </Card>
    )
}

import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LeaderboardTable from './LeaderboardTable'

export default function Leaderboard({ rows }) {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <LeaderboardTable rows={rows} />
            </CardContent>
        </Card>
    )
}

import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import RecentGamesTable from './RecentGamesTable'

export default function RecentGames() {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <RecentGamesTable />
            </CardContent>
        </Card>
    )
}

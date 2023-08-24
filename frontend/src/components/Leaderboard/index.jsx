import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useEffect } from 'react'
import LeaderboardTable from './LeaderboardTable'
import eloService from '../../services/elo'

export default function Leaderboard({
    prefersDarkMode, sport, playerData, setPlayerData
}) {
    useEffect(() => {
        eloService.getLeaderboard(sport).then((stats) => {
            setPlayerData(stats)
        }).catch((e) => {
            console.log(e)
        })
    }, [sport])

    return (
        <Card>
            <CardContent>
                <LeaderboardTable prefersDarkMode={prefersDarkMode} rows={playerData} />
            </CardContent>
        </Card>
    )
}

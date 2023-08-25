import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
            const newPath = `${location.pathname}?sport=${sport}`
            navigate(newPath)
        }
    }, [sport])

    return (
        <Card>
            <CardContent>
                <LeaderboardTable prefersDarkMode={prefersDarkMode} rows={playerData} />
            </CardContent>
        </Card>
    )
}

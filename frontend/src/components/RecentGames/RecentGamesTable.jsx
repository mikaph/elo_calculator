import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import eloService from '../../services/elo'

export default function RecentGamesTable({
    sport, recentGames, setRecentGames, user, handleEloError
}) {
    if (!recentGames) {
        return null
    }

    const handleDelete = (id) => {
        eloService.deleteResult(id).then(() => {
            eloService.getRecentGames(sport).then((games) => {
                setRecentGames(games)
            }).catch((e) => {
                console.log(e)
            })
        }).catch(() => {
            handleEloError()
        })
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 'max-content' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Winner</TableCell>
                        <TableCell>Loser</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Submitter</TableCell>
                        { user && user.username === 'palisuli' ? <TableCell /> : null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recentGames.sort((a, b) => (b.time - a.time)).map((game) => (
                        <TableRow key={`${game.winner}${game.loser}${game.time}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{game.winner}</TableCell>
                            <TableCell>{game.loser}</TableCell>
                            <TableCell>{game.time}</TableCell>
                            <TableCell>{game.submitter}</TableCell>
                            { user && user.username === 'palisuli' ? <TableCell><Button onClick={() => handleDelete(game.id)} variant="outlined" color="error">Remove</Button></TableCell> : null}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

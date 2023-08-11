import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export default function RecentGamesTable({ recentGames }) {
    if (!recentGames) {
        return null
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Winner</TableCell>
                        <TableCell>Loser</TableCell>
                        <TableCell>Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recentGames.sort((a, b) => (b.time - a.time)).map((game) => (
                        <TableRow key={game.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{game.winner}</TableCell>
                            <TableCell>{game.loser}</TableCell>
                            <TableCell>{game.time}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

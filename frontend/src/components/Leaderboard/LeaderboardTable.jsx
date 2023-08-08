import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export default function LeaderboardTable({ rows }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Elo</TableCell>
                        <TableCell align="right">Win-%</TableCell>
                        <TableCell align="right">Win-Loss</TableCell>
                        <TableCell align="right">Last 10 win-%</TableCell>
                        <TableCell align="right">Last 10 w/l</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.sort((a, b) => (b.elo - a.elo)).map((row) => (
                        <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.elo}</TableCell>
                            <TableCell align="right">{Math.round(100 * (row.wins / (row.wins + row.losses)))}</TableCell>
                            <TableCell align="right">
                                {row.wins}
                                -
                                {row.losses}
                            </TableCell>
                            <TableCell align="right">TBD</TableCell>
                            <TableCell align="right">TBD</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

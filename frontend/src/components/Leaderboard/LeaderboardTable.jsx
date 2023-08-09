import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export default function LeaderboardTable({ rows }) {
    if (!rows) {
        return null
    }

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
                            <TableCell align="right">{row.winpercent}</TableCell>
                            <TableCell align="right">{row.winloss}</TableCell>
                            <TableCell align="right">{row.last10winpercent}</TableCell>
                            <TableCell align="right">{row.last10winloss}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

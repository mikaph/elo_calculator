import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'

export default function LeaderboardTable({ prefersDarkMode, rows }) {
    if (!rows) {
        return null
    }

    const theme = useTheme()
    const bgColor = prefersDarkMode
        ? 'rgba(30,30,30,1)'
        : theme.palette.background.default

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 'max-content' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{
                            position: 'sticky', left: 0, zIndex: 1, background: bgColor
                        }}
                        >
                            Name
                        </TableCell>
                        <TableCell style={{ background: bgColor }} align="right">Elo</TableCell>
                        <TableCell style={{ background: bgColor }} align="right">Win-%</TableCell>
                        <TableCell style={{ background: bgColor }} align="right">Win-Loss</TableCell>
                        <TableCell style={{ background: bgColor }} align="right">Last 10 win-%</TableCell>
                        <TableCell style={{ background: bgColor }} align="right">Last 10 w/l</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.sort((a, b) => (b.elo - a.elo)).map((row) => (
                        <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell
                                component="th"
                                scope="row"
                                style={{
                                    position: 'sticky', left: 0, zIndex: 1, background: bgColor
                                }}
                            >
                                {row.name}
                            </TableCell>
                            <TableCell style={{ background: bgColor }} align="right">{row.elo}</TableCell>
                            <TableCell style={{ background: bgColor }} align="right">{row.winpercent}</TableCell>
                            <TableCell style={{ background: bgColor }} align="right">{row.winloss}</TableCell>
                            <TableCell style={{ background: bgColor }} align="right">{row.last10winpercent}</TableCell>
                            <TableCell style={{ background: bgColor }} align="right">{row.last10winloss}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

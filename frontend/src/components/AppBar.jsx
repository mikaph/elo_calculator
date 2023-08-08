import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import LongMenu from './Menu'

export default function ButtonAppBar({ sport }) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <LongMenu />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align="center">
                        {sport}
                        {' '}
                        statistics
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

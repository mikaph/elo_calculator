import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import LongMenu from './Menu'
import BasicMenu from './SportMenu'

export default function ButtonAppBar({
    sport, sportList, setSport, setPlayerData, setRecentGames, user, setUser, handleEloError
}) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="h6" component="div">
                        Palisuli
                    </Typography>
                    <BasicMenu sport={sport} sportList={sportList} setSport={setSport} />
                    <LongMenu
                        sport={sport}
                        setPlayerData={setPlayerData}
                        setRecentGames={setRecentGames}
                        setSport={setSport}
                        sportList={sportList}
                        user={user}
                        setUser={setUser}
                        handleEloError={handleEloError}
                    />
                </Toolbar>
            </AppBar>
        </Box>
    )
}

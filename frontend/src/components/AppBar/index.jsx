import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import LongMenu from './Menu'
import BasicMenu from './SportMenu'

export default function ButtonAppBar({
    sport, sportList, setSportList, setSport,
    setPlayerData, setRecentGames, user, setUser, handleEloError
}) {
    return (
        <Box>
            <AppBar position="static">
                <Toolbar style={{ justifyContent: 'space-between' }}>
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
                        setSportList={setSportList}
                        user={user}
                        setUser={setUser}
                        handleEloError={handleEloError}
                    />
                </Toolbar>
            </AppBar>
        </Box>
    )
}

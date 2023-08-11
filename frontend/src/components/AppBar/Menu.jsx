import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom'
import AddResultModal from './Modals/AddResultModal'
import AddSportModal from './Modals/AddSportModal'

const ITEM_HEIGHT = 60

export default function LongMenu({
    sport, setPlayerData, setSport, sportList
}) {
    const navigate = useNavigate()

    const [addResultModalOpen, setAddResultModalOpen] = React.useState(false)
    const [addSportModalOpen, setAddSportModalOpen] = React.useState(false)

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (event) => {
        setAnchorEl(null)
        if (event.target.innerText) {
            if (event.target.innerText === 'Add result') {
                setAddResultModalOpen(true)
            } else if (event.target.innerText === 'Add sport') {
                setAddSportModalOpen(true)
            } else if (event.target.innerText === 'View leaderboard') {
                navigate('/leaderboard')
            } else if (event.target.innerText === 'View recent games') {
                navigate('/recent_games')
            }
        }
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button'
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch'
                    }
                }}
            >
                <MenuItem onClick={handleClose}>View leaderboard</MenuItem>
                <MenuItem onClick={handleClose}>View recent games</MenuItem>
                <MenuItem onClick={handleClose}>Add result</MenuItem>
                <MenuItem onClick={handleClose}>Add sport</MenuItem>
            </Menu>
            <AddResultModal
                open={addResultModalOpen}
                setOpen={setAddResultModalOpen}
                sport={sport}
                setPlayerData={setPlayerData}
            />
            <AddSportModal
                open={addSportModalOpen}
                setOpen={setAddSportModalOpen}
                setSport={setSport}
                sportList={sportList}
            />
        </div>
    )
}

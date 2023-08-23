import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom'
import AddResultModal from './Modals/AddResultModal'
import AddSportModal from './Modals/AddSportModal'
import LoginModal from './Modals/LoginModal'
import eloService from '../../services/elo'
import SignupModal from './Modals/SignupModal'

const ITEM_HEIGHT = 60

export default function LongMenu({
    sport, setPlayerData, setRecentGames, setSport, sportList, user, setUser, handleEloError
}) {
    const navigate = useNavigate()

    const [addResultModalOpen, setAddResultModalOpen] = React.useState(false)
    const [addSportModalOpen, setAddSportModalOpen] = React.useState(false)
    const [loginModalOpen, setLoginModalOpen] = React.useState(false)
    const [signupModalOpen, setSignupModalOpen] = React.useState(false)

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleLogout = () => {
        eloService.clearToken()
        window.localStorage.clear()
        window.location.reload()
    }

    const handleClose = (event) => {
        setAnchorEl(null)
        const cmd = String(event.target.innerText).trim()
        if (cmd === 'Add result') {
            setAddResultModalOpen(true)
        } else if (cmd === 'Add sport') {
            setAddSportModalOpen(true)
        } else if (cmd === 'View leaderboard') {
            navigate('/leaderboard')
        } else if (cmd === 'View recent games') {
            navigate('/recent_games')
        } else if (cmd === 'Log in') {
            setLoginModalOpen(true)
        } else if (cmd === 'Sign up') {
            setSignupModalOpen(true)
        } else if (cmd === 'Logout') {
            handleLogout()
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
                {user ? <MenuItem onClick={handleClose}>Add result</MenuItem> : null}
                {user ? <MenuItem onClick={handleClose}>Add sport</MenuItem> : null}
                {!user
                    ? (
                        <div>
                            <MenuItem onClick={handleClose}>Log in</MenuItem>
                            <MenuItem onClick={handleClose}>Sign up</MenuItem>
                        </div>
                    )
                    : <MenuItem onClick={handleClose}>Logout</MenuItem>}
            </Menu>
            <AddResultModal
                open={addResultModalOpen}
                setOpen={setAddResultModalOpen}
                sport={sport}
                setPlayerData={setPlayerData}
                setRecentGames={setRecentGames}
                handleEloError={handleEloError}
                user={user}
            />
            <AddSportModal
                open={addSportModalOpen}
                setOpen={setAddSportModalOpen}
                setSport={setSport}
                sportList={sportList}
                handleEloError={handleEloError}
            />
            <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} setUser={setUser} />
            <SignupModal open={signupModalOpen} setOpen={setSignupModalOpen} setUser={setUser} />
        </div>
    )
}

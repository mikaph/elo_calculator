import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'

export default function BasicMenu({ sport, sportList, setSport }) {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    if (!sportList) {
        return null
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (event) => {
        setAnchorEl(null)
        if (event.target.innerText) {
            const s = event.target.innerText.replace(/\r?\n|\r/g, '')
            setSport(s)
            const newPath = `${window.location.pathname}?sport=${s}`
            navigate(newPath)
        }
    }

    return (
        <div>
            <Button
                style={{ color: 'white' }}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <b>{sport || 'Select a sport'}</b>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                {sportList.map((s) => (
                    <MenuItem key={s} value={s} onClick={handleClose}>{s}</MenuItem>
                ))}
            </Menu>
        </div>
    )
}

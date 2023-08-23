import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

export default function BasicMenu({ sport, sportList, setSport }) {
    if (!sportList) {
        return null
    }

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (event) => {
        setAnchorEl(null)
        if (event.target.innerText) {
            setSport(event.target.innerText)
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
                <b>{sport}</b>
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

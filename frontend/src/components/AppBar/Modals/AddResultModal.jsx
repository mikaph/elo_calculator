import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
}

export default function AddResultModal({ open, setOpen, sport }) {
    const handleClose = () => setOpen(false)
    const [winner, setWinner] = React.useState('')
    const [loser, setLoser] = React.useState('')
    const [playerNames, setPlayerNames] = React.useState([])
    const [addButtonPressed, setAddButtonPressed] = React.useState(false)

    React.useEffect(() => {
        const sportString = sport.toLowerCase().split(' ').join('_')
        fetch(`/players/${sportString}`).then((res) => {
            res.json().then((d) => {
                setPlayerNames(d.sort())
            })
        })
    }, [])

    const handleAddButton = () => {
        console.log('Pressed')
        setAddButtonPressed(true)
    }

    const handleNameTyped = () => setAddButtonPressed(false)

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack spacing={2}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Add a match result
                        </Typography>
                        <Autocomplete
                            disablePortal
                            onChange={(newValue) => setWinner(newValue)}
                            onInputChange={handleNameTyped}
                            id="combo-box-winner"
                            options={playerNames.filter((p) => p !== loser)}
                            renderInput={(params) => <TextField {...params} label="Winner" />}
                        />
                        <Autocomplete
                            disablePortal
                            onChange={(newValue) => setLoser(newValue)}
                            onInputChange={handleNameTyped}
                            id="combo-box-loser"
                            options={playerNames.filter((p) => p !== winner)}
                            renderInput={(params) => <TextField {...params} label="Loser" />}
                        />
                        {!addButtonPressed ? <Button variant="contained" onClick={handleAddButton}>Add!</Button> : <Button variant="contained" disabled>Result added!</Button>}
                    </Stack>
                </Box>
            </Modal>
        </div>
    )
}

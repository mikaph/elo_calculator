import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import eloService from '../../../services/elo'

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

export default function AddSportModal({
    open, setOpen, setSport, sportList, handleEloError
}) {
    const handleClose = () => setOpen(false)
    const [addButtonPressed, setAddButtonPressed] = React.useState(false)
    const [newSport, setNewSport] = React.useState('')

    const handleAddButton = (event) => {
        event.preventDefault()
        setAddButtonPressed(true)
        const sportString = newSport.toLowerCase().split(' ').join('_')
        const sportObject = {
            sport: newSport,
            filename: sportString
        }

        setNewSport('')

        eloService.postSport(sportObject).then(() => {
            setSport(newSport)
        }).catch(() => {
            handleEloError()
            handleClose()
        })
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <form onSubmit={handleAddButton}>
                    <Box sx={style}>
                        <Stack spacing={2}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Add a new sport
                            </Typography>
                            <Autocomplete
                                freeSolo
                                disablePortal
                                value={newSport}
                                inputValue={newSport}
                                onChange={(event, newValue) => setNewSport(newValue)}
                                onInputChange={(event, newValue) => {
                                    setNewSport(newValue)
                                    setAddButtonPressed(false)
                                }}
                                id="combo-box-new-sport"
                                options={sportList}
                                renderInput={(params) => <TextField {...params} label="New sport" />}
                            />
                            {!addButtonPressed ? <Button type="submit" variant="contained" onClick={handleAddButton}>Add!</Button> : <Button variant="contained" disabled>New sport added!</Button>}
                        </Stack>
                    </Box>
                </form>
            </Modal>
        </div>
    )
}

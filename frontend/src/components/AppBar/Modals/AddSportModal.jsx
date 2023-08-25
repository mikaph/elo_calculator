import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
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
    open, setOpen, setSport, sportList, setSportList, handleEloError
}) {
    const [addButtonPressed, setAddButtonPressed] = React.useState(false)
    const [newSport, setNewSport] = React.useState('')
    const [newSportError, setNewSportError] = React.useState(null)

    const navigate = useNavigate()

    const handleClose = () => {
        setOpen(false)
        setNewSport('')
        setNewSportError(null)
    }

    const handleAddButton = (event) => {
        event.preventDefault()

        if (!newSport) {
            setNewSportError('No empty values allowed!')
        } else {
            setAddButtonPressed(true)
            const sportObject = {
                sport: newSport
            }

            const newPath = `${location.pathname}?sport=${newSport}`
            navigate(newPath)

            setNewSport('')

            eloService.postSport(sportObject).then(() => {
                setSport(newSport)
                eloService.getSports().then((sports) => {
                    const arr = sports.sort()
                    setSportList(arr)
                }).catch((e) => {
                    console.log(e)
                })
            }).catch(() => {
                handleEloError()
                handleClose()
            })
        }
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
                                onChange={(event, newValue) => {
                                    if (!newValue) {
                                        setNewSport('')
                                    } else {
                                        setNewSport(newValue)
                                    }
                                }}
                                onInputChange={(event, newValue) => {
                                    if (!newValue) {
                                        setNewSport('')
                                    } else {
                                        setNewSport(newValue)
                                    }
                                    setAddButtonPressed(false)
                                }}
                                id="combo-box-new-sport"
                                options={sportList}
                                renderInput={(params) => <TextField error={newSportError} helperText={newSportError} {...params} label="New sport" />}
                            />
                            {!addButtonPressed ? <Button type="submit" variant="contained" onClick={handleAddButton}>Add!</Button> : <Button variant="contained" disabled>New sport added!</Button>}
                        </Stack>
                    </Box>
                </form>
            </Modal>
        </div>
    )
}

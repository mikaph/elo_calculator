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

export default function AddResultModal({
    open, setOpen, sport, setPlayerData, handleEloError
}) {
    const handleClose = () => setOpen(false)
    const [winner, setWinner] = React.useState('')
    const [loser, setLoser] = React.useState('')
    const [playerNames, setPlayerNames] = React.useState([])
    const [addButtonPressed, setAddButtonPressed] = React.useState(false)

    const sportString = sport.toLowerCase().split(' ').join('_')

    React.useEffect(() => {
        eloService.getPlayers(sportString).then((players) => {
            setPlayerNames(players.sort())
        }).catch((e) => {
            console.log(e)
        })
    }, [sport])

    const handleAddButton = (event) => {
        event.preventDefault()
        setAddButtonPressed(true)
        const resultObject = {
            sport: sportString,
            winner,
            loser
        }

        eloService.postResult(resultObject).then(() => {
            eloService.getLeaderboard(sportString).then((stats) => {
                setPlayerData(stats)
            }).catch((e) => {
                console.log(e)
            })
        }).then(() => {
            eloService.getPlayers(sportString).then((players) => {
                setPlayerNames(players.sort())
            }).catch((e) => {
                console.log(e)
            })
        }).finally(() => {
            setWinner('')
            setLoser('')
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
                                Add a match result
                            </Typography>
                            <Autocomplete
                                freeSolo
                                disablePortal
                                value={winner}
                                inputValue={winner}
                                onChange={(event, newValue) => {
                                    if (!newValue) {
                                        setWinner('')
                                    } else {
                                        setWinner(newValue)
                                    }
                                }}
                                onInputChange={(event, newValue) => {
                                    if (!newValue) {
                                        setWinner('')
                                    } else {
                                        setWinner(newValue)
                                    }
                                    setAddButtonPressed(false)
                                }}
                                id="combo-box-winner"
                                options={playerNames.filter((p) => p !== loser)}
                                renderInput={(params) => <TextField {...params} label="Winner" />}
                            />
                            <Autocomplete
                                freeSolo
                                disablePortal
                                value={loser}
                                inputValue={loser}
                                onChange={(event, newValue) => {
                                    if (!newValue) {
                                        setLoser('')
                                    } else {
                                        setLoser(newValue)
                                    }
                                }}
                                onInputChange={(event, newValue) => {
                                    if (!newValue) {
                                        setLoser('')
                                    } else {
                                        setLoser(newValue)
                                    }
                                    setAddButtonPressed(false)
                                }}
                                id="combo-box-loser"
                                options={playerNames.filter((p) => p !== winner)}
                                renderInput={(params) => <TextField {...params} label="Loser" />}
                            />
                            {!addButtonPressed ? <Button type="submit" variant="contained" onClick={handleAddButton}>Add!</Button> : <Button variant="contained" disabled>Result added!</Button>}
                        </Stack>
                    </Box>
                </form>
            </Modal>
        </div>
    )
}

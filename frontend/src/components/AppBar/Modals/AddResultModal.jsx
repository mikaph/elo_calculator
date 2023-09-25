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
    width: {
        xs: '85%', sm: '40%', md: '30%', lg: '25%'
    },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
}

export default function AddResultModal({
    open, setOpen, sport, setPlayerData, setRecentGames, handleEloError, user
}) {
    const [winner, setWinner] = React.useState('')
    const [loser, setLoser] = React.useState('')
    const [playerNames, setPlayerNames] = React.useState([])
    const [addButtonPressed, setAddButtonPressed] = React.useState(false)
    const [winnerError, setWinnerError] = React.useState(null)
    const [loserError, setLoserError] = React.useState(null)

    const handleClose = () => {
        setOpen(false)
        setWinner('')
        setLoser('')
        setWinnerError(null)
        setLoserError(null)
    }

    React.useEffect(() => {
        eloService.getPlayers(sport).then((players) => {
            setPlayerNames(players.sort())
        }).catch((e) => {
            console.log(e)
        })
    }, [sport])

    const handleAddButton = (event) => {
        event.preventDefault()

        if (!winner && !loser) {
            setWinnerError('No empty values allowed!')
            setLoserError('No empty values allowed!')
        } else if (!winner) {
            setWinnerError('No empty values allowed!')
        } else if (!loser) {
            setLoserError('No empty values allowed!')
        } else {
            setAddButtonPressed(true)
            const resultObject = {
                sport,
                winner,
                loser,
                submitter: user.username
            }

            eloService.postResult(resultObject).then(() => {
                eloService.getLeaderboard(sport).then((stats) => {
                    setPlayerData(stats)
                }).catch((e) => {
                    console.log(e)
                })
            }).then(() => {
                eloService.getRecentGames(sport).then((games) => {
                    setRecentGames(games)
                }).catch((e) => {
                    console.log(e)
                })
            }).then(() => {
                eloService.getPlayers(sport).then((players) => {
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
                                    setWinnerError(null)
                                }}
                                id="combo-box-winner"
                                options={playerNames.filter((p) => p !== loser)}
                                renderInput={(params) => <TextField error={winnerError} helperText={winnerError} {...params} label="Winner" />}
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
                                    setLoserError(null)
                                }}
                                id="combo-box-loser"
                                options={playerNames.filter((p) => p !== winner)}
                                renderInput={(params) => <TextField error={loserError} helperText={loserError} {...params} label="Loser" />}
                            />
                            {!addButtonPressed ? <Button type="submit" variant="contained" onClick={handleAddButton}>Add!</Button> : <Button variant="contained" disabled>Result added!</Button>}
                        </Stack>
                    </Box>
                </form>
            </Modal>
        </div>
    )
}

import React, { useState } from 'react'
import {
    Button, TextField, Typography, Alert, Grid
} from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import loginService from '../../../services/login'
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

export default function LoginModal({ open, setOpen, setUser }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const handleClose = () => setOpen(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const userJson = await loginService.login({
            username, password, secret_key: null
        })
        if (userJson) {
            window.localStorage.setItem('loggedEloCalculatorUser', JSON.stringify(userJson))
            eloService.setToken(userJson.token)
            setUser(userJson)
            setUsername('')
            setPassword('')
            setErrorMessage(null)
            window.location.reload()
        } else {
            setErrorMessage('Wrong credentials')
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
                <Box sx={style}>
                    <Stack spacing={2}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                                <Typography component="h1" variant="h5">
                                    Log In
                                </Typography>
                            </Grid>
                            <Grid item>
                                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                            </Grid>
                        </Grid>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                inputProps={{
                                    autoCapitalize: 'none'
                                }}
                                id="username"
                                label="Username"
                                name="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{ marginTop: 16 }}
                            >
                                Log In
                            </Button>
                        </form>
                    </Stack>
                </Box>
            </Modal>
        </div>
    )
}

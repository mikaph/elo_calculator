import red from '@mui/material/colors/red'
import createTheme from '@mui/material/styles/createTheme'

const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6'
        },
        secondary: {
            main: '#19857b'
        },
        error: {
            main: red.A400
        }
    }
})

export default theme

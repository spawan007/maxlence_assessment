import { Typography, Box } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
    const { user } = useAuth()

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            {/* <Typography variant="h3" gutterBottom>
                Welcome to Maxlence Assessment
            </Typography> */}
            {user && (
                <Typography variant="h5">
                    Hello, {user.name}! You are logged in as {user.role}.
                </Typography>
            )}
        </Box>
    )
}

export default Home
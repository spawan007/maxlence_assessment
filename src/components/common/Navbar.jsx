import { Link, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Maxlence Assessment
                    </Link>
                </Typography>

                {user ? (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Button color="inherit" component={Link} to="/profile">
                            <Box display="flex" alignItems="center" gap={1}>
                                <Avatar
                                    src={user.profileImage?.url}
                                    alt={user.name}
                                    sx={{ width: 30, height: 30 }}
                                />
                                <span>{user.name}</span>
                            </Box>
                        </Button>
                        {user.role === 'admin' && (
                            <Button color="inherit" component={Link} to="/users">
                                Users
                            </Button>
                        )}
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Register
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
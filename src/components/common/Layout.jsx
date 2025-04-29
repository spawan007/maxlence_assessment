import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box } from '@mui/material';

const Layout = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            width: '100vw',
            overflowX: 'hidden'
        }}>
            <Navbar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: '100%',
                    maxWidth: '100%',
                    p: 3,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getUsers } from '../../api/users'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    Avatar,
    Box,
    Pagination,
    IconButton
} from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'

const Users = () => {
    const { user } = useAuth()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    })

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const { data } = await getUsers(pagination.page, pagination.limit, search)
            setUsers(data.users)
            setPagination(prev => ({
                ...prev,
                total: data.total
            }))
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [pagination.page, search])

    const handlePageChange = (event, value) => {
        setPagination(prev => ({
            ...prev,
            page: value
        }))
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Users</Typography>

            <TextField
                label="Search users"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 3 }}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Profile</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            {user?.role === 'admin' && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No users found</TableCell>
                            </TableRow>
                        ) : (
                            users.map((userItem) => (
                                <TableRow key={userItem._id}>
                                    <TableCell>
                                        <Avatar src={userItem.profileImage?.url} alt={userItem.name} />
                                    </TableCell>
                                    <TableCell>{userItem.name}</TableCell>
                                    <TableCell>{userItem.email}</TableCell>
                                    <TableCell>{userItem.role}</TableCell>
                                    {user?.role === 'admin' && (
                                        <TableCell>
                                            <IconButton color="primary">
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error">
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                    count={Math.ceil(pagination.total / pagination.limit)}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    )
}

export default Users
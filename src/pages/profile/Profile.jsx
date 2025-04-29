import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getUserProfile, updateProfile } from '../../api/users'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    CircularProgress
} from '@mui/material'
import ImageUploader from '../../components/ui/ImageUploader'
import { toast } from 'react-toastify'

const profileSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
})

const Profile = () => {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [profileImage, setProfileImage] = useState(null)

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(profileSchema)
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getUserProfile(user._id)
                setProfile(data)
                reset(data)
            } catch (error) {
                toast.error('Failed to fetch profile')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [user._id, reset])

    const handleUpdate = async (data) => {
        setUpdating(true)
        try {
            const { data: updatedProfile } = await updateProfile(user._id, {
                ...data,
                profileImage
            })
            setProfile(updatedProfile)
            toast.success('Profile updated successfully!')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>My Profile</Typography>

            <Box
                component="form"
                onSubmit={handleSubmit(handleUpdate)}
                sx={{ mt: 3 }}
            >
                <Box display="flex" justifyContent="center" mb={3}>
                    <Avatar
                        src={profileImage ? URL.createObjectURL(profileImage) : profile?.profileImage?.url}
                        sx={{ width: 120, height: 120 }}
                    />
                </Box>

                <ImageUploader
                    onFileChange={setProfileImage}
                />

                <TextField
                    margin="normal"
                    fullWidth
                    label="Name"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                <TextField
                    margin="normal"
                    fullWidth
                    label="Email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={updating}
                >
                    {updating ? <CircularProgress size={24} /> : 'Update Profile'}
                </Button>
            </Box>
        </Box>
    )
}

export default Profile
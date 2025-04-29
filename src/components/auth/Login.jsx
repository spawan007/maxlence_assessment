import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoginForm from '../../components/auth/LoginForm'
import { loginUser, googleLogin } from '../../api/auth'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    const handleSubmit = async (credentials) => {
        setLoading(true)
        try {
            const { data } = await loginUser(credentials)
            login(data.token)
            toast.success('Login successful!')
            navigate('/')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSuccess = async (credential) => {
        setLoading(true)
        try {
            const { data } = await googleLogin(credential)
            login(data.token)
            toast.success('Google login successful!')
            navigate('/')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Google login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='main_login'>
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflowX: 'hidden', margin: '0 auto', padding: 20
            }}>
                <LoginForm
                    onSubmit={handleSubmit}
                    onGoogleSuccess={handleGoogleSuccess}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export default Login
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import RegisterForm from '../../components/auth/RegisterForm'
import { registerUser } from '../../api/auth'

const Register = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (data) => {
        setLoading(true)
        try {
            await registerUser(data)
            toast.success('Registration successful! Please check your email to verify your account.')
            navigate('/login')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
            <RegisterForm onSubmit={handleSubmit} loading={loading} />
        </div>
    )
}

export default Register
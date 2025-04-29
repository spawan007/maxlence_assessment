import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token)
            if (decoded.exp * 1000 < Date.now()) {
                logout()
            } else {
                setUser(decoded)
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }
        }
        setLoading(false)
    }, [token])

    const login = async (credentials) => {
        try {
            const { data } = await api.post('/login', credentials)
            localStorage.setItem('token', data.token)
            setToken(data.token)
            navigate('/')
            return { success: true }
        } catch (error) {
            return { success: false, error: error.response.data.message }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
        setToken(null)
        navigate('/login')
    }

    const value = {
        user,
        token,
        login,
        logout,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
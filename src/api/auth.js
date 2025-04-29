import api from './index';

export const registerUser = async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
        if (key !== 'profileImage') {
            formData.append(key, userData[key]);
        }
    });
    if (userData.profileImage) {
        formData.append('profileImage', userData.profileImage);
    }

    const response = await api.post('/auth/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const verifyEmail = async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
    return response.data;
};

export const googleLogin = async (credential) => {
    const response = await api.post('/auth/google', { credential });
    return response.data;
};
import api from './index';

export const getUsers = async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/users', {
        params: { page, limit, search }
    });
    return response.data;
};

export const getUserProfile = async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};

export const updateProfile = async (userId, userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
        if (key !== 'profileImage') {
            formData.append(key, userData[key]);
        }
    });
    if (userData.profileImage) {
        formData.append('profileImage', userData.profileImage);
    }

    const response = await api.put(`/users/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};
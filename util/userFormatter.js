export const formatUserData = (user) => {
    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage
            ? `${process.env.BASE_URL || 'http://localhost:5500'}/uploads/profile-images/${user.profileImage}`
            : null,
    };
};

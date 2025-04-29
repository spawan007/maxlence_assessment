import { User } from '../model/User.js';
import bcrypt from 'bcryptjs';
import transporter from '../util/mailer.js';
import { v4 as uuidv4 } from 'uuid';
import { Token } from '../model/Token.js';
import { generateAccessToken, generateRefreshToken } from '../util/jwt.js';
import { formatUserData } from '../util/userFormatter.js';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const profileImage = req.file ? req.file.filename : null;

        const user = await User.create({
            email,
            password: hashedPassword,
            role: role || 'user',
            isVerified: false,
            profileImage
        });

        const verificationToken = uuidv4();
        await Token.create({
            token: verificationToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        //const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const verificationUrl = `http://localhost:5500/api/user/verify-email?token=${verificationToken}`;

        await transporter.sendMail({
            to: user.email,
            subject: 'Verify your email address',
            html: `
          <h2>Welcome!</h2>
          <p>Thank you for registering. Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}" target="_blank">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
        });

        return res.status(201).send({ status: true, message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).send({ status: false, message: 'Something went wrong.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ status: false, message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).send({ status: false, message: 'Please verify your email address before logging in.' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.status(200).send({
            status: true,
            accessToken,
            refreshToken,
            user: formatUserData(user),
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send({ status: false, message: 'Something went wrong. Please try again later.' });
    }
};


export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ status: false, message: 'Verification token is missing.' });
        }

        const tokenRecord = await Token.findOne({ where: { token } });

        if (!tokenRecord) {
            return res.status(400).json({ status: false, message: 'Invalid or expired token.' });
        }

        if (tokenRecord.expiresAt < new Date()) {
            return res.status(400).json({ status: false, message: 'Verification token has expired.' });
        }

        const user = await User.findByPk(tokenRecord.userId);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(200).json({ status: true, message: 'Email already verified.' });
        }

        user.isVerified = true;
        await user.save();

        await Token.destroy({ where: { userId: user.id } });

        return res.status(200).json({ status: true, message: 'Email successfully verified.' });
    } catch (error) {
        console.error('Email verification error:', error);
        return res.status(500).json({ status: false, message: 'Something went wrong.' });
    }
};



export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ status: false, message: 'Your email is already verified.' });
        }

        const verificationToken = uuidv4();
        await Token.create({
            token: verificationToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token expires in 24 hours
        });

        const verificationUrl = `http://localhost:5500/api/user/verify-email?token=${verificationToken}`;
        //const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        await transporter.sendMail({
            to: user.email,
            subject: 'Verify your email address',
            html: `
          <h2>Welcome back!</h2>
          <p>You requested to resend the verification email. Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}" target="_blank">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
        });

        return res.status(200).json({
            status: true,
            message: 'Verification email sent successfully. Please check your inbox.',
        });
    } catch (error) {
        console.error('Error while resending verification email:', error);
        return res.status(500).json({ status: false, message: 'Something went wrong. Please try again later.' });
    }
};



export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).send({ status: false, message: 'User not found' });
    }

    const resetToken = uuidv4();

    await Token.create({
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    const resetUrl = `http://localhost:5500/api/user/reset-password?token=${resetToken}`;
    //const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return res.send({ status: true, message: 'Password reset link sent to email.' });
};



export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    const tokenEntry = await Token.findOne({ where: { token } });

    if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
        return res.status(400).send({ status: false, message: 'Token is invalid or expired.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.update(
        { password: hashedPassword },
        { where: { id: tokenEntry.userId } }
    );

    await Token.destroy({ where: { token } });

    return res.send({ status: true, message: 'Password has been reset successfully.' });
};

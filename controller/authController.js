import { User } from '../model/User.js';
import bcrypt from 'bcryptjs';
import transporter from '../util/mailer.js';
import { v4 as uuidv4 } from 'uuid';
import { Token } from '../model/Token.js';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            email,
            password: hashedPassword,
            role: role || 'user',
            isVerified: false,
        });

        const verificationToken = uuidv4();
        await Token.create({
            token: verificationToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
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
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send({ status: false, message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).send({ status: true, accessToken, refreshToken });
};

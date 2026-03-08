import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import axios from 'axios';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        console.log("Registering user with data:", req.body);
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        //if(password.)
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: "user already exists" });
        }
        //const
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,

        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }

};

//login 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const user = await User.findOne({ email });
        //checking the user
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        //password matching
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
        // res.status(200).json({message:"Login successful",token,username:user.username});


    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update current user profile
export const updateProfile = async (req, res) => {
    try {
        const { bio, profilePicture, skills, githubUrl, portfolioUrl, location } = req.body;

        // Find user and update
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { bio, profilePicture, skills, githubUrl, portfolioUrl, location },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all users (for chat)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.userId } }).select('-password -email');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting all users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user with that email address exists" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // Attempt to send email but gracefully degrade if unconfigured
        let transporter;
        let isTestAccount = false;

        if (process.env.SMTP_USER && process.env.SMTP_USER !== 'yourgmail@gmail.com') {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        } else {
            console.log("No valid SMTP credentials detected. Generating an Ethereal test account...");
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });
            isTestAccount = true;
        }

        const message = `You are receiving this email because you requested the reset of a password.\n\nPlease go to this link to reset it:\n${resetUrl}`;

        try {
            const info = await transporter.sendMail({
                from: `${process.env.FROM_NAME || 'Admin'} <${process.env.SMTP_USER !== 'yourgmail@gmail.com' ? process.env.SMTP_USER : 'admin@devconnect.com'}>`,
                to: user.email,
                subject: 'Password reset token',
                text: message
            });

            console.log("Message sent: %s", info.messageId);

            let previewUrl = null;
            if (isTestAccount) {
                previewUrl = nodemailer.getTestMessageUrl(info);
                console.log("Preview URL (Click here to view the email!): %s", previewUrl);
            }

            res.status(200).json({
                message: "Email sent successfully",
                previewUrl: process.env.NODE_ENV !== 'production' ? previewUrl : undefined,
                resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined
            });
        } catch (err) {
            console.error("Email send fail:", err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: "Email could not be sent" });
        }
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Google OAuth
export const googleOAuth = async (req, res) => {
    try {
        const { googleToken } = req.body;
        // Verify using google API endpoints because we didn't install google-auth-library
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`);
        const { email, name, sub, picture } = response.data;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                username: name.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).substring(7),
                email,
                profilePicture: picture,
            });
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev_secret_key', { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error("Google OAuth Error:", error.response?.data || error.message);
        res.status(401).json({ message: "Invalid Google token" });
    }
};

// GitHub OAuth
export const githubOAuth = async (req, res) => {
    console.log("GitHub OAuth called with body:", req.body);

    try {
        const { code } = req.body;

        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers: { Accept: "application/json" }
            }
        );

        const accessToken = tokenRes.data.access_token;

        if (!accessToken) {
            return res.status(400).json({ message: "Failed to authenticate with GitHub" });
        }

        const userRes = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `token ${accessToken}` }
        });

        const emailRes = await axios.get("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${accessToken}` }
        });

        const primaryEmail =
            emailRes.data.find(e => e.primary)?.email || userRes.data.email;

        if (!primaryEmail) {
            return res.status(400).json({ message: "GitHub account must have an email" });
        }

        let user = await User.findOne({ email: primaryEmail });

        if (!user) {
            user = new User({
                username: userRes.data.login,
                email: primaryEmail,
                profilePicture: userRes.data.avatar_url,
                githubUrl: userRes.data.html_url
            });

            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "dev_secret_key",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Github OAuth error:", error.response?.data || error);
        res.status(500).json({ message: "GitHub authentication failed" });
    }
};
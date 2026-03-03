import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        console.log("Registering user with data:", req.body);
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        //if(password.)
        const existingUser = await User.findOne({email:email.toLowerCase()});
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

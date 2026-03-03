import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            //unique:true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
           match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        },
        password: {
            type: String,
            required: true,
            //  unique:true,
        },
        bio: { type: String, default: '' },
        profilePicture: { type: String, default: '' },
        skills: { type: [String], default: [] },
        githubUrl: { type: String, default: '' },
        portfolioUrl: { type: String, default: '' },
        location: { type: String, default: '' },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
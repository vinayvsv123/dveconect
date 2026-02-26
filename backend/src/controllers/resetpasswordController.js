import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Hash the token to compare with the stored hashed token
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        // If no user is found, the token is invalid or expired
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password and update the user's password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    } 
    
      catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error" });
    }  
};
import crypto from "crypto";
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } 
        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        //hashed token
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        //update in db
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 3600000;
        await user.save();

        // Simulate email sending
        console.log(`Password reset token for ${email}: ${resetToken}`); 
        res.status(200).json({ message: "Password reset token generated" });
    } 
       catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Email exactly match hona chahiye
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        // 2. Bcrypt comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }

        // 3. Token generate (Dashboard protection ke liye)
        const token = jwt.sign({ id: user._id, role: user.role }, "SECRET_123", { expiresIn: "1h" });

        // 4. Send Success
        res.status(200).json({
            success: true,
            token,
            user: {
                name: user.name,
                role: user.role, // "ECI"
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
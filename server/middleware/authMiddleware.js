import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // ইউজার মডেল ইম্পোর্ট করুন

export const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // টোকেন থেকে আইডি নিয়ে ডাটাবেস থেকে ইউজারকে খুঁজে বের করুন
        const user = await User.findById(verified.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // রিকোয়েস্ট অবজেক্টে ইউজারের প্ল্যান সহ সব তথ্য পাঠিয়ে দিন
        req.user = user; 
        
        next(); 
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};
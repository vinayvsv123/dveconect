import Message from '../models/message.model.js';
import User from '../models/user.model.js';

// Get messages between current user and another user
export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params; // other user's ID
        const currentUserId = req.user.userId;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error getting messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Send a message (HTTP fallback, usually done via websocket)
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user.userId;

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            text
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
};

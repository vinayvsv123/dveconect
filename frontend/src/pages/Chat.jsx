import React, { useEffect, useState, useRef } from "react";
import {
    MessageCircle,
    Send,
    Search,
    ArrowLeft,
    Circle,
    Loader2,
} from "lucide-react";
import { getAllUsers, getMessages, sendMessageHTTP } from "../services/api";
import { connectSocket, getSocket, disconnectSocket } from "../services/socket";

function ChatPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [sending, setSending] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    const messagesEndRef = useRef(null);
    const currentUserId = useRef(null);

    // Get current user ID from the JWT token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                currentUserId.current = payload.userId;
            } catch (e) {
                console.error("Error decoding token:", e);
            }
        }
    }, []);

    // Connect socket and load users
    useEffect(() => {
        if (!currentUserId.current) return;

        const socket = connectSocket(currentUserId.current);

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("onlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });

        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();

        return () => {
            disconnectSocket();
        };
    }, []);

    // Filter users when search changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredUsers(users);
        } else {
            const q = searchQuery.toLowerCase();
            setFilteredUsers(
                users.filter((u) => u.username.toLowerCase().includes(q))
            );
        }
    }, [searchQuery, users]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const selectUser = async (user) => {
        setSelectedUser(user);
        setShowSidebar(false);
        setLoadingMsgs(true);
        try {
            const msgs = await getMessages(user._id);
            setMessages(msgs);
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            setLoadingMsgs(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedUser) return;

        const msgData = {
            sender: currentUserId.current,
            receiver: selectedUser._id,
            receiverId: selectedUser._id,
            text: newMessage.trim(),
            createdAt: new Date().toISOString(),
        };

        // Add to local messages immediately
        setMessages((prev) => [...prev, msgData]);
        setNewMessage("");

        // Emit via WebSocket
        const socket = getSocket();
        if (socket?.connected) {
            socket.emit("sendMessage", msgData);
        }

        // Also persist via HTTP
        try {
            setSending(true);
            await sendMessageHTTP(selectedUser._id, msgData.text);
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isOnline = (userId) => onlineUsers.includes(userId);

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white pt-20">
            <div className="max-w-6xl mx-auto h-[calc(100vh-5rem)] flex rounded-xl overflow-hidden border border-slate-800">
                {/* ─── Sidebar: User List ─── */}
                <div
                    className={`${showSidebar ? "flex" : "hidden md:flex"
                        } flex-col w-full md:w-80 lg:w-96 bg-slate-900/80 backdrop-blur-md border-r border-slate-800 shrink-0`}
                >
                    {/* Sidebar Header */}
                    <div className="p-5 border-b border-slate-800">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <MessageCircle className="w-6 h-6 text-blue-400" />
                            Messages
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    {/* User List */}
                    <div className="flex-1 overflow-y-auto">
                        {loadingUsers ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm py-10">
                                No users found.
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <button
                                    key={user._id}
                                    onClick={() => selectUser(user)}
                                    className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-800/60 transition text-left ${selectedUser?._id === user._id
                                            ? "bg-slate-800/80 border-l-2 border-blue-500"
                                            : "border-l-2 border-transparent"
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="w-11 h-11 bg-slate-700 rounded-full flex items-center justify-center text-lg font-bold text-blue-300 overflow-hidden">
                                            {user.profilePicture ? (
                                                <img
                                                    src={user.profilePicture}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                user.username?.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        {isOnline(user._id) && (
                                            <Circle className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 text-green-400 fill-green-400" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{user.username}</p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {isOnline(user._id) ? "Online" : "Offline"}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* ─── Chat Area ─── */}
                <div
                    className={`${showSidebar ? "hidden md:flex" : "flex"
                        } flex-col flex-1 bg-slate-950/50`}
                >
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                                <button
                                    onClick={() => setShowSidebar(true)}
                                    className="md:hidden text-gray-400 hover:text-white"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>

                                <div className="relative">
                                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg font-bold text-blue-300 overflow-hidden">
                                        {selectedUser.profilePicture ? (
                                            <img
                                                src={selectedUser.profilePicture}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            selectedUser.username?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    {isOnline(selectedUser._id) && (
                                        <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-green-400 fill-green-400" />
                                    )}
                                </div>

                                <div>
                                    <p className="font-semibold">{selectedUser.username}</p>
                                    <p className="text-xs text-gray-400">
                                        {isOnline(selectedUser._id) ? (
                                            <span className="text-green-400">Online</span>
                                        ) : (
                                            "Offline"
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                                {loadingMsgs ? (
                                    <div className="flex items-center justify-center h-40">
                                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
                                        <p>No messages yet.</p>
                                        <p className="text-sm">
                                            Say hello to {selectedUser.username}!
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMine = msg.sender === currentUserId.current;
                                        return (
                                            <div
                                                key={idx}
                                                className={`flex ${isMine ? "justify-end" : "justify-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine
                                                            ? "bg-blue-600 text-white rounded-br-md"
                                                            : "bg-slate-800 text-gray-200 rounded-bl-md"
                                                        }`}
                                                >
                                                    <p className="break-words">{msg.text}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${isMine ? "text-blue-200" : "text-gray-500"
                                                            }`}
                                                    >
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="px-5 py-4 border-t border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!newMessage.trim() || sending}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded-xl transition"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Select a conversation</p>
                            <p className="text-sm mt-1">
                                Choose someone to start chatting with
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatPage;

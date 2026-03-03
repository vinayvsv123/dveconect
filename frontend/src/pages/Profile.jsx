import React, { useEffect, useState } from "react";
import {
    User,
    Mail,
    MapPin,
    Github,
    Globe,
    Edit3,
    Save,
    X,
    Plus,
    Trash2,
    Loader2,
} from "lucide-react";
import { getProfile, updateProfile } from "../services/api";

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [formData, setFormData] = useState({
        bio: "",
        profilePicture: "",
        skills: [],
        githubUrl: "",
        portfolioUrl: "",
        location: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            setProfile(data);
            setFormData({
                bio: data.bio || "",
                profilePicture: data.profilePicture || "",
                skills: data.skills || [],
                githubUrl: data.githubUrl || "",
                portfolioUrl: data.portfolioUrl || "",
                location: data.location || "",
            });
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await updateProfile(formData);
            setProfile(res.user);
            setEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            bio: profile.bio || "",
            profilePicture: profile.profilePicture || "",
            skills: profile.skills || [],
            githubUrl: profile.githubUrl || "",
            portfolioUrl: profile.portfolioUrl || "",
            location: profile.location || "",
        });
        setEditing(false);
    };

    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !formData.skills.includes(trimmed)) {
            setFormData({ ...formData, skills: [...formData.skills, trimmed] });
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skillToRemove),
        });
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 text-white">
                <p className="text-gray-400">Could not load profile.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white pt-28 pb-16 px-6">
            <div className="max-w-3xl mx-auto">

                {/* ─── Header Card ─── */}
                <div className="relative bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden">
                    {/* Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

                    {/* Avatar + Name */}
                    <div className="px-8 pb-6">
                        <div className="flex items-end gap-5 -mt-12">
                            <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-3xl font-bold text-blue-400 shrink-0 overflow-hidden">
                                {formData.profilePicture && editing ? (
                                    <img
                                        src={formData.profilePicture}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : profile.profilePicture ? (
                                    <img
                                        src={profile.profilePicture}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    profile.username?.charAt(0).toUpperCase()
                                )}
                            </div>

                            <div className="flex-1 pt-14">
                                <h1 className="text-2xl font-bold">{profile.username}</h1>
                                <p className="text-gray-400 text-sm flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {profile.email}
                                </p>
                            </div>

                            <div className="pt-14">
                                {!editing ? (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Details Section ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                    {/* Bio */}
                    <div className="md:col-span-2 bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Bio
                        </h2>
                        {editing ? (
                            <textarea
                                value={formData.bio}
                                onChange={(e) =>
                                    setFormData({ ...formData, bio: e.target.value })
                                }
                                placeholder="Tell us about yourself..."
                                rows={4}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-blue-500 resize-none transition"
                            />
                        ) : (
                            <p className="text-gray-300 leading-relaxed">
                                {profile.bio || "No bio yet."}
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-400" />
                            Location
                        </h2>
                        {editing ? (
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                                placeholder="e.g. Mumbai, India"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-blue-500 transition"
                            />
                        ) : (
                            <p className="text-gray-300">
                                {profile.location || "Not specified"}
                            </p>
                        )}
                    </div>

                    {/* Profile Picture URL */}
                    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Profile Picture URL
                        </h2>
                        {editing ? (
                            <input
                                type="text"
                                value={formData.profilePicture}
                                onChange={(e) =>
                                    setFormData({ ...formData, profilePicture: e.target.value })
                                }
                                placeholder="https://example.com/avatar.png"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-blue-500 transition"
                            />
                        ) : (
                            <p className="text-gray-300 truncate">
                                {profile.profilePicture || "Not set"}
                            </p>
                        )}
                    </div>

                    {/* GitHub */}
                    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Github className="w-5 h-5 text-blue-400" />
                            GitHub
                        </h2>
                        {editing ? (
                            <input
                                type="text"
                                value={formData.githubUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, githubUrl: e.target.value })
                                }
                                placeholder="https://github.com/username"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-blue-500 transition"
                            />
                        ) : profile.githubUrl ? (
                            <a
                                href={profile.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline transition"
                            >
                                {profile.githubUrl}
                            </a>
                        ) : (
                            <p className="text-gray-300">Not linked</p>
                        )}
                    </div>

                    {/* Portfolio */}
                    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-400" />
                            Portfolio
                        </h2>
                        {editing ? (
                            <input
                                type="text"
                                value={formData.portfolioUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, portfolioUrl: e.target.value })
                                }
                                placeholder="https://myportfolio.com"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-blue-500 transition"
                            />
                        ) : profile.portfolioUrl ? (
                            <a
                                href={profile.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline transition"
                            >
                                {profile.portfolioUrl}
                            </a>
                        ) : (
                            <p className="text-gray-300">Not linked</p>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="md:col-span-2 bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-3">Skills</h2>

                        {editing && (
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleSkillKeyDown}
                                    placeholder="Add a skill (press Enter)"
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500 transition"
                                />
                                <button
                                    onClick={addSkill}
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {(editing ? formData.skills : profile.skills)?.length > 0 ? (
                                (editing ? formData.skills : profile.skills).map(
                                    (skill, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-slate-800 text-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-700"
                                        >
                                            {skill}
                                            {editing && (
                                                <button
                                                    onClick={() => removeSkill(skill)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </span>
                                    )
                                )
                            ) : (
                                <p className="text-gray-400 text-sm">No skills added yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── Account Info ─── */}
                <div className="mt-8 bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-3">Account Info</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div>
                            <span className="text-gray-500">Member since:</span>{" "}
                            {new Date(profile.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                        <div>
                            <span className="text-gray-500">Last updated:</span>{" "}
                            {new Date(profile.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
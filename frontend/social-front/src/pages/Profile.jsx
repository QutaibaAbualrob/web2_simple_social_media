import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { User, Mail, Calendar, Edit2, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import PostCard from '../components/PostCard'; // Import PostCard

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userPosts, setUserPosts] = useState([]); // New state for user's posts
    const [postsLoading, setPostsLoading] = useState(true); // New state for posts loading

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        profilePictureUrl: ''
    });

    const isOwnProfile = currentUser && currentUser.userId === parseInt(id);

    useEffect(() => {
        fetchProfile();
        fetchUserPosts(); // Fetch user-specific posts
    }, [id]);

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/users/${id}`);
            setProfile(res.data);
            setEditForm({
                name: res.data.name,
                bio: res.data.bio,
                profilePictureUrl: res.data.profilePictureUrl
            });
        } catch (e) {
            console.error("Failed to load profile", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPosts = async () => {
        try {
            setPostsLoading(true);
            const response = await api.get(`/posts/User/${id}?page=1&pageSize=10`);
            setUserPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch user posts", error);
            setUserPosts([]); // Clear posts on error
        } finally {
            setPostsLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/me', editForm);
            setProfile({ ...profile, ...editForm });
            setIsEditing(false);
            // Should ideally update main AuthContext user too if name/pic changed
        } catch (e) {
            alert('Failed to update profile');
        }
    };

    const handleDeletePost = (postId) => {
        setUserPosts(userPosts.filter(p => p.postId !== postId));
    };

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>User not found</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
                <div className="card fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
                    {/* Cover Photo Placeholder */}
                    <div style={{
                        height: '150px',
                        background: 'linear-gradient(to right, #3b82f6, #ec4899)',
                        opacity: 0.2
                    }}></div>

                    <div style={{ padding: '0 2rem 2rem', marginTop: '-50px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div className="avatar" style={{
                                width: '100px',
                                height: '100px',
                                border: '4px solid var(--bg-secondary)',
                                fontSize: '2.5rem'
                            }}>
                                {profile.profilePictureUrl ? <img src={profile.profilePictureUrl} className="avatar" style={{ width: '100%', height: '100%' }} /> : <User size={40} />}
                            </div>

                            {isOwnProfile && !isEditing && (
                                <button onClick={() => setIsEditing(true)} className="btn-secondary" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-tertiary)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <>
                                <div>
                                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{profile.name}</h1>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>@{profile.username}</p>
                                </div>

                                {profile.bio && (
                                    <div style={{ color: 'var(--text-primary)', lineHeight: '1.6', textAlign: 'left' }}>
                                        {profile.bio}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mail size={16} /> {profile.email}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={16} /> Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                                    <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} maxLength={100} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Bio</label>
                                    <textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} rows={3} maxLength={500} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Profile Picture URL</label>
                                    <input value={editForm.profilePictureUrl} onChange={e => setEditForm({ ...editForm, profilePictureUrl: e.target.value })} />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn-primary" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-color)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={18} /> Save</button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-tertiary)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><X size={18} /> Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Display User's Posts */}
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'left' }}>Posts by {profile.username}</h2>
                    {postsLoading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <Loader2 className="spin" size={32} style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    ) : (
                        userPosts.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {userPosts.map(post => (
                                    <PostCard key={post.postId} post={post} onDelete={handleDeletePost} />
                                ))}
                            </div>
                        ) : (
                            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>This user has no posts yet.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

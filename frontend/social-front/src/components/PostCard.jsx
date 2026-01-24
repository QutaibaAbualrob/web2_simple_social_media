import { useState, useEffect } from 'react';
import { Heart, MessageCircle, MoreHorizontal, User, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

const PostCard = ({ post, onDelete }) => {
    const { user: currentUser } = useAuth();
    const [liked, setLiked] = useState(post.isLikedByCurrentUser); // Initialize with backend data
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const isOwner = currentUser && currentUser.userId === post.userId;

    // Update liked state if post.isLikedByCurrentUser changes (e.g., when new posts are loaded)
    useEffect(() => {
        setLiked(post.isLikedByCurrentUser);
    }, [post.isLikedByCurrentUser]);

    const handleLike = async () => {
        // Optimistic update
        if (liked) {
            setLiked(false);
            setLikesCount(prev => prev - 1);
            try {
                await api.delete(`/likes/post/${post.postId}`);
            } catch (e) {
                console.error("Failed to unlike post", e);
                setLiked(true); // Revert
                setLikesCount(prev => prev + 1);
            }
        } else {
            setLiked(true);
            setLikesCount(prev => prev + 1);
            try {
                await api.post(`/likes/post/${post.postId}`);
            } catch (e) {
                console.error("Failed to like post", e);
                setLiked(false); // Revert
                setLikesCount(prev => prev - 1);
            }
        }
    };

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            // Load comments
            try {
                const res = await api.get(`/comments/post/${post.postId}`);
                setComments(res.data);
            } catch (e) {
                console.error(e);
            }
        }
        setShowComments(!showComments);
    };

    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await api.post('/comments', { postId: post.postId, content: newComment });
            setComments([res.data, ...comments]);
            setNewComment('');
            post.commentsCount++; // Mutating prob not best but works for simple update
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await api.delete(`/posts/${post.postId}`);
                onDelete(post.postId);
            } catch (e) {
                alert("Failed to delete post");
            }
        }
    }

    return (
        <div className="card fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="avatar">
                            {post.userProfilePictureUrl ? <img src={post.userProfilePictureUrl} className="avatar" /> : <User size={20} />}
                        </div>
                    </Link>
                    <div>
                        <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none' }}>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{post.username}</div>
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {formatDistanceToNow(new Date(post.timeStamp), { addSuffix: true })}
                        </div>
                    </div>
                </div>
                {isOwner && (
                    <button onClick={handleDelete} className="btn-ghost" style={{ color: 'var(--error)', padding: '0.5rem' }}>
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            <p style={{ color: 'var(--text-primary)', marginBottom: '1rem', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                {post.content}
            </p>

            {post.mediaUrl && (
                <div style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    border: '1px solid var(--bg-tertiary)'
                }}>
                    <img src={post.mediaUrl} alt="Post content" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--bg-tertiary)', paddingTop: '1rem' }}>
                <button
                    onClick={handleLike}
                    className="btn-ghost"
                    style={{
                        color: liked ? 'var(--secondary-color)' : 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Heart size={20} fill={liked ? "currentColor" : "none"} />
                    <span>{likesCount}</span>
                </button>

                <button
                    onClick={toggleComments}
                    className="btn-ghost"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <MessageCircle size={20} />
                    <span>{post.commentsCount}</span>
                </button>
            </div>

            {showComments && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--bg-tertiary)' }}>
                    <form onSubmit={handleCreateComment} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Post</button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {comments.map(c => (
                            <div key={c.commentId} style={{ display: 'flex', gap: '0.75rem' }}>
                                <Link to={`/profile/${c.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                        {c.userProfilePictureUrl ? <img src={c.userProfilePictureUrl} className="avatar" /> : c.username[0]}
                                    </div>
                                </Link>
                                <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <Link to={`/profile/${c.userId}`} style={{ textDecoration: 'none' }}>
                                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{c.username}</span>
                                        </Link>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                            {formatDistanceToNow(new Date(c.timeStamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', textAlign: 'left' }}>{c.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;

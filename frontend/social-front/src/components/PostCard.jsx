import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, User, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PostCard = ({ post, onDelete }) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false); // Ideally this state comes from backend 'IsLikedByCurrentUser'
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const isOwner = user && user.userId === post.userId;

    const handleLike = async () => {
        // Optimistic update
        // Note: Backend prevents duplicate likes, so this simple toggle logic is a bit naive but okay for demo
        // Ideally we need to know if we already liked it.
        // For now assuming we haven't if we just loaded the page (limit of API)
        // A better API would return `isLiked` boolean.

        // Let's implement toggle locally but call correct API
        if (liked) {
            setLiked(false);
            setLikesCount(p => p - 1);
            try {
                await api.delete(`/likes/post/${post.postId}`);
            } catch (e) {
                setLiked(true); // Revert
                setLikesCount(p => p + 1);
            }
        } else {
            setLiked(true);
            setLikesCount(p => p + 1);
            try {
                await api.post(`/likes/post/${post.postId}`);
            } catch (e) {
                setLiked(false); // Revert
                setLikesCount(p => p - 1);
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
                    <div className="avatar">
                        {post.userProfilePictureUrl ? <img src={post.userProfilePictureUrl} className="avatar" /> : <User size={20} />}
                    </div>
                    <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{post.username}</div>
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

            <p style={{ color: 'var(--text-primary)', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
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
                                <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                    {c.userProfilePictureUrl ? <img src={c.userProfilePictureUrl} className="avatar" /> : c.username[0]}
                                </div>
                                <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{c.username}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                            {formatDistanceToNow(new Date(c.timeStamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem' }}>{c.content}</p>
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

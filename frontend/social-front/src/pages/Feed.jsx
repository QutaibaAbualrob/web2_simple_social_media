import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // UseRef for preventing multiple fetch calls in StrictMode
    const initialized = useRef(false);

    const fetchPosts = async (pageNum, isRefresh = false) => {
        try {
            const response = await api.get(`/posts?page=${pageNum}&pageSize=10`);
            const newPosts = response.data;

            if (newPosts.length < 10) {
                setHasMore(false);
            }

            if (isRefresh) {
                setPosts(newPosts);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            fetchPosts(1, true);
        }
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage);
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(p => p.postId !== postId));
    };

    return (
        <div className="bg-feed-mesh" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
            <div className="bg-feed-orb bg-feed-orb-1" aria-hidden="true" />
            <div className="bg-feed-orb bg-feed-orb-2" aria-hidden="true" />
            <div className="bg-feed-content">
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '680px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1rem' }}>Your Feed</h1>

                    {loading && posts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <Loader2 className="spin" size={32} style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {posts.map(post => (
                                <PostCard key={post.postId} post={post} onDelete={handleDeletePost} />
                            ))}

                            {posts.length === 0 && (
                                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                    <p style={{ color: 'var(--text-secondary)' }}>No posts yet. Be the first to share something!</p>
                                </div>
                            )}

                            {hasMore && posts.length > 0 && (
                                <button
                                    onClick={handleLoadMore}
                                    className="btn-secondary"
                                    style={{ width: '100%', marginTop: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-tertiary)' }}
                                >
                                    Load More
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Feed;

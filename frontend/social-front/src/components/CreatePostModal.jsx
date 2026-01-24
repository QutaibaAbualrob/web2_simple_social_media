import { useState } from 'react';
import { X, Image as ImageIcon, Send } from 'lucide-react';
import api from '../services/api';

const CreatePostModal = ({ onClose, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState(''); // Simple URL input for now
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setError('');

        try {
            await api.post('/posts', {
                content,
                mediaUrl: mediaUrl || null,
                mediaType: mediaUrl ? 1 : 0 // 1 = Image, 0 = None (Simple logic)
            });
            setContent('');
            setMediaUrl('');
            onClose();
            if (onPostCreated) onPostCreated(); // Refresh feed if needed
            window.location.reload(); // Simple refresh for now
        } catch (err) {
            setError('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div
                className="card"
                style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Create Post</h2>
                    <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={20} /></button>
                </div>

                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        style={{
                            marginBottom: '1rem',
                            resize: 'none',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            border: 'none'
                        }}
                    />

                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Image URL (Optional)..."
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            style={{ fontSize: '0.9rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {content.length}/5000
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading || !content.trim()}
                        >
                            {loading ? 'Posting...' : <><Send size={18} style={{ marginRight: '0.5rem' }} /> Post</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;

import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Home, PlusSquare } from 'lucide-react';
import { useState } from 'react';
import CreatePostModal from './CreatePostModal';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <>
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--bg-tertiary)',
                padding: '0.75rem 0'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #3b82f6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Qutaibas Social Media
                    </Link>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link to="/" title="Feed" className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                            <Home size={24} />
                        </Link>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary"
                            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}
                        >
                            <PlusSquare size={20} />
                            <span style={{ marginLeft: '0.5rem' }}>Create</span>
                        </button>

                        <Link to={`/profile/${user.userId}`} title="Profile" className="avatar">
                            {user.profilePictureUrl ? (
                                <img src={user.profilePictureUrl} alt={user.username} className="avatar" />
                            ) : (
                                <User size={20} />
                            )}
                        </Link>

                        <button onClick={handleLogout} title="Logout" className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>
            {isModalOpen && <CreatePostModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default Navbar;

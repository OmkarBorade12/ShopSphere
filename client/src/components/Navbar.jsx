import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, LayoutDashboard, User, Package } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            padding: '1rem 2rem',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--primary)' }}>Shop</span>Sphere
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/" style={{ color: isActive('/') ? 'white' : 'var(--text-muted)', fontWeight: isActive('/') ? 'bold' : 'normal' }}>
                        Products
                    </Link>

                    {user?.role === 'admin' && (
                        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isActive('/admin') ? 'var(--accent)' : 'var(--text-muted)', fontWeight: isActive('/admin') ? 'bold' : 'normal' }}>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                    )}

                    {user?.role !== 'admin' && (
                        <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', color: isActive('/cart') ? 'white' : 'inherit' }}>
                            <ShoppingCart size={20} />
                            {cart.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem'
                                }}>
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                    )}

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {user.role !== 'admin' && (
                                <Link to="/orders" style={{ color: isActive('/orders') ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Package size={18} /> My Orders
                                </Link>
                            )}
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hello, {user.name}</span>
                            <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--danger)' }}>
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" className="btn" style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

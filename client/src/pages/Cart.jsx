import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import { Trash2, Plus, Minus } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsPaymentOpen(true);
    };

    const handlePaymentSubmit = async (data) => {
        try {
            const items = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
            await api.post('/orders', { items, paymentMethod: data.paymentMethod });
            clearCart();
            setIsPaymentOpen(false);
            addToast('Order placed successfully!', 'success');
            navigate('/my-orders');
        } catch (err) {
            addToast('Checkout failed: ' + (err.response?.data?.message || err.message), 'error');
            setIsPaymentOpen(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2>Your Cart is Empty</h2>
                <p style={{ color: 'var(--text-muted)' }}>Go add some products!</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h2 className="page-title">Your Cart</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.map((item) => (
                        <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '80px', height: '80px',
                                    background: '#333', borderRadius: '8px',
                                    overflow: 'hidden'
                                }}>
                                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{item.name}</h3>
                                    <p style={{ color: 'var(--accent)', margin: 0, fontWeight: 'bold' }}>${item.price}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--background)', padding: '0.25rem', borderRadius: '8px' }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        style={{ background: 'transparent', color: 'white', padding: '0.5rem', display: 'flex' }}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={{ background: 'transparent', color: 'white', padding: '0.5rem', display: 'flex' }}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button
                                    className="btn"
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.5rem' }}
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ height: 'fit-content' }}>
                    <h3>Summary</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onSubmit={handlePaymentSubmit}
                totalAmount={total}
            />
        </div>
    );
};

export default Cart;

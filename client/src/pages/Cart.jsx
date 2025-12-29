import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Cart = () => {
    const { cart, removeFromCart, clearCart, total } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const items = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
            await api.post('/orders', { items });
            clearCart();
            alert('Order placed successfully! Payment Processed (Dummy).');
            navigate('/');
        } catch (err) {
            alert('Checkout failed: ' + (err.response?.data?.message || err.message));
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
                            <div>
                                <h3>{item.name}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Quantity: {item.quantity}</p>
                                <p style={{ color: 'var(--accent)' }}>${item.price}</p>
                            </div>
                            <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
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
        </div>
    );
};

export default Cart;

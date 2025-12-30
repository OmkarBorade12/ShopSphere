import { useState, useEffect } from 'react';
import api from '../api';
import { Package, Truck, CheckCircle, XCircle, Clock, CreditCard, Banknote } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/myorders');
            setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        try {
            await api.put(`/orders/${id}/cancel`);
            addToast('Order cancelled successfully', 'success');
            fetchOrders();
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to cancel', 'error');
        }
    };

    const getStatusStep = (status) => {
        switch (status) {
            case 'pending': return 1;
            case 'processing': return 2;
            case 'shipped': return 3;
            case 'delivered': return 4;
            default: return 0;
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '3rem' }}>Loading...</div>;

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <h2 className="page-title">My Orders</h2>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {orders.map(order => {
                        const step = getStatusStep(order.status);
                        const isCancelled = order.status === 'cancelled';

                        return (
                            <div key={order.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ORDER PLACED</div>
                                        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>TOTAL</div>
                                        <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>${Number(order.totalAmount).toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>PAYMENT</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {order.paymentMethod === 'cod' ? <Banknote size={16} color="var(--success)" /> : <CreditCard size={16} color="var(--primary)" />}
                                            <span style={{ textTransform: 'uppercase', fontSize: '0.9rem' }}>{order.paymentMethod || 'Card'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ORDER ID</div>
                                        <div>#{order.id}</div>
                                    </div>
                                </div>

                                {/* Tracking UI */}
                                {!isCancelled && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2rem 0', position: 'relative' }}>
                                        {/* Progress Line */}
                                        <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
                                        <div style={{ position: 'absolute', top: '50%', left: '0', width: `${(step - 1) * 33}%`, height: '2px', background: 'var(--success)', zIndex: 0, transition: 'width 0.5s' }}></div>

                                        {['Pending', 'Processing', 'Shipped', 'Delivered'].map((label, idx) => {
                                            const active = (idx + 1) <= step;
                                            return (
                                                <div key={label} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)' }}>
                                                    <div style={{
                                                        width: '30px', height: '30px',
                                                        borderRadius: '50%',
                                                        background: active ? 'var(--success)' : 'var(--surface)',
                                                        border: `2px solid ${active ? 'var(--success)' : 'rgba(255,255,255,0.2)'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        {active && <CheckCircle size={16} color="white" />}
                                                    </div>
                                                    <span style={{ fontSize: '0.8rem', color: active ? 'white' : 'var(--text-muted)' }}>{label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {isCancelled && (
                                    <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <XCircle size={20} />
                                        Order Cancelled
                                    </div>
                                )}

                                <div>
                                    {order.OrderItems.map(item => (
                                        <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                                            <div style={{
                                                width: '60px', height: '60px',
                                                background: '#333', borderRadius: '6px',
                                                backgroundImage: item.Product?.imageUrl ? `url(${item.Product.imageUrl})` : 'none',
                                                backgroundSize: 'cover'
                                            }}></div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.Product?.name || 'Unknown Product'}</div>
                                                <div style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                                            </div>
                                            <div>${item.price}</div>
                                        </div>
                                    ))}
                                </div>

                                {!isCancelled && order.status === 'pending' && (
                                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                        <button onClick={() => handleCancel(order.id)} className="btn btn-danger">Cancel Order</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrders;

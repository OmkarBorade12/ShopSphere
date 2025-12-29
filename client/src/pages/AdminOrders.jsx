import { useState, useEffect } from 'react';
import api from '../api';
import { Truck, Check, X } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch orders');
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            fetchOrders();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
            <h2 className="page-title">Order Management</h2>
            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Order ID</th>
                            <th style={{ padding: '1rem' }}>User</th>
                            <th style={{ padding: '1rem' }}>Items</th>
                            <th style={{ padding: '1rem' }}>Total</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>#{order.id}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div>{order.User?.name || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.User?.email}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {order.OrderItems?.map(item => (
                                            <div key={item.id} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {item.Product?.imageUrl && (
                                                    <img
                                                        src={item.Product.imageUrl}
                                                        alt=""
                                                        style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }}
                                                    />
                                                )}
                                                <span style={{ color: 'white' }}>{item.Product?.name || 'Item'}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--accent)' }}>${order.totalAmount}</td>
                                <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        background:
                                            order.status === 'delivered' ? 'rgba(34, 197, 94, 0.2)' :
                                                order.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' :
                                                    order.status === 'shipped' ? 'rgba(99, 102, 241, 0.2)' :
                                                        'rgba(255, 255, 255, 0.1)',
                                        color:
                                            order.status === 'delivered' ? 'var(--success)' :
                                                order.status === 'cancelled' ? 'var(--danger)' :
                                                    order.status === 'shipped' ? 'var(--primary)' :
                                                        'white'
                                    }}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className="input-field"
                                        style={{ padding: '0.4rem', width: 'auto', fontSize: '0.9rem' }}
                                        disabled={order.status === 'cancelled'}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;

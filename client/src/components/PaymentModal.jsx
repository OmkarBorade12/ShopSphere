import { useState } from 'react';
import { X, CreditCard, Calendar, Lock } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onSubmit, totalAmount }) => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate processing only if necessary
        if (paymentMethod === 'card') {
            await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        setLoading(false);
        onSubmit({ ...paymentData, paymentMethod });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CreditCard size={20} color="var(--primary)" />
                        Checkout
                    </h3>
                    <button onClick={onClose} style={{ background: 'transparent', padding: '0.5rem', color: 'var(--text-muted)' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Amount</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>${Number(totalAmount).toFixed(2)}</div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Payment Method Selector */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={paymentMethod === 'card' ? 'btn btn-primary' : 'btn'}
                                style={paymentMethod === 'card'
                                    ? { flex: 1, padding: '0.75rem', fontSize: '0.9rem' }
                                    : { flex: 1, padding: '0.75rem', fontSize: '0.9rem', background: 'transparent', color: 'var(--text-muted)' }
                                }
                            >
                                Card
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('cod')}
                                className={paymentMethod === 'cod' ? 'btn btn-primary' : 'btn'}
                                style={paymentMethod === 'cod'
                                    ? { flex: 1, padding: '0.75rem', fontSize: '0.9rem' }
                                    : { flex: 1, padding: '0.75rem', fontSize: '0.9rem', background: 'transparent', color: 'var(--text-muted)' }
                                }
                            >
                                COD
                            </button>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="animate-fade-in">
                                <div className="input-group">
                                    <label className="input-label">Card Holder Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="John Doe"
                                        value={paymentData.name}
                                        onChange={e => setPaymentData({ ...paymentData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Card Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="0000 0000 0000 0000"
                                            maxLength="19"
                                            value={paymentData.cardNumber}
                                            onChange={e => setPaymentData({ ...paymentData, cardNumber: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })}
                                            required
                                        />
                                        <Lock size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group">
                                        <label className="input-label">Expiry Date</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                value={paymentData.expiry}
                                                onChange={e => setPaymentData({ ...paymentData, expiry: e.target.value })}
                                                required
                                            />
                                            <Calendar size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">CVV</label>
                                        <input
                                            type="password"
                                            className="input-field"
                                            placeholder="123"
                                            maxLength="3"
                                            value={paymentData.cvv}
                                            onChange={e => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '') })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'cod' && (
                            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
                                <p>You can pay via Cash/UPI on delivery.</p>
                                <p style={{ fontSize: '0.8rem' }}>Please ensure you have exact change if paying by cash.</p>
                            </div>
                        )}

                        <div style={{ marginTop: '2rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : paymentMethod === 'card' ? `Pay $${Number(totalAmount).toFixed(2)}` : 'Place Order'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;

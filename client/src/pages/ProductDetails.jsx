import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, ArrowLeft, Send } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error('Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        setSubmitting(true);
        try {
            await api.post(`/products/${id}/reviews`, { rating, comment });
            setComment('');
            fetchProduct(); // Refresh to see new review
        } catch (err) {
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (!product) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Product not found</div>;

    const averageRating = product.Reviews?.length
        ? (product.Reviews.reduce((sum, r) => sum + r.rating, 0) / product.Reviews.length).toFixed(1)
        : 'New';

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    fontSize: '0.9rem'
                }}
            >
                <ArrowLeft size={18} /> Back to Browse
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start', marginBottom: '4rem' }}>
                {/* Image */}
                <div style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--surface)',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No Image</div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <div style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {product.category}
                    </div>
                    <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', lineHeight: 1.1 }}>{product.name}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24' }}>
                            <Star fill="#fbbf24" size={20} />
                            <span style={{ marginLeft: '0.5rem', color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>{averageRating}</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ color: 'var(--text-muted)' }}>{product.Reviews?.length || 0} Reviews</span>
                    </div>

                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent)', marginBottom: '2rem' }}>
                        ${product.price}
                    </div>

                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '3rem' }}>
                        {product.description}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {user?.role !== 'admin' && (
                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 0}
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}
                            >
                                <ShoppingCart size={20} />
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div style={{ maxWidth: '800px' }}>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Customer Reviews</h3>

                {/* Review Form */}
                {user && user.role !== 'admin' ? (
                    <form onSubmit={handleSubmitReview} className="card" style={{ marginBottom: '3rem', padding: '2rem' }}>
                        <h4 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Write a Review</h4>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="input-label">Rating</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        style={{ background: 'transparent', padding: 0, color: star <= rating ? '#fbbf24' : 'var(--text-muted)' }}
                                    >
                                        <Star fill={star <= rating ? '#fbbf24' : 'none'} size={24} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Your Review</label>
                            <textarea
                                className="input-field"
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                required
                            />
                        </div>
                        <button type="submit" disabled={submitting} className="btn btn-primary">
                            <Send size={16} /> Submit Review
                        </button>
                    </form>
                ) : !user ? (
                    <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '3rem', borderStyle: 'dashed' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Please <a href="/login" style={{ color: 'var(--primary)' }}>login</a> to write a review.</p>
                    </div>
                ) : null}

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {product.Reviews?.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>}

                    {product.Reviews?.map(review => (
                        <div key={review.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--surface-hover)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '700', color: 'var(--primary)'
                                    }}>
                                        {review.User?.name?.[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{review.User?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} fill="#fbbf24" size={14} />)}
                                </div>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

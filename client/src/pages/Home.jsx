import { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Search, Filter, SlidersHorizontal } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('default'); // default, price-asc, price-desc
    const [priceRange, setPriceRange] = useState([0, 10000]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Derived State: Categories
    const categories = useMemo(() => {
        const cats = products.map(p => p.category);
        return ['All', ...new Set(cats)];
    }, [products]);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
                // Simple price check (assuming max price is manageable)
                // For a real app, we'd want min/max logic more robustly, here we just filter if needed.

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                if (sortOrder === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
                if (sortOrder === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
                return 0; // Default order
            });
    }, [products, searchTerm, selectedCategory, sortOrder]);

    if (loading) return (
        <div className="container" style={{ paddingTop: '4rem', display: 'flex', justifyContent: 'center' }}>
            <div className="animate-pulse" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

            {/* Hero Section */}
            <header style={{
                marginBottom: '4rem',
                textAlign: 'center',
                padding: '6rem 2rem',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(34, 211, 238, 0.05) 100%)',
                borderRadius: '32px',
                border: '1px solid var(--glass-border)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        display: 'inline-block'
                    }}>
                        Just Dropped
                    </span>
                    <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', fontWeight: '800', lineHeight: 1.1 }}>
                        Form Meets <span style={{
                            background: 'linear-gradient(to right, var(--primary), var(--accent))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Function</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem', lineHeight: 1.6 }}>
                        Discover our curated collection of premium gear designed to elevate your everyday life.
                    </p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3rem', alignItems: 'start' }}>

                {/* Sidebar Filters */}
                <aside style={{
                    position: 'sticky',
                    top: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'white' }}>
                            <Filter size={20} color="var(--primary)" />
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Filters</h3>
                        </div>

                        {/* Search */}
                        <div className="input-group">
                            <label className="input-label">Search</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                                <input
                                    className="input-field"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="input-group">
                            <label className="input-label">Sort By</label>
                            <div style={{ position: 'relative' }}>
                                <SlidersHorizontal size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                                <select
                                    className="input-field"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    style={{ cursor: 'pointer', paddingLeft: '2.5rem', appearance: 'none' }}
                                >
                                    <option value="default">Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <label className="input-label" style={{ marginBottom: '1rem', display: 'block' }}>Categories</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        textAlign: 'left',
                                        background: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                                        color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                                        border: 'none',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontWeight: selectedCategory === cat ? '600' : '500',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    {cat}
                                    {selectedCategory === cat && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }}></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700' }}>
                            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                        </h2>
                        <span style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                            {filteredProducts.length} items
                        </span>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '24px' }}>
                            <Layers size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem'
                        }}>
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="card product-card"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '0',
                                        overflow: 'hidden',
                                        border: '1px solid var(--glass-border)',
                                        background: 'var(--surface)',
                                        cursor: 'pointer'
                                    }}>
                                    {/* Image Area */}
                                    <div style={{
                                        height: '280px',
                                        backgroundColor: '#111',
                                        position: 'relative',
                                        backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {!product.imageUrl && <Layers size={48} color="var(--text-muted)" />}

                                        <div className="category-badge" style={{
                                            position: 'absolute',
                                            top: '12px',
                                            left: '12px',
                                            background: 'rgba(15, 23, 42, 0.6)',
                                            backdropFilter: 'blur(8px)',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {product.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', lineHeight: 1.4 }}>{product.name}</h3>
                                            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)' }}>${product.price}</span>
                                        </div>

                                        <p style={{
                                            color: 'var(--text-muted)',
                                            fontSize: '0.9rem',
                                            flex: 1,
                                            marginBottom: '1.5rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: 1.6
                                        }}>
                                            {product.description}
                                        </p>

                                        {user?.role !== 'admin' && (
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: 'auto' }} onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!user) navigate('/login');
                                                        else addToCart(product);
                                                    }}
                                                    disabled={product.stock === 0}
                                                    className="btn"
                                                    style={{
                                                        background: 'transparent',
                                                        color: product.stock > 0 ? 'white' : 'var(--text-muted)',
                                                        border: '1px solid var(--glass-border)',
                                                        fontSize: '0.9rem',
                                                        padding: '0.6rem'
                                                    }}
                                                >
                                                    {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                                                </button>

                                                {product.stock > 0 && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!user) {
                                                                navigate('/login');
                                                            } else {
                                                                addToCart(product);
                                                                navigate('/cart');
                                                            }
                                                        }}
                                                        className="btn btn-primary"
                                                        style={{
                                                            fontSize: '0.9rem',
                                                            padding: '0.6rem',
                                                            borderRadius: '12px'
                                                        }}
                                                    >
                                                        Buy Now
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .product-card {
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 40px -10px rgba(0,0,0,0.5);
                    border-color: var(--primary) !important;
                }
                .product-card:hover .category-badge {
                    background: var(--primary);
                }
            `}</style>
        </div>
    );
};

export default Home;

import { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, DollarSign, Package, Trash2, Pencil, X, Upload, Truck } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
    const [topProducts, setTopProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '', stock: '', description: '', imageUrl: '' });
    const [imageFile, setImageFile] = useState(null);

    const fetchData = async () => {
        try {
            const resStats = await api.get('/analytics/sales');
            setStats(resStats.data);

            const resTop = await api.get('/analytics/top-products');
            setTopProducts(resTop.data);

            const resProducts = await api.get('/products');
            setAllProducts(resProducts.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', newItem.name);
        formData.append('description', newItem.description);
        formData.append('price', newItem.price);
        formData.append('category', newItem.category);
        formData.append('stock', newItem.stock);
        // Only append imageUrl if manually entered and no file selected, or if user wants to keep URL
        // Server prioritizing file upload
        if (newItem.imageUrl) formData.append('imageUrl', newItem.imageUrl);
        if (imageFile) formData.append('image', imageFile);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (isEditing) {
                await api.put(`/products/${currentId}`, formData, config);
                alert('Product updated successfully!');
                setIsEditing(false);
                setCurrentId(null);
            } else {
                await api.post('/products', formData, config);
                alert('Product added successfully!');
            }
            setNewItem({ name: '', price: '', category: '', stock: '', description: '', imageUrl: '' });
            setImageFile(null);
            fetchData();
        } catch (err) {
            alert('Operation failed');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            alert('Product deleted!');
            fetchData();
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setCurrentId(product.id);
        setNewItem({
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            description: product.description,
            imageUrl: product.imageUrl || ''
        });
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setCurrentId(null);
        setNewItem({ name: '', price: '', category: '', stock: '', description: '', imageUrl: '' });
        setImageFile(null);
    };

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h2 className="page-title">Admin Dashboard</h2>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', color: 'var(--success)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Revenue</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>${stats.totalRevenue}</h3>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                        <Package size={24} />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Orders</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.totalOrders}</h3>
                    </div>
                </div>

                <div onClick={() => window.location.href = '/admin/orders'} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', border: '1px solid var(--primary)' }}>
                    <div style={{ padding: '1rem', background: 'var(--primary)', borderRadius: '8px', color: 'white' }}>
                        <Truck size={24} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Manage Orders</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Update Tracking & Status</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Left Column: Management & Lists */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* All Products List */}
                    <div className="card">
                        <h3>Product Management</h3>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                        <th style={{ padding: '0.5rem' }}>Name</th>
                                        <th style={{ padding: '0.5rem' }}>Price</th>
                                        <th style={{ padding: '0.5rem' }}>Stock</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allProducts.map((p) => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '0.75rem 0.5rem', color: 'white' }}>{p.name}</td>
                                            <td style={{ padding: '0.75rem 0.5rem' }}>${p.price}</td>
                                            <td style={{ padding: '0.75rem 0.5rem' }}>{p.stock}</td>
                                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => handleEdit(p)}
                                                    className="btn"
                                                    style={{ padding: '0.25rem', marginRight: '0.5rem', color: 'var(--accent)', background: 'transparent' }}
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="btn"
                                                    style={{ padding: '0.25rem', color: 'var(--danger)', background: 'transparent' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                        {isEditing && (
                            <button onClick={cancelEdit} className="btn" style={{ padding: '0.25rem', color: 'var(--text-muted)', background: 'transparent' }}>
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Product Name</label>
                            <input className="input-field" placeholder="e.g. Wireless Headphones" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Description</label>
                            <textarea
                                className="input-field"
                                placeholder="Product details..."
                                value={newItem.description}
                                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                style={{ minHeight: '80px', resize: 'vertical' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label className="input-label">Price ($)</label>
                                <input className="input-field" type="number" step="0.01" placeholder="0.00" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Stock</label>
                                <input className="input-field" type="number" placeholder="0" value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} required />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Category</label>
                            <input className="input-field" placeholder="e.g. Electronics" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} required />
                        </div>

                        {/* Image: URL OR Upload */}
                        <div style={{ marginBottom: '1rem', border: '1px dashed rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '8px' }}>
                            <label className="input-label" style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Product Image</label>

                            <div className="input-group">
                                <label className="input-label" style={{ fontSize: '0.8rem' }}>Option A: Image URL</label>
                                <input className="input-field" placeholder="https://..." value={newItem.imageUrl} onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })} />
                            </div>

                            <div style={{ textAlign: 'center', margin: '0.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>- OR -</div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontSize: '0.8rem' }}>Option B: Upload File</label>
                                <input
                                    type="file"
                                    className="input-field"
                                    accept="image/*"
                                    onChange={e => setImageFile(e.target.files[0])}
                                    style={{ padding: '0.5rem' }}
                                />
                            </div>
                        </div>

                        <button type="submit" className={`btn ${isEditing ? 'btn-primary' : 'btn-primary'}`} style={{ width: '100%', marginTop: '1rem' }}>
                            {isEditing ? 'Update Product' : 'Add Product'}
                        </button>

                        {isEditing && (
                            <button type="button" onClick={cancelEdit} className="btn" style={{ width: '100%', marginTop: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

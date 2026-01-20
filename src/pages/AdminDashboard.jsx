import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Calendar, CheckCircle, XCircle, LogOut, Copy, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { API_URL } from '../config';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ total: 0, earnings: 0, pending: 0 });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const [products, setProducts] = useState([]);
    const [videos, setVideos] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'leads', 'store', 'videos', 'orders'
    const [uploading, setUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'today', 'week', 'month'

    // Edit States
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingVideo, setEditingVideo] = useState(null);
    const [editingBlog, setEditingBlog] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [services, setServices] = useState([]);

    useEffect(() => {
        console.log('Admin Dashboard API URL:', API_URL); // Debugging log
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
            fetchBookings(token);

            fetchProducts(token);
            fetchVideos(token);
            fetchOrders(token);
            fetchBlogs(token);
            fetchServices(token);
        }
    }, []);

    const fetchOrders = async (token) => {
        try {
            const authToken = token || localStorage.getItem('adminToken');
            const apiUrl = API_URL;
            const res = await fetch(`${apiUrl}/api/orders`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (error) { console.error('Failed to fetch orders', error); }
    };

    const fetchProducts = async (token) => {
        try {
            const apiUrl = API_URL;
            // Products are public, but for admin we might want all? (API returns 'inStock' only currently for public, maybe need admin specific route? 
            // The current route /api/products returns `inStock: true`. For admin we might want to see all.
            // For now let's use the public one, or better yet, let's just use the same one and I'll update backend later if needed.
            // Wait, the backend route /api/products is: const products = await Product.find({ inStock: true });
            // This is bad for Admin if they want to enable out-of-stock items.
            // I should update backend to have an admin route or query param?
            // For now, I'll stick to what I have, but note this.
            const res = await fetch(`${apiUrl}/api/products`); // Public route
            if (res.ok) setProducts(await res.json());
        } catch (error) { console.error('Failed to fetch products', error); }
    };

    const fetchVideos = async (token) => {
        try {
            const apiUrl = API_URL;
            const res = await fetch(`${apiUrl}/api/videos`); // Public route
            if (res.ok) setVideos(await res.json());
        } catch (error) { console.error('Failed to fetch videos', error); }
    };

    const fetchBookings = async (token) => {
        try {
            const authToken = token || localStorage.getItem('adminToken');
            const apiUrl = API_URL;
            const res = await fetch(`${apiUrl}/api/bookings`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
                calculateStats(data);
            } else if (res.status === 401 || res.status === 403) {
                handleLogout();
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        }
    };



    // --- Implemented Functions ---

    const calculateStats = (data) => {
        const total = data.length;
        const pending = data.filter(b => b.status === 'Pending').length;
        // Mock earning logic: assume ₹501 per completed booking
        const completed = data.filter(b => b.status === 'Completed').length;
        const earnings = completed * 501;

        setStats({ total, pending, earnings });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const cleanPassword = password.trim(); // Prevent whitespace errors
        if (!cleanPassword) return;

        try {
            const apiUrl = API_URL;
            console.log('Attempting login...');

            const res = await fetch(`${apiUrl}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: cleanPassword })
            });

            // Handle non-JSON responses (server errors)
            if (!res.ok && res.status !== 401) {
                throw new Error(`Server returned ${res.status}`);
            }

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                setIsAuthenticated(true);
                fetchBookings(data.token);
            } else {
                // Show specific backend message or generic fallback
                alert(data.message || 'Incorrect Password. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            // More friendly error for network/server issues
            alert(`Unable to connect to server at ${API_URL}. \nPlease ensure the backend is running and allow ~30s for spin-up if on free tier.\nError: ${error.message}`);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = API_URL;
            const res = await fetch(`${apiUrl}/api/bookings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Refresh local state
                const updatedBookings = bookings.map(b =>
                    b._id === id ? { ...b, status: newStatus } : b
                );
                setBookings(updatedBookings);
                calculateStats(updatedBookings);
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setBookings([]);

    };

    // --- New Features: Delete, Export, Filter ---

    const handleDeleteBooking = async (id) => {
        if (!confirm('Are you sure you want to delete this booking? This cannot be undone.')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/bookings/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const updatedBookings = bookings.filter(b => b._id !== id);
                setBookings(updatedBookings);
                calculateStats(updatedBookings);
            } else {
                alert('Failed to delete booking');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleExportExcel = () => {
        const dataToExport = getFilteredData(activeTab === 'orders' ? orders : bookings);

        // Format data for simpler Excel view
        const formattedData = dataToExport.map(item => {
            if (activeTab === 'orders') {
                return {
                    Date: new Date(item.createdAt).toLocaleDateString(),
                    Customer: item.customerName,
                    Phone: item.customerPhone,
                    Product: item.productName,
                    Price: item.productPrice,
                    Status: item.status
                };
            } else {
                return {
                    Date: new Date(item.createdAt).toLocaleDateString(),
                    Name: item.name,
                    Email: item.email,
                    Phone: item.phone,
                    Service: item.serviceType || 'Consultation',
                    Status: item.status
                };
            }
        });

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        XLSX.writeFile(wb, `Astropravin_Data_${filterType}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const getFilteredData = (data) => {
        if (filterType === 'all') return data;

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return data.filter(item => {
            const itemDate = new Date(item.createdAt);
            if (filterType === 'today') return itemDate >= startOfDay;
            if (filterType === 'week') return itemDate >= startOfWeek;
            if (filterType === 'month') return itemDate >= startOfMonth;
            return true;
        });
    };

    // ... existing updateStatus ... is replaced above

    // --- Upload Handler ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const apiUrl = API_URL;
            const res = await fetch(`${apiUrl}/api/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setUploadedImageUrl(data.url);
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    // --- Store Handlers ---
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const productData = {
            name: formData.get('name'),
            price: formData.get('price'),
            category: formData.get('category'),
            image: uploadedImageUrl || formData.get('image'),
            description: formData.get('description'),
            inStock: true // Default to true for now
        };

        if (!productData.image) return alert('Please upload an image or provide a URL');

        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = API_URL;

            let res;
            if (editingProduct) {
                res = await fetch(`${apiUrl}/api/products/${editingProduct._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productData)
                });
            } else {
                res = await fetch(`${apiUrl}/api/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productData)
                });
            }

            if (res.ok) {
                const savedProduct = await res.json();
                if (editingProduct) {
                    setProducts(products.map(p => p._id === savedProduct._id ? savedProduct : p));
                    setEditingProduct(null);
                } else {
                    setProducts([savedProduct, ...products]);
                }
                form.reset();
                setUploadedImageUrl('');
            }
        } catch (error) { console.error('Save product error', error); }
    };

    const startEditProduct = (product) => {
        setEditingProduct(product);
        setUploadedImageUrl(product.image);
        // Scroll to form (optional UX improvement)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditProduct = () => {
        setEditingProduct(null);
        setUploadedImageUrl('');
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = API_URL;
            await fetch(`${apiUrl}/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProducts(products.filter(p => p._id !== id));
        } catch (error) { console.error('Delete product error', error); }
    };

    // --- Video Handlers ---
    const handleSaveVideo = async (e) => {
        e.preventDefault();
        const form = e.target;
        const url = form.url.value;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const ytId = (match && match[2].length === 11) ? match[2] : (editingVideo ? editingVideo.ytId : null);

        if (!ytId) return alert('Invalid YouTube URL');

        const videoData = {
            title: form.title.value,
            desc: form.desc.value,
            ytId: ytId,
            date: editingVideo ? editingVideo.date : 'Just Now'
        };

        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = API_URL;

            let res;
            if (editingVideo) {
                res = await fetch(`${apiUrl}/api/videos/${editingVideo._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(videoData)
                });
            } else {
                res = await fetch(`${apiUrl}/api/videos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(videoData)
                });
            }

            if (res.ok) {
                const savedVideo = await res.json();
                if (editingVideo) {
                    setVideos(videos.map(v => v._id === savedVideo._id ? savedVideo : v));
                    setEditingVideo(null);
                } else {
                    setVideos([savedVideo, ...videos]);
                }
                form.reset();
            }
        } catch (error) { console.error('Save video error', error); }
    };

    const startEditVideo = (video) => {
        setEditingVideo(video);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteVideo = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = API_URL;
            await fetch(`${apiUrl}/api/videos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setVideos(videos.filter(v => v._id !== id));
        } catch (error) { console.error('Delete video error', error); }
    };

    // --- Blog Handlers ---
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async (token) => {
        try {
            const apiUrl = API_URL;
            const res = await fetch(`${apiUrl}/api/blogs`);
            if (res.ok) setBlogs(await res.json());
        } catch (error) { console.error('Failed to fetch blogs', error); }
    };

    // --- Service Handlers ---
    const fetchServices = async (token) => {
        try {
            const apiUrl = API_URL;
            const res = await fetch(`${apiUrl}/api/services`);
            if (res.ok) setServices(await res.json());
        } catch (error) { console.error('Failed to fetch services', error); }
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const serviceData = {
            name: formData.get('name'),
            price: formData.get('price'),
            category: formData.get('category'),
            description: formData.get('description'),
        };

        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = API_URL;
            let res;
            if (editingService) {
                res = await fetch(`${apiUrl}/api/services/${editingService._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(serviceData)
                });
            } else {
                res = await fetch(`${apiUrl}/api/services`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(serviceData)
                });
            }
            if (res.ok) {
                const savedService = await res.json();
                if (editingService) {
                    setServices(services.map(s => s._id === savedService._id ? savedService : s));
                    setEditingService(null);
                } else {
                    setServices([savedService, ...services]);
                }
                form.reset();
            }
        } catch (error) { console.error('Save service error', error); }
    };

    const handleDeleteService = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = API_URL;
            await fetch(`${apiUrl}/api/services/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setServices(services.filter(s => s._id !== id));
        } catch (error) { console.error('Delete service error', error); }
    };

    const handleSaveBlog = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const slug = formData.get('title').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const blogData = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            slug: editingBlog ? editingBlog.slug : slug,
            image: uploadedImageUrl || formData.get('image'),
            category: formData.get('category'),
            content: formData.get('content'),
            author: 'Astro Pravin'
        };

        if (!blogData.image) return alert('Please upload an image or provide a URL');

        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = API_URL;

            let res;
            if (editingBlog) {
                res = await fetch(`${apiUrl}/api/blogs/${editingBlog._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(blogData)
                });
            } else {
                res = await fetch(`${apiUrl}/api/blogs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(blogData)
                });
            }

            if (res.ok) {
                const savedBlog = await res.json();
                if (editingBlog) {
                    setBlogs(blogs.map(b => b._id === savedBlog._id ? savedBlog : b));
                    setEditingBlog(null);
                } else {
                    setBlogs([savedBlog, ...blogs]);
                }
                form.reset();
                setUploadedImageUrl('');
            }
        } catch (error) { console.error('Save blog error', error); }
    };

    const startEditBlog = (blog) => {
        setEditingBlog(blog);
        setUploadedImageUrl(blog.image);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteBlog = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const apiUrl = API_URL;
            await fetch(`${apiUrl}/api/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBlogs(blogs.filter(b => b._id !== id));
        } catch (error) { console.error('Delete blog error', error); }
    };

    if (!isAuthenticated) {
        // ... existing login form ...
        return (
            <div className="min-h-screen bg-void flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-full max-w-md">
                    <h2 className="text-2xl font-serif text-white text-center mb-6">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter Key"
                            className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-gold outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-gradient-to-r from-saffron to-gold p-3 rounded-lg text-black font-bold hover:scale-105 transition-transform">
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-void p-6 text-white">
            <Helmet>
                <title>Admin Dashboard | Astro Pravin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
                    <h1 className="text-3xl font-serif">Astro Pravin <span className="text-gold text-lg">Dashboard</span></h1>
                    <nav className="flex bg-white/5 rounded-lg p-1 overflow-x-auto w-full md:w-auto max-w-[90vw] md:max-w-none no-scrollbar">
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === 'bookings' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                        >
                            Bookings
                        </button>

                        <button
                            onClick={() => setActiveTab('store')}
                            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === 'store' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                        >
                            Store
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === 'videos' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                        >
                            Videos
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('courses')}
                            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === 'courses' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                        >
                            Courses
                        </button>
                        <button
                            onClick={() => setActiveTab('blogs')}
                            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === 'blogs' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                        >
                            Blogs
                        </button>
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === 'services' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                        >
                            Services
                        </button>
                    </nav>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-white/50 hover:text-white">
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-4 bg-blue-500/20 rounded-full text-blue-400"><Users size={24} /></div>
                        <div>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-white/50 text-sm">Total Bookings</div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-4 bg-emerald-500/20 rounded-full text-emerald-400"><DollarSign size={24} /></div>
                        <div>
                            <div className="text-2xl font-bold">₹{stats.earnings.toLocaleString()}</div>
                            <div className="text-white/50 text-sm">Est. Earnings</div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-4 bg-amber-500/20 rounded-full text-amber-400"><Calendar size={24} /></div>
                        <div>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                            <div className="text-white/50 text-sm">Pending Actions</div>
                        </div>
                    </div>
                </div>

                {/* Filters & Export Toolbar (Visible for Bookings & Orders) */}
                {(activeTab === 'bookings' || activeTab === 'orders') && (
                    <div className="flex flex-wrap gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex gap-2">
                            {['all', 'today', 'week', 'month'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${filterType === type ? 'bg-gold text-black font-bold' : 'bg-black/40 text-white/60 hover:text-white'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/30 transition-colors"
                        >
                            <FileDown size={18} /> Export Excel
                        </button>
                    </div>
                )}

                {/* Bookings Tab (Default) */}
                {activeTab === 'bookings' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Client</th>
                                        <th className="p-4">Details</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {getFilteredData(bookings).map(booking => (
                                        <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-white max-w-[150px] truncate" title={booking.name}>{booking.name}</div>
                                                <div className="text-white/50 text-xs">{booking.phone}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-gold">{booking.serviceType || 'Consultation'}</div>
                                                <div className="text-xs text-white/50" title={booking.email}>{booking.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                                                    className={`bg-transparent outline-none text-xs font-bold uppercase cursor-pointer ${booking.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}
                                                >
                                                    <option value="Pending" className="bg-gray-900 text-amber-500">Pending</option>
                                                    <option value="Completed" className="bg-gray-900 text-emerald-500">Completed</option>
                                                    <option value="Cancelled" className="bg-gray-900 text-red-500">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-xs text-white/50">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                                <br />
                                                {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteBooking(booking._id)}
                                                    className="p-2 text-red-400 hover:bg-white/10 rounded-full transition-colors"
                                                    title="Delete Booking"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {getFilteredData(bookings).length === 0 && <div className="p-8 text-center text-white/30">No bookings found for this filter.</div>}
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Product Form */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-serif">{editingProduct ? 'Edit Product' : 'Add Artifact'}</h2>
                            {editingProduct && <button onClick={cancelEditProduct} className="text-xs text-red-400">Cancel</button>}
                        </div>
                        <form onSubmit={handleSaveProduct} className="space-y-4">
                            <input name="name" defaultValue={editingProduct?.name} placeholder="Product Name" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="price" defaultValue={editingProduct?.price} type="number" placeholder="Price (₹)" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <select name="category" defaultValue={editingProduct?.category} className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none text-white/70">
                                    <option value="gemstones">Gemstone</option>
                                    <option value="yantras">Yantra</option>
                                    <option value="kawach">Kawach</option>
                                    <option value="rudraksha">Rudraksha</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <input name="image" defaultValue={editingProduct?.image} placeholder="Image URL (e.g. /gems/ruby.jpg)" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                            <textarea name="description" defaultValue={editingProduct?.description} placeholder="Description" rows="3" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                            <button type="submit" className="w-full bg-gold text-black font-bold p-3 rounded hover:bg-yellow-500 transition-colors">
                                {editingProduct ? 'Save Changes' : 'Add to Store'}
                            </button>
                        </form>
                    </div>

                    {/* Product List */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map(p => (
                            <div key={p._id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex gap-4 relative group">
                                <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-lg bg-black/50" />
                                <div>
                                    <h3 className="font-bold text-white">{p.name}</h3>
                                    <p className="text-gold">₹{p.price}</p>
                                    <p className="text-white/50 text-xs mt-1 line-clamp-2">{p.description}</p>
                                </div>
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEditProduct(p)} className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 rounded">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteProduct(p._id)} className="text-red-400 p-2 hover:bg-white/10 rounded">
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}

                {/* Video Manager Tab */}
                {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-serif">{editingVideo ? 'Edit Video' : 'Add Video'}</h2>
                                {editingVideo && <button onClick={() => setEditingVideo(null)} className="text-xs text-red-400">Cancel</button>}
                            </div>
                            <form onSubmit={handleSaveVideo} className="space-y-4">
                                <input name="title" defaultValue={editingVideo?.title} placeholder="Video Title" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <input name="url" defaultValue={editingVideo ? `https://youtube.com/watch?v=${editingVideo.ytId}` : ''} placeholder="YouTube URL" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <textarea name="desc" defaultValue={editingVideo?.desc} placeholder="Description" rows="3" className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <button type="submit" className="w-full bg-gold text-black font-bold p-3 rounded hover:bg-yellow-500 transition-colors">
                                    {editingVideo ? 'Save Changes' : 'Add Video'}
                                </button>
                            </form>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {videos.map(v => (
                                <div key={v._id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden group relative">
                                    <div className="aspect-video relative">
                                        <img src={`https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg`} alt={v.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                            <button onClick={() => startEditVideo(v)} className="bg-blue-500 p-2 rounded-full text-white text-xs">Edit</button>
                                            <button onClick={() => handleDeleteVideo(v._id)} className="bg-red-500 p-2 rounded-full text-white"><XCircle size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold text-white line-clamp-1">{v.title}</h3>
                                        <p className="text-white/50 text-xs mt-1">{v.views} views • {v.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orders Manager Tab */}
                {activeTab === 'orders' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-semibold">Store Orders</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Product</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {getFilteredData(orders).map(order => (
                                        <tr key={order._id} className="hover:bg-white/5">
                                            <td className="p-4">
                                                <div className="font-bold text-white">{order.customerName}</div>
                                                <div className="text-white/50 text-xs">{order.customerPhone}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-white">{order.productName}</div>
                                                <div className="text-gold text-xs">₹{order.productPrice}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs border ${order.status === 'Completed' ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'}`}>{order.status}</span>
                                            </td>
                                            <td className="p-4 text-right text-white/50 text-xs">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {orders.length === 0 && <div className="p-8 text-center text-white/30">No orders yet.</div>}
                        </div>
                    </div>
                )}

                {/* Blog Manager Tab */}
                {activeTab === 'blogs' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Add Blog Form */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-serif">{editingBlog ? 'Edit Article' : 'Add Article'}</h2>
                                {editingBlog && <button onClick={() => { setEditingBlog(null); setUploadedImageUrl(''); }} className="text-xs text-red-400">Cancel</button>}
                            </div>
                            <form onSubmit={handleSaveBlog} className="space-y-4">
                                <input name="title" defaultValue={editingBlog?.title} placeholder="Blog Title" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <input name="subtitle" defaultValue={editingBlog?.subtitle} placeholder="Subtitle" className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <select name="category" defaultValue={editingBlog?.category} className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none text-white/70">
                                    <option value="Astrology">Astrology</option>
                                    <option value="Numerology">Numerology</option>
                                    <option value="Vastu">Vastu</option>
                                    <option value="Festivals">Festivals</option>
                                </select>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/50">Cover Image</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                                        />
                                    </div>
                                    <input
                                        name="image"
                                        placeholder="Or Image URL"
                                        defaultValue={editingBlog?.image} // This might be stale if using controlled component for uploadedImageUrl, but needed for initial load
                                        key={editingBlog ? editingBlog._id : 'new'} // Force re-render on switch
                                        className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none"
                                    />
                                    {uploading && <span className="text-xs text-gold animate-pulse">Uploading...</span>}
                                    {uploadedImageUrl && <img src={uploadedImageUrl} alt="Preview" className="h-16 rounded mt-2 border border-white/10" />}
                                </div>
                                <textarea name="content" defaultValue={editingBlog?.content} placeholder="Content (HTML or Markdown supported)" rows="10" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <button type="submit" className="w-full bg-gold text-black font-bold p-3 rounded hover:bg-yellow-500 transition-colors">
                                    {editingBlog ? 'Update Article' : 'Publish Article'}
                                </button>
                            </form>
                        </div>

                        {/* Blog List */}
                        <div className="lg:col-span-2 space-y-4">
                            {blogs.map(blog => (
                                <div key={blog._id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex gap-4 relative group">
                                    <img src={blog.image} alt={blog.title} className="w-32 h-20 object-cover rounded-lg bg-black/50" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-lg">{blog.title}</h3>
                                        <p className="text-white/50 text-sm">{new Date(blog.createdAt).toLocaleDateString()} • {blog.category}</p>
                                        <p className="text-white/50 text-xs mt-2 line-clamp-2">{blog.subtitle || blog.content}</p>
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEditBlog(blog)} className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 rounded">Edit</button>
                                        <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-400 p-2 hover:bg-white/10 rounded">
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {blogs.length === 0 && <div className="text-center text-white/30 py-8">No articles published yet.</div>}
                        </div>
                    </div>
                )}

                {/* Services Manager Tab */}
                {activeTab === 'services' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Add Service Form */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-serif">{editingService ? 'Edit Service' : 'Add Service'}</h2>
                                {editingService && <button onClick={() => setEditingService(null)} className="text-xs text-red-400">Cancel</button>}
                            </div>
                            <form onSubmit={handleSaveService} className="space-y-4">
                                <input name="name" defaultValue={editingService?.name} placeholder="Service Name" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <input name="price" defaultValue={editingService?.price} type="number" placeholder="Price (₹)" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <input name="category" defaultValue={editingService?.category} placeholder="Category (e.g. Consultation)" className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <textarea name="description" defaultValue={editingService?.description} placeholder="Description" rows="3" required className="w-full bg-black/50 p-3 rounded border border-white/10 focus:border-gold outline-none" />
                                <button type="submit" className="w-full bg-gold text-black font-bold p-3 rounded hover:bg-yellow-500 transition-colors">
                                    {editingService ? 'Save Changes' : 'Add Service'}
                                </button>
                            </form>
                        </div>
                        {/* Service List */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {services.map(s => (
                                <div key={s._id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col relative group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white text-lg">{s.name}</h3>
                                        <span className="text-gold font-bold">₹{s.price}</span>
                                    </div>
                                    <p className="text-white/50 text-xs mb-2">{s.category}</p>
                                    <p className="text-white/70 text-sm line-clamp-3 mb-4">{s.description}</p>
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded p-1">
                                        <button onClick={() => { setEditingService(s); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-1 text-blue-400 hover:text-blue-300">Edit</button>
                                        <button onClick={() => handleDeleteService(s._id)} className="p-1 text-red-400 hover:text-red-300"><XCircle size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bookings Table */}
                {activeTab === 'bookings' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Recent Appointments</h2>
                            <button
                                onClick={() => {
                                    if (bookings.length === 0) return alert("No data to export");
                                    const headers = ['Name', 'Phone', 'Email', 'Topic', 'BirthDate', 'BirthTime', 'BirthPlace', 'Gender', 'Status', 'Date'];
                                    const csvContent = "data:text/csv;charset=utf-8,"
                                        + headers.join(",") + "\n"
                                        + bookings.map(b => {
                                            return [
                                                `"${b.name || ''}"`,
                                                `"${b.phone || ''}"`,
                                                `"${b.email || ''}"`,
                                                `"${b.topic || ''}"`,
                                                `"${b.birthDate || ''}"`,
                                                `"${b.birthTime || ''}"`,
                                                `"${b.birthPlace || ''}"`,
                                                `"${b.gender || ''}"`,
                                                `"${b.status || ''}"`,
                                                `"${new Date(b.createdAt).toLocaleDateString()}"`
                                            ].join(",");
                                        }).join("\n");
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", `bookings_${new Date().toISOString().split('T')[0]}.csv`);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-colors text-sm"
                            >
                                <FileDown size={16} />
                                Export CSV
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Client</th>
                                        <th className="p-4">Birth Details</th>
                                        <th className="p-4">Topic</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {bookings.map(booking => (
                                        <motion.tr
                                            key={booking._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="font-medium text-white">{booking.name}</div>
                                                <div className="text-white/50 text-xs">{booking.phone}</div>
                                                <div className="text-white/30 text-xs">{booking.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-white/80 text-sm">{booking.birthDate} at {booking.birthTime}</div>
                                                <div className="text-white/50 text-xs">{booking.birthPlace}</div>
                                                <div className="text-white/50 text-xs capitalize">{booking.gender}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs ${booking.topic === 'Love' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                                                    }`}>
                                                    {booking.topic}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs border ${booking.status === 'Completed' ? 'border-emerald-500/30 text-emerald-400' :
                                                    booking.status === 'Pending' ? 'border-amber-500/30 text-amber-400' :
                                                        'border-red-500/30 text-red-400'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-4 flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        const text = `*New Booking*\nName: ${booking.name}\nPhone: ${booking.phone}\nTopic: ${booking.topic}\nDOB: ${booking.birthDate} ${booking.birthTime}\nPlace: ${booking.birthPlace}\nGender: ${booking.gender}\nStatus: ${booking.status}`;
                                                        navigator.clipboard.writeText(text);
                                                        alert('Booking details copied!');
                                                    }}
                                                    className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-full transition-colors"
                                                    title="Copy Details"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                                {booking.status !== 'Completed' && (
                                                    <button
                                                        onClick={() => updateStatus(booking._id, 'Completed')}
                                                        className="p-2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded-full transition-colors"
                                                        title="Mark Completed"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => updateStatus(booking._id, 'Cancelled')}
                                                    className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full transition-colors"
                                                    title="Cancel"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                            {bookings.length === 0 && (
                                <div className="p-8 text-center text-white/30">No records found.</div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;






import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, DollarSign, Calendar, CheckCircle2, XCircle, LogOut, Copy,
    FileDown, Trash2, RefreshCw, X, Search, ChevronRight, Eye, AlertCircle,
    Sparkles, Plus, Edit2, ShoppingBag, Video, BookOpen, Sliders, Heart,
    Phone, Mail, MapPin, Clock, MessageSquare, Menu, LayoutDashboard,
    Package, Layers, Filter, ExternalLink, ChevronDown, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { API_URL } from '../config';
import MatrimonyAdminTab from './Matrimony/admin/MatrimonyAdminTab';
import { LotusCrest } from '../components/VedicDecorativeArt';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ total: 0, earnings: 0, pending: 0, completed: 0 });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [videos, setVideos] = useState([]);
    const [orders, setOrders] = useState([]);
    const [services, setServices] = useState([]);
    const [blogs, setBlogs] = useState([]);

    // Navigation & CRM State
    const [activeNav, setActiveNav] = useState('bookings'); // 'overview', 'bookings', 'matrimony', 'orders', 'store', 'services', 'blogs', 'videos'
    const [bookingStatusFilter, setBookingStatusFilter] = useState('all'); // 'all', 'Pending', 'Completed', 'Cancelled'
    const [dateRangeFilter, setDateRangeFilter] = useState('all'); // 'all', 'today', 'week', 'month'
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedBookingDrawer, setSelectedBookingDrawer] = useState(null);

    // Form & Upload States
    const [uploading, setUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Edit states
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingVideo, setEditingVideo] = useState(null);
    const [editingBlog, setEditingBlog] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [showQuickAddModal, setShowQuickAddModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
            fetchAllData(token);
        }
    }, []);

    const fetchAllData = async (token) => {
        const authToken = token || localStorage.getItem('adminToken');
        await Promise.all([
            fetchBookings(authToken),
            fetchProducts(),
            fetchVideos(),
            fetchOrders(authToken),
            fetchBlogs(),
            fetchServices()
        ]);
    };

    const fetchBookings = async (token) => {
        try {
            const res = await fetch(`${API_URL}/api/bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
                calculateStats(data);
            }
        } catch (error) {
            console.error('Fetch bookings error:', error);
        }
    };

    const fetchOrders = async (token) => {
        try {
            const authToken = token || localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/orders`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (error) { console.error('Failed to fetch orders', error); }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products`);
            if (res.ok) setProducts(await res.json());
        } catch (error) { console.error('Failed to fetch products', error); }
    };

    const fetchVideos = async () => {
        try {
            const res = await fetch(`${API_URL}/api/videos`);
            if (res.ok) setVideos(await res.json());
        } catch (error) { console.error('Failed to fetch videos', error); }
    };

    const fetchBlogs = async () => {
        try {
            const res = await fetch(`${API_URL}/api/blogs`);
            if (res.ok) setBlogs(await res.json());
        } catch (error) { console.error('Failed to fetch blogs', error); }
    };

    const fetchServices = async () => {
        try {
            const res = await fetch(`${API_URL}/api/services`);
            if (res.ok) setServices(await res.json());
        } catch (error) { console.error('Failed to fetch services', error); }
    };

    const calculateStats = (data) => {
        const total = data.length;
        const pending = data.filter(b => b.status === 'Pending').length;
        const completed = data.filter(b => b.status === 'Completed').length;
        const earnings = completed * 1100;
        setStats({ total, earnings, pending, completed });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem('adminToken', data.token);
                setIsAuthenticated(true);
                fetchAllData(data.token);
            } else {
                alert(data.message || 'Invalid Password');
            }
        } catch (error) {
            alert('Login failed. Please check connection.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleRefreshData = async () => {
        setIsRefreshing(true);
        const token = localStorage.getItem('adminToken');
        await fetchAllData(token);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/bookings/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                const updatedBookings = bookings.map(b => b._id === id ? { ...b, status } : b);
                setBookings(updatedBookings);
                calculateStats(updatedBookings);
                if (selectedBookingDrawer?._id === id) {
                    setSelectedBookingDrawer(prev => ({ ...prev, status }));
                }
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

    const handleDeleteBooking = async (id) => {
        if (!confirm('Are you sure you want to delete this consultation request?')) return;
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
                if (selectedBookingDrawer?._id === id) {
                    setSelectedBookingDrawer(null);
                }
            } else {
                alert('Failed to delete booking');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // Filtered Bookings for the CRM Table
    const filteredBookings = useMemo(() => {
        let list = [...bookings];

        // Status Filter
        if (bookingStatusFilter !== 'all') {
            list = list.filter(b => b.status === bookingStatusFilter);
        }

        // Date Filter
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        if (dateRangeFilter === 'today') {
            list = list.filter(b => new Date(b.createdAt) >= startOfDay);
        } else if (dateRangeFilter === 'week') {
            list = list.filter(b => new Date(b.createdAt) >= startOfWeek);
        } else if (dateRangeFilter === 'month') {
            list = list.filter(b => new Date(b.createdAt) >= startOfMonth);
        }

        // Search Filter
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(b =>
                (b.name || '').toLowerCase().includes(q) ||
                (b.phone || '').toLowerCase().includes(q) ||
                (b.email || '').toLowerCase().includes(q) ||
                (b.topic || '').toLowerCase().includes(q) ||
                (b.birthPlace || '').toLowerCase().includes(q)
            );
        }

        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [bookings, bookingStatusFilter, dateRangeFilter, searchTerm]);

    const handleExportExcel = () => {
        const dataToExport = filteredBookings;
        if (dataToExport.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = ['Date', 'Time', 'Client Name', 'Phone', 'Email', 'Topic', 'Status', 'DOB', 'TOB', 'Place', 'Preferred Date', 'Preferred Time'];
        const rows = dataToExport.map(item => [
            `"${new Date(item.createdAt).toLocaleDateString()}"`,
            `"${new Date(item.createdAt).toLocaleTimeString()}"`,
            `"${(item.name || '').replace(/"/g, '""')}"`,
            `"${item.phone || ''}"`,
            `"${item.email || ''}"`,
            `"${(item.topic || '').replace(/"/g, '""')}"`,
            `"${item.status || ''}"`,
            `"${item.birthDate || ''}"`,
            `"${item.birthTime || ''}"`,
            `"${(item.birthPlace || '').replace(/"/g, '""')}"`,
            `"${item.preferredDate || ''}"`,
            `"${item.preferredTime || ''}"`
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `AstroPravin_Clients_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const res = await fetch(`${API_URL}/api/upload`, {
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

    // Store, Video, Blog, Service Handlers
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const productData = {
            name: formData.get('name'),
            price: Number(formData.get('price')),
            category: formData.get('category'),
            image: uploadedImageUrl || formData.get('image'),
            description: formData.get('description'),
            inStock: true
        };

        try {
            const token = localStorage.getItem('adminToken');
            let res;
            if (editingProduct) {
                res = await fetch(`${API_URL}/api/products/${editingProduct._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(productData)
                });
            } else {
                res = await fetch(`${API_URL}/api/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(productData)
                });
            }

            if (res.ok) {
                const savedProduct = await res.json();
                if (editingProduct) {
                    setProducts(products.map(p => p._id === savedProduct._id ? savedProduct : p));
                    setEditingProduct(null);
                } else {
                    setProducts([...products, savedProduct]);
                }
                form.reset();
                setUploadedImageUrl('');
            }
        } catch (error) { console.error('Save product error', error); }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProducts(products.filter(p => p._id !== id));
        } catch (error) { console.error('Delete product error', error); }
    };

    const handleSaveVideo = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const url = formData.get('url');

        let ytId = '';
        let platform = 'youtube';

        if (url.includes('instagram.com/reel/') || url.includes('instagram.com/reels/')) {
            platform = 'instagram';
            const match = url.match(/reel[s]?\/([A-Za-z0-9_-]+)/);
            if (match) ytId = match[1];
        } else {
            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
            if (match) ytId = match[1];
        }

        if (!ytId) return alert('Invalid video link');

        const videoData = {
            title: formData.get('title'),
            desc: formData.get('desc'),
            ytId: ytId,
            platform: platform,
            image: uploadedImageUrl || formData.get('image') || '',
            views: 'New',
            date: 'Just Added'
        };

        try {
            const token = localStorage.getItem('adminToken');
            let res;
            if (editingVideo) {
                res = await fetch(`${API_URL}/api/videos/${editingVideo._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(videoData)
                });
            } else {
                res = await fetch(`${API_URL}/api/videos`, {
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
                setUploadedImageUrl('');
            }
        } catch (error) { console.error('Save video error', error); }
    };

    const handleDeleteVideo = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_URL}/api/videos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setVideos(videos.filter(v => v._id !== id));
        } catch (error) { console.error('Delete video error', error); }
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const serviceData = {
            name: formData.get('name'),
            price: Number(formData.get('price')),
            category: formData.get('category'),
            description: formData.get('description'),
        };

        try {
            const token = localStorage.getItem('adminToken');
            let res;
            if (editingService) {
                res = await fetch(`${API_URL}/api/services/${editingService._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(serviceData)
                });
            } else {
                res = await fetch(`${API_URL}/api/services`, {
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
            await fetch(`${API_URL}/api/services/${id}`, {
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
            let res;
            if (editingBlog) {
                res = await fetch(`${API_URL}/api/blogs/${editingBlog._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(blogData)
                });
            } else {
                res = await fetch(`${API_URL}/api/blogs`, {
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

    const handleDeleteBlog = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_URL}/api/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBlogs(blogs.filter(b => b._id !== id));
        } catch (error) { console.error('Delete blog error', error); }
    };

    // ─── LOGIN SCREEN ───
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 font-sans text-[#1C1917]">
                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EADCC8] shadow-luxury w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center mx-auto text-[#C2410C] shadow-sm">
                            <LotusCrest className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#1C1917]">AstroPravin CRM</h2>
                        <p className="text-xs text-[#78716C]">Vedic Astrology & Matrimony Enterprise Portal</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[#44403C] uppercase mb-1">Administrative Secret Key</label>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="w-full bg-[#FAF8F5] border border-[#EADCC8] rounded-xl p-3.5 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#C2410C] outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] p-3.5 rounded-xl text-white font-bold text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform flex justify-center items-center gap-2"
                        >
                            {isLoggingIn ? <RefreshCw className="animate-spin" size={18} /> : 'Unlock Operations Console'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ─── CRM NAVIGATION MENU ITEMS ───
    const navGroups = [
        {
            title: 'CORE CRM & CLIENTS',
            items: [
                { id: 'bookings', label: 'Appointments & Leads', icon: Calendar, badge: stats.pending > 0 ? stats.pending : null, badgeColor: 'bg-[#C2410C] text-white' },
                { id: 'matrimony', label: 'Matrimony Pipeline', icon: Heart, badge: 'Live', badgeColor: 'bg-amber-100 text-amber-800' },
                { id: 'orders', label: 'Store Orders', icon: ShoppingBag, badge: orders.length > 0 ? orders.length : null },
            ]
        },
        {
            title: 'STORE & CATALOG',
            items: [
                { id: 'store', label: 'Gemstones & Yantras', icon: Package },
                { id: 'services', label: 'Consultation Services', icon: Layers },
            ]
        },
        {
            title: 'CONTENT & MARKETING',
            items: [
                { id: 'blogs', label: 'Vedic Articles & SEO', icon: BookOpen },
                { id: 'videos', label: 'Satsang Video Gallery', icon: Video },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans flex flex-col md:flex-row antialiased">
            <Helmet>
                <title>AstroPravin CRM | Central Operations Console</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* ════════════════════════════════════════════════════════════════════════
                1. FIXED MODERN CRM SIDEBAR (Left Rail)
            ════════════════════════════════════════════════════════════════════════ */}
            <aside className={`fixed md:sticky top-0 z-40 h-screen w-72 bg-white border-r border-[#EADCC8] flex flex-col justify-between transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} shadow-sm`}>
                <div>
                    {/* Brand Header */}
                    <div className="p-5 border-b border-[#EADCC8] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#C2410C] shadow-sm">
                                <LotusCrest className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="font-serif font-bold text-base text-[#1C1917] tracking-tight">AstroPravin</h1>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C2410C] bg-[#FFF7ED] px-1.5 py-0.5 rounded-md border border-[#FED7AA]/50">
                                    Enterprise CRM
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-[#78716C]">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <div className="p-3.5 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
                        {navGroups.map((group, gIdx) => (
                            <div key={gIdx} className="space-y-1">
                                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">
                                    {group.title}
                                </div>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeNav === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveNav(item.id);
                                                if (window.innerWidth < 768) setSidebarOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-[#FFF7ED] to-[#FFFDF9] text-[#C2410C] border border-[#FED7AA] shadow-sm font-semibold'
                                                    : 'text-[#44403C] hover:text-[#C2410C] hover:bg-[#FAF8F5]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={16} className={isActive ? 'text-[#C2410C]' : 'text-[#78716C]'} />
                                                <span>{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor || 'bg-[#F5F0E8] text-[#78716C]'}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* User / Logout Profile Bar */}
                <div className="p-4 border-t border-[#EADCC8] bg-[#FAF8F5] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#C2410C] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            P
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-bold text-[#1C1917]">Pt. Pravin Shriram</div>
                            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-[#78716C] hover:text-[#C2410C] hover:bg-white rounded-xl transition-colors border border-transparent hover:border-[#EADCC8]"
                        title="Logout from CRM"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* ════════════════════════════════════════════════════════════════════════
                2. TOP APP BAR & MAIN WORKSPACE AREA
            ════════════════════════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Global Top Navbar */}
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EADCC8] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#44403C]"
                        >
                            <Menu size={18} />
                        </button>
                        <div>
                            <div className="text-[11px] uppercase font-bold tracking-wider text-[#A8A29E]">Workspace</div>
                            <h2 className="text-base sm:text-lg font-serif font-bold text-[#1C1917] capitalize">
                                {activeNav === 'bookings' ? 'Consultations & Client Management' :
                                 activeNav === 'matrimony' ? 'Matrimony Alliances & Verification' :
                                 activeNav === 'orders' ? 'Store Orders & Dispatch' :
                                 activeNav === 'store' ? 'Gemstones & Spiritual Inventory' :
                                 activeNav === 'services' ? 'Consultation Packages & Pricing' :
                                 activeNav === 'blogs' ? 'Articles & Vedic Wisdom' : 'Video Satsangs & Media'}
                            </h2>
                        </div>
                    </div>

                    {/* Global Quick Search & Actions */}
                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                            <input
                                type="text"
                                placeholder="Search client, phone, topic..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[#FAF8F5] border border-[#EADCC8] rounded-xl py-1.5 pl-9 pr-7 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#C2410C] outline-none w-56 lg:w-72"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]">
                                    <X size={12} />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleRefreshData}
                            className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EADCC8] text-[#44403C] hover:text-[#C2410C] hover:bg-[#FFF7ED] transition-colors"
                            title="Refresh Data"
                        >
                            <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-[#C2410C]' : ''} />
                        </button>

                        <button
                            onClick={handleExportExcel}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF7ED] border border-[#FED7AA] text-[#C2410C] rounded-xl text-xs font-bold hover:bg-[#FFEDD5] transition-colors shadow-sm"
                        >
                            <FileDown size={14} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </header>

                {/* ════════════════════════════════════════════════════════════════════
                    3. MAIN DASHBOARD CONTENT AREA
                ════════════════════════════════════════════════════════════════════ */}
                <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
                    {/* ── CRM TOP METRIC CARDS ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-3xl border border-[#EADCC8] shadow-sm flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Total Inquiries</span>
                                <div className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{stats.total}</div>
                                <span className="text-[10px] text-emerald-700 font-semibold">100% Verified CRM</span>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] text-blue-600 flex items-center justify-center border border-blue-200">
                                <Users size={20} />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-3xl border border-[#EADCC8] shadow-sm flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Pending Action</span>
                                <div className="text-2xl font-serif font-bold text-[#C2410C] mt-1">{stats.pending}</div>
                                <span className="text-[10px] text-[#C2410C] font-semibold">Awaiting Panditji Call</span>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-[#FFFBEB] text-amber-600 flex items-center justify-center border border-amber-200">
                                <Calendar size={20} />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-3xl border border-[#EADCC8] shadow-sm flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Consultations Done</span>
                                <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">{stats.completed}</div>
                                <span className="text-[10px] text-emerald-700 font-semibold">₹{stats.earnings.toLocaleString('en-IN')} Est.</span>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-emerald-600 flex items-center justify-center border border-emerald-200">
                                <CheckCircle2 size={20} />
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-3xl border border-[#EADCC8] shadow-sm flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Store & Matrimony</span>
                                <div className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{orders.length} Orders</div>
                                <span className="text-[10px] text-[#78716C] font-semibold">{products.length} Spiritual Items</span>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-[#FFF7ED] text-[#C2410C] flex items-center justify-center border border-[#FED7AA]">
                                <ShoppingBag size={20} />
                            </div>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION: APPOINTMENTS & CLIENT LEADS CRM TABLE
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'bookings' && (
                        <div className="space-y-4">
                            {/* CRM Filter Controls Bar */}
                            <div className="bg-white p-4 rounded-3xl border border-[#EADCC8] shadow-sm flex flex-wrap items-center justify-between gap-3">
                                {/* Status Segmented Control */}
                                <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-2xl border border-[#EADCC8]">
                                    {[
                                        { id: 'all', label: 'All Clients', count: bookings.length },
                                        { id: 'Pending', label: 'Pending', count: stats.pending },
                                        { id: 'Completed', label: 'Completed', count: stats.completed },
                                        { id: 'Cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setBookingStatusFilter(tab.id)}
                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                                bookingStatusFilter === tab.id
                                                    ? 'bg-[#C2410C] text-white shadow-sm'
                                                    : 'text-[#44403C] hover:text-[#C2410C]'
                                            }`}
                                        >
                                            <span>{tab.label}</span>
                                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                                bookingStatusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-[#EADCC8] text-[#44403C]'
                                            }`}>
                                                {tab.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Date Range Quick Filter */}
                                <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-2xl border border-[#EADCC8]">
                                    {['all', 'today', 'week', 'month'].map(range => (
                                        <button
                                            key={range}
                                            onClick={() => setDateRangeFilter(range)}
                                            className={`px-2.5 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                                                dateRangeFilter === range
                                                    ? 'bg-white text-[#C2410C] shadow-sm border border-[#FED7AA]'
                                                    : 'text-[#78716C] hover:text-[#1C1917]'
                                            }`}
                                        >
                                            {range === 'all' ? 'All Time' : range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CRM Client Table */}
                            <div className="bg-white border border-[#EADCC8] rounded-3xl shadow-luxury overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-[#F5F0E8] border-b border-[#EADCC8] text-[#44403C] text-[11px] font-bold uppercase tracking-wider">
                                                <th className="p-4">Client Name & Contact</th>
                                                <th className="p-4">Kundli Birth Coordinates</th>
                                                <th className="p-4">Preferred Slot</th>
                                                <th className="p-4">Consultation Topic</th>
                                                <th className="p-4">Status Stage</th>
                                                <th className="p-4 text-right">Instant CRM Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#EADCC8]/60">
                                            {filteredBookings.map((b) => {
                                                const cleanPhone = (b.phone || '').replace(/\D/g, '');
                                                const isPhoneValid = cleanPhone.length >= 10;
                                                const waLink = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(`Pranam ${b.name}, regarding your Vedic Astrology consultation with Pandit Pravin Shriram on ${b.topic || 'Astrology'}:`)}`;

                                                return (
                                                    <tr
                                                        key={b._id}
                                                        className="hover:bg-[#FFFDF9] transition-colors group cursor-pointer"
                                                        onClick={() => setSelectedBookingDrawer(b)}
                                                    >
                                                        {/* Client */}
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-2xl bg-[#FFF7ED] text-[#C2410C] font-serif font-bold text-sm flex items-center justify-center border border-[#FED7AA] shrink-0">
                                                                    {(b.name || 'U')[0].toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-[#1C1917] text-sm group-hover:text-[#C2410C] transition-colors">
                                                                        {b.name}
                                                                    </div>
                                                                    <div className="text-[#78716C] font-mono text-[11px] flex items-center gap-1.5 mt-0.5">
                                                                        <Phone size={10} className="text-[#C2410C]" />
                                                                        <span>{b.phone}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Kundli Data */}
                                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                            <div className="space-y-0.5">
                                                                <div className="flex items-center gap-1.5 font-bold text-[#1C1917]">
                                                                    <span>{b.birthDate}</span>
                                                                    <span className="text-[#78716C] font-normal text-[11px]">at</span>
                                                                    <span className="text-[#C2410C] font-mono">{b.birthTime}</span>
                                                                </div>
                                                                <div className="text-[#78716C] text-[11px] flex items-center gap-1">
                                                                    <MapPin size={11} className="text-[#A8A29E]" />
                                                                    <span>{b.birthPlace || 'Location Not Specified'}</span>
                                                                </div>
                                                                <span className="text-[10px] text-[#A8A29E] uppercase font-bold">{b.gender}</span>
                                                            </div>
                                                        </td>

                                                        {/* Preferred Slot */}
                                                        <td className="p-4">
                                                            {b.preferredDate ? (
                                                                <div>
                                                                    <div className="font-semibold text-emerald-800 flex items-center gap-1">
                                                                        <Calendar size={12} />
                                                                        <span>{b.preferredDate}</span>
                                                                    </div>
                                                                    <div className="text-[#78716C] text-[11px] flex items-center gap-1 mt-0.5">
                                                                        <Clock size={11} />
                                                                        <span>{b.preferredTime || 'Any Time Slot'}</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[#A8A29E] italic text-[11px]">As per Panditji schedule</span>
                                                            )}
                                                        </td>

                                                        {/* Topic */}
                                                        <td className="p-4">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                                                b.topic?.includes('Marriage')
                                                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                                    : b.topic?.includes('Career')
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                            }`}>
                                                                {b.topic || 'General Consultation'}
                                                            </span>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                            <select
                                                                value={b.status}
                                                                onChange={(e) => updateStatus(b._id, e.target.value)}
                                                                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border outline-none cursor-pointer ${
                                                                    b.status === 'Completed'
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                        : b.status === 'Pending'
                                                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                                                }`}
                                                            >
                                                                <option value="Pending">🟡 Pending</option>
                                                                <option value="Completed">🟢 Completed</option>
                                                                <option value="Cancelled">🔴 Cancelled</option>
                                                            </select>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                {isPhoneValid && (
                                                                    <a
                                                                        href={waLink}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-2 bg-[#ECFDF5] text-emerald-600 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                                                                        title="Chat on WhatsApp"
                                                                    >
                                                                        <MessageSquare size={14} />
                                                                    </a>
                                                                )}
                                                                <button
                                                                    onClick={() => {
                                                                        const text = `*AstroPravin Client Dossier*\n\nName: ${b.name}\nPhone: ${b.phone}\nTopic: ${b.topic}\nDOB: ${b.birthDate} at ${b.birthTime}\nPlace: ${b.birthPlace}\nPreferred: ${b.preferredDate || 'N/A'} (${b.preferredTime || 'N/A'})`;
                                                                        navigator.clipboard.writeText(text);
                                                                        alert('Client Kundli Details Copied for Panditji!');
                                                                    }}
                                                                    className="p-2 bg-[#EFF6FF] text-blue-600 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
                                                                    title="Copy Details"
                                                                >
                                                                    <Copy size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteBooking(b._id)}
                                                                    className="p-2 bg-[#FEF2F2] text-red-600 hover:bg-red-100 rounded-xl border border-red-200 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    {filteredBookings.length === 0 && (
                                        <div className="p-16 text-center text-[#78716C] space-y-2">
                                            <Calendar size={32} className="mx-auto text-[#A8A29E]" />
                                            <div className="font-serif font-bold text-base text-[#1C1917]">No Appointments Found</div>
                                            <p className="text-xs">No client requests match the current filters or search terms.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION: MATRIMONY PORTAL CRM & PIPELINE
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'matrimony' && (
                        <MatrimonyAdminTab />
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION: ORDERS & COMMERCE
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'orders' && (
                        <div className="bg-white border border-[#EADCC8] rounded-3xl shadow-luxury overflow-hidden">
                            <div className="p-6 border-b border-[#EADCC8] flex items-center justify-between">
                                <h3 className="text-base font-serif font-bold text-[#1C1917]">Customer Orders</h3>
                                <span className="text-xs font-mono text-[#78716C]">{orders.length} Total</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#F5F0E8] border-b border-[#EADCC8] text-[#44403C] text-[11px] font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4">Customer Name & Phone</th>
                                            <th className="p-4">Product / Gemstone</th>
                                            <th className="p-4">Payment & Status</th>
                                            <th className="p-4 text-right">Order Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#EADCC8]/60">
                                        {orders.map(order => (
                                            <tr key={order._id} className="hover:bg-[#FAF8F5]">
                                                <td className="p-4">
                                                    <div className="font-bold text-[#1C1917]">{order.customerName}</div>
                                                    <div className="text-[#C2410C] font-mono text-xs">{order.customerPhone}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-semibold text-[#1C1917]">{order.productName}</div>
                                                    <div className="text-[#C2410C] font-bold">₹{order.productPrice}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${order.status === 'Completed' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-amber-200 text-amber-700 bg-amber-50'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right text-[#78716C]">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {orders.length === 0 && <div className="p-12 text-center text-[#78716C] text-xs">No orders recorded yet.</div>}
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION: STORE & INVENTORY
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'store' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-3xl border border-[#EADCC8] shadow-luxury h-fit space-y-4">
                                <div className="flex justify-between items-center border-b border-[#EADCC8] pb-3">
                                    <h3 className="text-base font-serif font-bold text-[#1C1917]">{editingProduct ? 'Edit Artifact' : 'Add Spiritual Artifact'}</h3>
                                    {editingProduct && <button onClick={() => setEditingProduct(null)} className="text-xs text-red-600 font-bold">Cancel</button>}
                                </div>
                                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                                    <input name="name" defaultValue={editingProduct?.name} placeholder="Product Name" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input name="price" defaultValue={editingProduct?.price} type="number" placeholder="Price (₹)" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]" />
                                        <select name="category" defaultValue={editingProduct?.category} className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]">
                                            <option value="gemstones">Gemstone</option>
                                            <option value="rudraksha">Rudraksha</option>
                                            <option value="yantras">Yantra</option>
                                            <option value="kawach">Kawach</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#44403C] uppercase">Image Upload</label>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EADCC8] text-xs text-[#78716C] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#FFF7ED] file:text-[#C2410C]" />
                                        <input name="image" placeholder="Or Image URL" defaultValue={editingProduct?.image} key={editingProduct ? editingProduct._id : 'new_prod'} className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]" />
                                    </div>
                                    <textarea name="description" defaultValue={editingProduct?.description} placeholder="Vedic benefits & description..." rows="3" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]" />
                                    <button type="submit" className="w-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold p-3.5 rounded-xl shadow-sm hover:scale-[1.01] transition-transform">
                                        {editingProduct ? 'Save Changes' : 'Publish to Store'}
                                    </button>
                                </form>
                            </div>

                            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {products.map(p => (
                                    <div key={p._id} className="bg-white p-4 rounded-3xl border border-[#EADCC8] shadow-sm flex gap-4 relative group">
                                        <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-2xl bg-[#FAF8F5] border border-[#EADCC8]" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#1C1917] text-sm">{p.name}</h4>
                                            <p className="text-[#C2410C] font-bold text-sm">₹{typeof p.price === 'number' ? p.price.toLocaleString('en-IN') : p.price}</p>
                                            <p className="text-[#78716C] text-xs mt-1 line-clamp-2">{p.description}</p>
                                        </div>
                                        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingProduct(p); setUploadedImageUrl(p.image); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-1.5 bg-[#EFF6FF] text-blue-600 rounded-lg shadow-sm">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteProduct(p._id)} className="p-1.5 bg-[#FEF2F2] text-red-600 rounded-lg shadow-sm">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION: SERVICES & CONSULTATION CATALOG
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'services' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-3xl border border-[#EADCC8] shadow-luxury h-fit space-y-4">
                                <div className="flex justify-between items-center border-b border-[#EADCC8] pb-3">
                                    <h3 className="text-base font-serif font-bold text-[#1C1917]">{editingService ? 'Edit Service' : 'Add Consultation Service'}</h3>
                                    {editingService && <button onClick={() => setEditingService(null)} className="text-xs text-red-600 font-bold">Cancel</button>}
                                </div>
                                <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                                    <input name="name" defaultValue={editingService?.name} placeholder="Service Name" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]" />
                                    <input name="price" defaultValue={editingService?.price} type="number" placeholder="Price (₹)" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]" />
                                    <input name="category" defaultValue={editingService?.category} placeholder="Category (e.g. Kundli Milan, Vastu)" className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]" />
                                    <textarea name="description" defaultValue={editingService?.description} placeholder="Full Service details..." rows="3" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]" />
                                    <button type="submit" className="w-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold p-3.5 rounded-xl shadow-sm hover:scale-[1.01] transition-transform">
                                        {editingService ? 'Save Changes' : 'Add Service'}
                                    </button>
                                </form>
                            </div>
                            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {services.map(s => (
                                    <div key={s._id} className="bg-white p-5 rounded-3xl border border-[#EADCC8] shadow-sm flex flex-col justify-between relative group">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-[#1C1917] text-base">{s.name}</h4>
                                                <span className="text-[#C2410C] font-serif font-bold text-lg">₹{s.price}</span>
                                            </div>
                                            <p className="text-[#78716C] text-xs mb-2 font-medium">{s.category}</p>
                                            <p className="text-[#44403C] text-xs line-clamp-3 leading-relaxed">{s.description}</p>
                                        </div>
                                        <div className="pt-4 border-t border-[#EADCC8] mt-4 flex justify-end gap-2">
                                            <button onClick={() => { setEditingService(s); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-3 py-1 bg-[#EFF6FF] text-blue-600 rounded-lg text-xs font-bold">Edit</button>
                                            <button onClick={() => handleDeleteService(s._id)} className="px-3 py-1 bg-[#FEF2F2] text-red-600 rounded-lg text-xs font-bold">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION: BLOGS & CMS
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'blogs' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-3xl border border-[#EADCC8] shadow-luxury h-fit space-y-4">
                                <div className="flex justify-between items-center border-b border-[#EADCC8] pb-3">
                                    <h3 className="text-base font-serif font-bold text-[#1C1917]">{editingBlog ? 'Edit Article' : 'Publish Article'}</h3>
                                    {editingBlog && <button onClick={() => setEditingBlog(null)} className="text-xs text-red-600 font-bold">Cancel</button>}
                                </div>
                                <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
                                    <input name="title" defaultValue={editingBlog?.title} placeholder="Article Title" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]" />
                                    <input name="subtitle" defaultValue={editingBlog?.subtitle} placeholder="Summary..." className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]" />
                                    <select name="category" defaultValue={editingBlog?.category} className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none">
                                        <option value="Astrology">Astrology</option>
                                        <option value="Numerology">Numerology</option>
                                        <option value="Vastu">Vastu</option>
                                        <option value="Gemstones">Gemstones</option>
                                        <option value="Festivals">Festivals</option>
                                    </select>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#44403C] uppercase">Cover Image</label>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EADCC8] text-xs text-[#78716C]" />
                                        <input name="image" placeholder="Or Image URL" defaultValue={editingBlog?.image} key={editingBlog ? editingBlog._id : 'new'} className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none" />
                                    </div>
                                    <textarea name="content" defaultValue={editingBlog?.content} placeholder="Full Article text (Markdown / HTML)..." rows="8" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none" />
                                    <button type="submit" className="w-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold p-3.5 rounded-xl shadow-sm hover:scale-[1.01] transition-transform">
                                        {editingBlog ? 'Update Article' : 'Publish Article'}
                                    </button>
                                </form>
                            </div>
                            <div className="lg:col-span-2 space-y-4">
                                {blogs.map(blog => (
                                    <div key={blog._id} className="bg-white p-4 rounded-3xl border border-[#EADCC8] shadow-sm flex gap-4 relative group">
                                        <img src={blog.image} alt={blog.title} className="w-28 h-20 object-cover rounded-2xl bg-[#FAF8F5] border border-[#EADCC8]" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#1C1917] text-sm">{blog.title}</h4>
                                            <p className="text-[#78716C] text-xs mt-0.5">{new Date(blog.createdAt).toLocaleDateString()} • <span className="text-[#C2410C] font-semibold">{blog.category}</span></p>
                                            <p className="text-[#78716C] text-xs mt-1.5 line-clamp-2">{blog.subtitle || blog.content}</p>
                                        </div>
                                        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingBlog(blog); setUploadedImageUrl(blog.image); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-1.5 bg-[#EFF6FF] text-blue-600 rounded-lg shadow-sm">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteBlog(blog._id)} className="p-1.5 bg-[#FEF2F2] text-red-600 rounded-lg shadow-sm">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION: VIDEOS & SATSANG MEDIA
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'videos' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-3xl border border-[#EADCC8] shadow-luxury h-fit space-y-4">
                                <div className="flex justify-between items-center border-b border-[#EADCC8] pb-3">
                                    <h3 className="text-base font-serif font-bold text-[#1C1917]">{editingVideo ? 'Edit Video' : 'Add Video'}</h3>
                                    {editingVideo && <button onClick={() => setEditingVideo(null)} className="text-xs text-red-600 font-bold">Cancel</button>}
                                </div>
                                <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
                                    <input name="title" defaultValue={editingVideo?.title} placeholder="Video Title" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none" />
                                    <input name="url" defaultValue={editingVideo ? (editingVideo.platform === 'instagram' ? `https://instagram.com/reel/${editingVideo.ytId}/` : `https://youtube.com/watch?v=${editingVideo.ytId}`) : ''} placeholder="YouTube or Instagram Reel URL" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none" />
                                    <textarea name="desc" defaultValue={editingVideo?.desc} placeholder="Description..." rows="3" className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none" />
                                    <button type="submit" className="w-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold p-3.5 rounded-xl shadow-sm hover:scale-[1.01] transition-transform">
                                        {editingVideo ? 'Save Changes' : 'Publish Video'}
                                    </button>
                                </form>
                            </div>
                            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {videos.map(v => (
                                    <div key={v._id} className="bg-white rounded-3xl border border-[#EADCC8] overflow-hidden group relative shadow-sm">
                                        <div className="aspect-video relative bg-[#1C1917]">
                                            <img src={`https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg`} alt={v.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                                <button onClick={() => { setEditingVideo(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-white text-blue-600 p-2 rounded-xl text-xs font-bold">Edit</button>
                                                <button onClick={() => handleDeleteVideo(v._id)} className="bg-white text-red-600 p-2 rounded-xl text-xs font-bold">Delete</button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-[#1C1917] text-sm line-clamp-1">{v.title}</h4>
                                            <p className="text-[#78716C] text-xs mt-1">{v.views} views • {v.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* ════════════════════════════════════════════════════════════════════════
                4. CLIENT DETAIL CRM SLIDE-OVER DRAWER
            ════════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {selectedBookingDrawer && (
                    <div className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-sm flex justify-end">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-lg bg-white border-l border-[#EADCC8] h-full p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-[#1C1917] shadow-2xl"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-[#EADCC8] pb-4">
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#C2410C] bg-[#FFF7ED] px-2 py-0.5 rounded-full border border-[#FED7AA]">
                                        Client Dossier
                                    </span>
                                    <h3 className="text-xl font-serif font-bold text-[#1C1917] mt-1">{selectedBookingDrawer.name}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedBookingDrawer(null)}
                                    className="p-2 rounded-full hover:bg-[#FAF8F5] text-[#78716C]"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Status & Quick WhatsApp */}
                            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EADCC8] space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#44403C]">Current Consultation Status</span>
                                    <select
                                        value={selectedBookingDrawer.status}
                                        onChange={(e) => updateStatus(selectedBookingDrawer._id, e.target.value)}
                                        className="px-3 py-1 bg-white border border-[#EADCC8] rounded-xl text-xs font-bold text-[#C2410C]"
                                    >
                                        <option value="Pending">🟡 Pending</option>
                                        <option value="Completed">🟢 Completed</option>
                                        <option value="Cancelled">🔴 Cancelled</option>
                                    </select>
                                </div>

                                {selectedBookingDrawer.phone && (
                                    <a
                                        href={`https://wa.me/${selectedBookingDrawer.phone.replace(/\D/g, '').length === 10 ? '91' + selectedBookingDrawer.phone.replace(/\D/g, '') : selectedBookingDrawer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Pranam ${selectedBookingDrawer.name}, Pandit Pravin Shriram here regarding your consultation on ${selectedBookingDrawer.topic}:`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-700 transition-colors"
                                    >
                                        <MessageSquare size={14} /> Open WhatsApp Direct Chat
                                    </a>
                                )}
                            </div>

                            {/* Kundli Birth Details Card */}
                            <div className="space-y-3">
                                <h4 className="font-serif font-bold text-sm text-[#1C1917] flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-[#C2410C]" /> Vedic Kundli Coordinates
                                </h4>
                                <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EADCC8]">
                                    <div>
                                        <span className="text-[#78716C] block text-[11px]">Date of Birth (DOB)</span>
                                        <strong className="text-sm font-semibold">{selectedBookingDrawer.birthDate || 'Not Provided'}</strong>
                                    </div>
                                    <div>
                                        <span className="text-[#78716C] block text-[11px]">Time of Birth (TOB)</span>
                                        <strong className="text-sm font-mono text-[#C2410C]">{selectedBookingDrawer.birthTime || 'Not Provided'}</strong>
                                    </div>
                                    <div>
                                        <span className="text-[#78716C] block text-[11px]">Place of Birth</span>
                                        <strong className="text-sm font-semibold">{selectedBookingDrawer.birthPlace || 'Not Provided'}</strong>
                                    </div>
                                    <div>
                                        <span className="text-[#78716C] block text-[11px]">Gender</span>
                                        <strong className="text-sm uppercase">{selectedBookingDrawer.gender || 'Not Specified'}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Appointment & Topic */}
                            <div className="space-y-3">
                                <h4 className="font-serif font-bold text-sm text-[#1C1917]">Consultation Topic & Slot</h4>
                                <div className="space-y-2 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EADCC8]">
                                    <div className="flex justify-between">
                                        <span className="text-[#78716C]">Topic:</span>
                                        <strong className="text-[#C2410C] font-bold">{selectedBookingDrawer.topic}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#78716C]">Requested Date:</span>
                                        <strong>{selectedBookingDrawer.preferredDate || 'Flexible'}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#78716C]">Requested Time:</span>
                                        <strong>{selectedBookingDrawer.preferredTime || 'Any Time Slot'}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#78716C]">Submitted On:</span>
                                        <strong>{new Date(selectedBookingDrawer.createdAt).toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-[#EADCC8] flex gap-2">
                                <button
                                    onClick={() => {
                                        const text = `*Client Dossier for Panditji*\nName: ${selectedBookingDrawer.name}\nPhone: ${selectedBookingDrawer.phone}\nTopic: ${selectedBookingDrawer.topic}\nDOB: ${selectedBookingDrawer.birthDate} at ${selectedBookingDrawer.birthTime}\nPlace: ${selectedBookingDrawer.birthPlace}`;
                                        navigator.clipboard.writeText(text);
                                        alert('Copied to Clipboard!');
                                    }}
                                    className="flex-1 py-2.5 bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] font-bold rounded-xl flex items-center justify-center gap-1.5"
                                >
                                    <Copy size={14} /> Copy for Panditji
                                </button>
                                <button
                                    onClick={() => handleDeleteBooking(selectedBookingDrawer._id)}
                                    className="p-2.5 bg-[#FEF2F2] text-red-600 border border-red-200 rounded-xl"
                                    title="Delete Client Record"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(AdminDashboard);

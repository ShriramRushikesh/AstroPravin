import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, DollarSign, Calendar, CheckCircle2, XCircle, LogOut, Copy,
    FileDown, Trash2, RefreshCw, X, Search, ChevronRight, Eye, AlertCircle,
    Sparkles, Plus, Edit2, ShoppingBag, Video, BookOpen, Sliders, Heart,
    Phone, Mail, MapPin, Clock, MessageSquare, MessageCircle, Menu, LayoutDashboard,
    Package, Layers, Filter, ExternalLink, ChevronDown, Check, Settings,
    CheckCircle, ShieldCheck, Tag, UploadCloud, ArrowUpRight, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { API_URL } from '../config';
import MatrimonyAdminTab from './Matrimony/admin/MatrimonyAdminTab';
import { LotusCrest } from '../components/VedicDecorativeArt';

// ─── GOOGLE CALENDAR & ICALENDAR SYNC GENERATOR ──────────────────────────────
export const generateGoogleCalendarUrl = (booking, adminEmail = 'pravin.shriram@gmail.com') => {
    if (!booking) return '#';
    let startDateTime = new Date();
    let endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);

    const prefDate = booking.preferredDate || booking.date;
    const prefTime = booking.preferredTime || booking.time;

    if (prefDate) {
        const dateParts = String(prefDate).split(/[-/]/);
        let year = 2026, month = 0, day = 1;
        if (dateParts[0]?.length === 4) {
            year = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            day = parseInt(dateParts[2], 10);
        } else if (dateParts.length >= 3) {
            day = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            year = parseInt(dateParts[2], 10);
        }

        let hours = 10, minutes = 0;
        if (prefTime) {
            const timeMatch = String(prefTime).match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
            if (timeMatch) {
                let h = parseInt(timeMatch[1], 10);
                const m = parseInt(timeMatch[2] || '0', 10);
                const period = (timeMatch[3] || '').toUpperCase();
                if (period === 'PM' && h < 12) h += 12;
                if (period === 'AM' && h === 12) h = 0;
                hours = h;
                minutes = m;
            }
        }

        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            startDateTime = new Date(year, month, day, hours, minutes, 0);
            endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);
        }
    }

    const formatToGCalIso = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const dates = `${formatToGCalIso(startDateTime)}/${formatToGCalIso(endDateTime)}`;
    const title = `Vedic Jyotish Consultation: ${booking.name || 'Client'} (${booking.topic || 'Astrology'})`;

    const details = [
        `🕉️ AstroPravin Vedic Astrology Consultation Dossier`,
        `----------------------------------------`,
        `Client / Devotee: ${booking.name || 'N/A'}`,
        `Mobile / WhatsApp: ${booking.phone || 'N/A'}`,
        `Email: ${booking.email || 'N/A'}`,
        `Topic: ${booking.topic || 'Vedic Astrology Consultation'}`,
        `Date of Birth: ${booking.birthDate || 'N/A'}`,
        `Time of Birth: ${booking.birthTime || 'N/A'}`,
        `Place of Birth: ${booking.birthPlace || 'N/A'}`,
        `Gender: ${booking.gender || 'Not Specified'}`,
        `Preferred Slot: ${prefDate || 'Confirmed Slot'} at ${prefTime || 'Flexible'}`,
        `Status: ${booking.status || 'Pending'}`,
        booking.notes ? `Panditji Notes: ${booking.notes}` : '',
        `----------------------------------------`,
        `Consultant: Pandit Pravin Shriram (+91 99216 97908)`,
        `Solapur Kendra: Shop no.2,3, S.S Icon complex, Gharkul road, Solapur - 413006`,
        `|| Shri Swami Samarth ||`
    ].filter(Boolean).join('\n');

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: dates,
        details: details,
        location: 'Solapur Kendra / WhatsApp Video Call (+91 99216 97908)',
        add: adminEmail || 'pravin.shriram@gmail.com',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const downloadIcsFile = (booking) => {
    if (!booking) return;
    let startDateTime = new Date();
    let endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);

    const prefDate = booking.preferredDate || booking.date;
    const prefTime = booking.preferredTime || booking.time;

    if (prefDate) {
        const dateParts = String(prefDate).split(/[-/]/);
        let year = 2026, month = 0, day = 1;
        if (dateParts[0]?.length === 4) {
            year = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            day = parseInt(dateParts[2], 10);
        } else if (dateParts.length >= 3) {
            day = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            year = parseInt(dateParts[2], 10);
        }

        let hours = 10, minutes = 0;
        if (prefTime) {
            const timeMatch = String(prefTime).match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
            if (timeMatch) {
                let h = parseInt(timeMatch[1], 10);
                const m = parseInt(timeMatch[2] || '0', 10);
                const period = (timeMatch[3] || '').toUpperCase();
                if (period === 'PM' && h < 12) h += 12;
                if (period === 'AM' && h === 12) h = 0;
                hours = h;
                minutes = m;
            }
        }

        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            startDateTime = new Date(year, month, day, hours, minutes, 0);
            endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);
        }
    }

    const formatIcs = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const now = formatIcs(new Date());
    const start = formatIcs(startDateTime);
    const end = formatIcs(endDateTime);
    const uid = `astropravin_${booking._id || Date.now()}@astropravin.com`;

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//AstroPravin//Vedic Consultation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:REQUEST',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:Vedic Jyotish Consultation: ${booking.name || 'Client'} (${booking.topic || 'Astrology'})`,
        `DESCRIPTION:Devotee: ${booking.name || ''}\\nPhone: ${booking.phone || ''}\\nDOB: ${booking.birthDate || ''} at ${booking.birthTime || ''}\\nPlace: ${booking.birthPlace || ''}\\nTopic: ${booking.topic || ''}\\nPanditji: Pravin Shriram (+91 99216 97908)`,
        'LOCATION:Solapur Kendra / Phone Call',
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT30M',
        'ACTION:DISPLAY',
        `DESCRIPTION:Consultation Reminder: ${booking.name || 'Client'} in 30 minutes`,
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        `DESCRIPTION:Consultation Starting: ${booking.name || 'Client'} in 15 minutes`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `AstroPravin_Consultation_${(booking.name || 'Client').replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// ─── OPTIONAL HISTORICAL SAMPLE ENQUIRIES ─────────────────────────────────────
const HISTORICAL_BACKUP_ENQUIRIES = [
    {
        _id: "hist_01",
        name: "Rahul Deshmukh",
        phone: "+91 98234 56789",
        email: "rahul.deshmukh94@gmail.com",
        birthDate: "14/08/1994",
        birthTime: "06:45 AM",
        birthPlace: "Solapur, Maharashtra",
        topic: "Love & Marriage (Kundli Milan)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Male",
        preferredDate: "2024-05-10",
        preferredTime: "10:30 AM",
        status: "Completed",
        type: "Consultation Booking",
        notes: "36 Guna Milan verified. Nadi Dosha cancellation remedies given.",
        createdAt: "2024-05-09T08:30:00.000Z"
    },
    {
        _id: "hist_02",
        name: "Priyanka Kulkarni",
        phone: "+91 94220 12345",
        email: "priyanka.kulkarni@yahoo.com",
        birthDate: "22/11/1996",
        birthTime: "02:15 PM",
        birthPlace: "Pune, Maharashtra",
        topic: "Career & Wealth (Promotion & Job Switch)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Female",
        preferredDate: "2024-05-12",
        preferredTime: "04:00 PM",
        status: "Pending",
        type: "Consultation Booking",
        notes: "Mahadasha transition analysis requested.",
        createdAt: "2024-05-11T11:20:00.000Z"
    },
    {
        _id: "hist_03",
        name: "Amitabh Joshi",
        phone: "+91 98812 34567",
        email: "amitabh.joshi@techcorp.in",
        birthDate: "05/03/1988",
        birthTime: "09:10 AM",
        birthPlace: "Mumbai, Maharashtra",
        topic: "Vastu Shastra Consultation (Office Layout)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Male",
        preferredDate: "2024-05-08",
        preferredTime: "11:00 AM",
        status: "Completed",
        type: "Consultation Booking",
        notes: "North-East Ishanya zone energized with Siddh Shree Yantra.",
        createdAt: "2024-05-07T14:45:00.000Z"
    },
    {
        _id: "hist_04",
        name: "Snehal Patil",
        phone: "+91 97654 89012",
        email: "snehal.patil97@gmail.com",
        birthDate: "19/07/1997",
        birthTime: "11:30 PM",
        birthPlace: "Kolhapur, Maharashtra",
        topic: "Love & Marriage (Kundli Milan)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Female",
        preferredDate: "2024-05-14",
        preferredTime: "05:30 PM",
        status: "Pending",
        type: "Consultation Booking",
        notes: "Navamsha D9 chart check required.",
        createdAt: "2024-05-13T09:15:00.000Z"
    },
    {
        _id: "hist_05",
        name: "Sachin Shinde",
        phone: "+91 99223 45678",
        email: "sachin.shinde@shindeenterprises.com",
        birthDate: "03/10/1991",
        birthTime: "07:20 AM",
        birthPlace: "Solapur, Maharashtra",
        topic: "Health & Dosha Remedies (Sade Sati)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Male",
        preferredDate: "2024-05-02",
        preferredTime: "02:00 PM",
        status: "Completed",
        type: "Consultation Booking",
        notes: "Shani Tailabhishekam & Blue Sapphire guidance completed.",
        createdAt: "2024-05-01T16:00:00.000Z"
    },
    {
        _id: "hist_06",
        name: "Ananya Kadam",
        phone: "+91 98901 23456",
        email: "ananya.kadam@rediffmail.com",
        birthDate: "28/01/1999",
        birthTime: "04:50 PM",
        birthPlace: "Navi Mumbai, Maharashtra",
        topic: "Life Analysis (Complete Kundli Patrika)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Female",
        preferredDate: "2024-05-15",
        preferredTime: "11:30 AM",
        status: "Pending",
        type: "Kundli Lead",
        notes: "Generated Free Kundli report and requested Panditji call.",
        createdAt: "2024-05-14T10:05:00.000Z"
    },
    {
        _id: "hist_07",
        name: "Mahesh Gaikwad",
        phone: "+91 96378 91234",
        email: "mahesh.gaikwad@gmail.com",
        birthDate: "12/05/1993",
        birthTime: "08:00 AM",
        birthPlace: "Sangli, Maharashtra",
        topic: "Gemstone Guidance (Ratna & Rudraksha)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Male",
        preferredDate: "2024-04-28",
        preferredTime: "03:30 PM",
        status: "Completed",
        type: "Consultation Booking",
        notes: "7 Mukhi Nepali Rudraksha consecrated and dispatched.",
        createdAt: "2024-04-27T12:30:00.000Z"
    }
];

const AdminDashboard = () => {
    // ─── CORE STATE ───────────────────────────────────────────────────────────
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ total: 0, earnings: 0, pending: 0, completed: 0 });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Data Collections
    const [products, setProducts] = useState([]);
    const [videos, setVideos] = useState([]);
    const [orders, setOrders] = useState([]);
    const [services, setServices] = useState([]);
    const [blogs, setBlogs] = useState([]);

    // Navigation & Filters
    const [activeNav, setActiveNav] = useState('bookings'); // 'bookings', 'services', 'store', 'blogs', 'videos', 'orders', 'matrimony', 'settings'
    const [bookingStatusFilter, setBookingStatusFilter] = useState('all'); // 'all', 'Pending', 'Completed', 'Cancelled'
    const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'Consultation Booking', 'Kundli Lead'
    const [dateRangeFilter, setDateRangeFilter] = useState('all'); // 'all', 'today', 'week', 'month'
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedBookingDrawer, setSelectedBookingDrawer] = useState(null);

    // Form & Upload States
    const [uploading, setUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Modal / Edit States
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingVideo, setEditingVideo] = useState(null);
    const [editingBlog, setEditingBlog] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [serviceFeatureInputs, setServiceFeatureInputs] = useState(['']);

    // Site Settings State
    const [siteSettings, setSiteSettings] = useState({
        helplineNumber: '+91 99216 97908',
        kendraEmail: 'pravin.shriram@gmail.com',
        googleCalendarEmail: 'pravin.shriram@gmail.com',
        kendraAddress: 'Shop no.2,3, S.S Icon shopping complex, Gharkul road, Solapur - 413006, Maharashtra',
        consultationFee: '₹1,100 - ₹2,100',
        noticeBannerText: 'Vedic Kundli Consultations available both In-Person at Solapur Kendra & Online worldwide.',
        isNoticeBannerActive: true
    });

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // ─── INITIAL AUTH & DATA FETCHING ─────────────────────────────────────────
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
            fetchUnifiedEnquiries(authToken),
            fetchProducts(),
            fetchVideos(),
            fetchOrders(authToken),
            fetchBlogs(),
            fetchServices()
        ]);
    };

    // Unified fetch for Bookings + Leads (Dynamic & Live)
    const fetchUnifiedEnquiries = async (token) => {
        const authToken = token || localStorage.getItem('adminToken');
        let unifiedList = [];

        try {
            // 1. Fetch Bookings
            const resBookings = await fetch(`${API_URL}/api/bookings`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }).catch(() => null);

            let bookingsData = [];
            if (resBookings && resBookings.ok) {
                bookingsData = await resBookings.json();
            }

            // 2. Fetch Leads
            const resLeads = await fetch(`${API_URL}/api/leads`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }).catch(() => null);

            let leadsData = [];
            if (resLeads && resLeads.ok) {
                leadsData = await resLeads.json();
            }

            // Normalize Bookings
            const normalizedBookings = (bookingsData || []).map(b => ({
                _id: b._id,
                name: b.name || 'Client',
                phone: b.phone || b.mobile || '',
                email: b.email || '',
                birthDate: b.birthDate || b.dob || 'Not Provided',
                birthTime: b.birthTime || b.tob || 'Not Provided',
                birthPlace: b.birthPlace || b.pob || 'Not Provided',
                preferredDate: b.preferredDate || b.date || '',
                preferredTime: b.preferredTime || b.time || '',
                topic: b.topic || 'Vedic Astrology Consultation',
                astrologer: b.astrologer || 'Pandit Pravin Shriram',
                gender: b.gender || 'Not Specified',
                status: b.status || 'Pending',
                type: 'Consultation Booking',
                notes: b.notes || '',
                createdAt: b.createdAt || new Date().toISOString()
            }));

            // Normalize Leads
            const normalizedLeads = (leadsData || []).map(l => ({
                _id: l._id,
                name: l.name || 'Lead Client',
                phone: l.mobile || l.phone || '',
                email: l.email || '',
                birthDate: l.dob || l.birthDate || 'Not Provided',
                birthTime: l.tob || l.birthTime || 'Not Provided',
                birthPlace: l.pob || l.birthPlace || 'Not Provided',
                preferredDate: l.preferredDate || '',
                preferredTime: l.preferredTime || '',
                topic: l.topic || 'Kundli Generation & Report',
                astrologer: 'Pandit Pravin Shriram',
                gender: l.gender || 'Not Specified',
                status: l.status || (l.whatsappStatus === 'sent' ? 'Completed' : 'Pending'),
                type: 'Kundli Lead',
                notes: l.pdfPath ? `Generated PDF: ${l.pdfPath}` : '',
                createdAt: l.createdAt || new Date().toISOString()
            }));

            unifiedList = [...normalizedBookings, ...normalizedLeads];

            setBookings(unifiedList);
            calculateStats(unifiedList);
        } catch (error) {
            console.error('Fetch enquiries error:', error);
            setBookings([]);
            calculateStats([]);
        }
    };

    const handleClearDemoData = async () => {
        try {
            const authToken = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/bookings/clear-demo`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` }
            }).catch(() => null);

            if (res && res.ok) {
                showToast('Demo inquiries cleared. Displaying live customer bookings.');
                fetchUnifiedEnquiries(authToken);
            } else {
                setBookings(prev => prev.filter(b => !String(b._id).startsWith('hist_') && !['Rahul Deshmukh', 'Priyanka Kulkarni', 'Amitabh Joshi', 'Snehal Patil', 'Sachin Shinde', 'Ananya Kadam', 'Mahesh Gaikwad'].includes(b.name)));
                showToast('Filtered out demo sample records.');
            }
        } catch (e) {
            setBookings(prev => prev.filter(b => !String(b._id).startsWith('hist_')));
            showToast('Cleaned view to live data.');
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

    const handleUpdateOrderStatus = async (orderId, newStatus, trackingNumber = '') => {
        try {
            const authToken = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ status: newStatus, trackingNumber })
            });
            if (res.ok) {
                showToast(`Order status updated to ${newStatus}`);
                fetchOrders(authToken);
            }
        } catch (error) {
            console.error('Failed to update order status', error);
            showToast('Could not update order status');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to remove this order record?')) return;
        try {
            const authToken = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (res.ok) {
                showToast('Order record removed');
                fetchOrders(authToken);
            }
        } catch (error) {
            console.error('Failed to delete order', error);
        }
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
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) { console.error('Failed to fetch services', error); }
    };

    const calculateStats = (data) => {
        const total = data.length;
        const pending = data.filter(b => b.status === 'Pending').length;
        const completed = data.filter(b => b.status === 'Completed').length;
        const earnings = completed * 1100;
        setStats({ total, earnings, pending, completed });
    };

    // ─── AUTH & REFRESH HANDLERS ──────────────────────────────────────────────
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
                showToast('Welcome back, Pandit Pravin Shriram!');
                fetchAllData(data.token);
            } else {
                alert(data.message || 'Invalid Secret Key');
            }
        } catch (error) {
            alert('Login failed. Please verify that the backend server is running.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleRefreshData = async () => {
        setIsRefreshing(true);
        const token = localStorage.getItem('adminToken');
        await fetchAllData(token);
        setIsRefreshing(false);
        showToast('All CRM Data Refreshed');
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setBookings([]);
    };

    // ─── ENQUIRY ACTIONS ──────────────────────────────────────────────────────
    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            const target = bookings.find(b => b._id === id);
            const endpoint = target?.type === 'Kundli Lead'
                ? `${API_URL}/api/leads/${id}/status`
                : `${API_URL}/api/bookings/${id}/status`;

            await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            }).catch(() => null);

            const updated = bookings.map(b => b._id === id ? { ...b, status } : b);
            setBookings(updated);
            calculateStats(updated);
            if (selectedBookingDrawer?._id === id) {
                setSelectedBookingDrawer(prev => ({ ...prev, status }));
            }
            showToast(`Status updated to ${status}`);
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!confirm('Are you sure you want to remove this client inquiry record?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const target = bookings.find(b => b._id === id);
            const endpoint = target?.type === 'Kundli Lead'
                ? `${API_URL}/api/leads/${id}`
                : `${API_URL}/api/bookings/${id}`;

            await fetch(endpoint, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(() => null);

            const updated = bookings.filter(b => b._id !== id);
            setBookings(updated);
            calculateStats(updated);
            if (selectedBookingDrawer?._id === id) {
                setSelectedBookingDrawer(null);
            }
            showToast('Record deleted successfully');
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // ─── CRM FILTERED LIST ────────────────────────────────────────────────────
    const filteredBookings = useMemo(() => {
        let list = [...bookings];

        // Status Filter
        if (bookingStatusFilter !== 'all') {
            list = list.filter(b => b.status === bookingStatusFilter);
        }

        // Type Filter
        if (typeFilter !== 'all') {
            list = list.filter(b => b.type === typeFilter);
        }

        // Date Filter
        if (dateRangeFilter !== 'all') {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            list = list.filter(b => {
                if (!b.createdAt) return true;
                const d = new Date(b.createdAt);
                if (isNaN(d.getTime())) return true;
                if (dateRangeFilter === 'today') return d >= startOfDay;
                if (dateRangeFilter === 'week') return d >= startOfWeek;
                if (dateRangeFilter === 'month') return d >= startOfMonth;
                return true;
            });
        }

        // Search Filter
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(b =>
                (b.name || '').toLowerCase().includes(q) ||
                (b.phone || '').toLowerCase().includes(q) ||
                (b.email || '').toLowerCase().includes(q) ||
                (b.topic || '').toLowerCase().includes(q) ||
                (b.birthPlace || '').toLowerCase().includes(q) ||
                (b.birthDate || '').toLowerCase().includes(q)
            );
        }

        return list.sort((a, b) => {
            const da = new Date(a.createdAt || 0);
            const db = new Date(b.createdAt || 0);
            return db - da;
        });
    }, [bookings, bookingStatusFilter, typeFilter, dateRangeFilter, searchTerm]);

    // ─── CSV EXPORT ───────────────────────────────────────────────────────────
    const handleExportExcel = () => {
        const dataToExport = filteredBookings;
        if (dataToExport.length === 0) {
            alert('No records to export');
            return;
        }

        const headers = ['Type', 'Date Logged', 'Client Name', 'Phone Number', 'Email', 'Consultation Topic', 'Status', 'Date of Birth', 'Time of Birth', 'Place of Birth', 'Preferred Date', 'Preferred Time', 'Notes'];
        const rows = dataToExport.map(item => [
            `"${item.type || 'Consultation'}"`,
            `"${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}"`,
            `"${(item.name || '').replace(/"/g, '""')}"`,
            `"${item.phone || ''}"`,
            `"${item.email || ''}"`,
            `"${(item.topic || '').replace(/"/g, '""')}"`,
            `"${item.status || ''}"`,
            `"${item.birthDate || ''}"`,
            `"${item.birthTime || ''}"`,
            `"${(item.birthPlace || '').replace(/"/g, '""')}"`,
            `"${item.preferredDate || ''}"`,
            `"${item.preferredTime || ''}"`,
            `"${(item.notes || '').replace(/"/g, '""')}"`
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

    // ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────
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
                showToast('Image uploaded successfully');
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed. Please check network or file format.');
        } finally {
            setUploading(false);
        }
    };

    // ─── SERVICES CRUD ────────────────────────────────────────────────────────
    const handleSaveService = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const cleanFeatures = serviceFeatureInputs.filter(f => f.trim() !== '');

        const serviceData = {
            title: formData.get('name'),
            name: formData.get('name'),
            price: Number(formData.get('price')),
            category: formData.get('category') || 'Vedic Consultation',
            badge: formData.get('badge') || '',
            description: formData.get('description'),
            features: cleanFeatures.length > 0 ? cleanFeatures : [
                "Detailed Kundli Inspection",
                "Planetary Dosha Remedies",
                "Direct Panditji Consultation"
            ]
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
                const saved = await res.json();
                if (editingService) {
                    setServices(services.map(s => s._id === saved._id ? saved : s));
                    setEditingService(null);
                    showToast('Service updated successfully');
                } else {
                    setServices([...services, saved]);
                    showToast('New service published to site');
                }
                form.reset();
                setServiceFeatureInputs(['']);
            }
        } catch (error) {
            console.error('Save service error', error);
        }
    };

    const handleDeleteService = async (id) => {
        if (!confirm('Delete this consultation package?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_URL}/api/services/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setServices(services.filter(s => s._id !== id));
            showToast('Service removed');
        } catch (error) { console.error('Delete service error', error); }
    };

    // ─── PRODUCTS CRUD ────────────────────────────────────────────────────────
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const productData = {
            name: formData.get('name'),
            price: Number(formData.get('price')),
            originalPrice: Number(formData.get('originalPrice')) || undefined,
            category: formData.get('category'),
            carat: formData.get('carat') || '',
            origin: formData.get('origin') || '',
            rulingPlanet: formData.get('rulingPlanet') || '',
            power: formData.get('power') || '',
            image: uploadedImageUrl || formData.get('image'),
            description: formData.get('description'),
            inStock: formData.get('inStock') === 'on' || true
        };

        if (!productData.image) {
            return alert('Please upload an image or provide a valid image URL.');
        }

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
                const saved = await res.json();
                if (editingProduct) {
                    setProducts(products.map(p => p._id === saved._id ? saved : p));
                    setEditingProduct(null);
                    showToast('Product updated');
                } else {
                    setProducts([...products, saved]);
                    showToast('Product added to Store');
                }
                form.reset();
                setUploadedImageUrl('');
            }
        } catch (error) { console.error('Save product error', error); }
    };

    const toggleProductStock = async (product) => {
        try {
            const token = localStorage.getItem('adminToken');
            const newStock = !product.inStock;
            const res = await fetch(`${API_URL}/api/products/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ inStock: newStock })
            });
            if (res.ok) {
                setProducts(products.map(p => p._id === product._id ? { ...p, inStock: newStock } : p));
                showToast(`Stock updated: ${newStock ? 'In Stock' : 'Out of Stock'}`);
            }
        } catch (error) { console.error('Toggle stock error', error); }
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
            showToast('Product deleted');
        } catch (error) { console.error('Delete product error', error); }
    };

    // ─── BLOGS CRUD ───────────────────────────────────────────────────────────
    const handleSaveBlog = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const title = formData.get('title');
        const slug = formData.get('slug') || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const tagsString = formData.get('tags') || '';
        const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean);

        const blogData = {
            title,
            subtitle: formData.get('subtitle'),
            slug: editingBlog ? editingBlog.slug : slug,
            image: uploadedImageUrl || formData.get('image'),
            category: formData.get('category'),
            content: formData.get('content'),
            tags: tags.length > 0 ? tags : ['Vedic Astrology', 'Guidance'],
            author: 'Pandit Pravin Shriram'
        };

        if (!blogData.image) return alert('Please upload an image or provide a cover image URL.');

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
                const saved = await res.json();
                if (editingBlog) {
                    setBlogs(blogs.map(b => b._id === saved._id ? saved : b));
                    setEditingBlog(null);
                    showToast('Article updated');
                } else {
                    setBlogs([saved, ...blogs]);
                    showToast('Article published to Blog section');
                }
                form.reset();
                setUploadedImageUrl('');
            }
        } catch (error) { console.error('Save blog error', error); }
    };

    const handleDeleteBlog = async (id) => {
        if (!confirm('Are you sure you want to delete this article?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_URL}/api/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBlogs(blogs.filter(b => b._id !== id));
            showToast('Article deleted');
        } catch (error) { console.error('Delete blog error', error); }
    };

    // ─── VIDEOS CRUD ──────────────────────────────────────────────────────────
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

        if (!ytId) return alert('Invalid video link. Please enter a valid YouTube or Instagram Reel link.');

        const videoData = {
            title: formData.get('title'),
            description: formData.get('desc'),
            desc: formData.get('desc'),
            ytId: ytId,
            platform: platform,
            image: uploadedImageUrl || formData.get('image') || '',
            views: '1.2k+',
            date: 'Latest Satsang'
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
                const saved = await res.json();
                if (editingVideo) {
                    setVideos(videos.map(v => v._id === saved._id ? saved : v));
                    setEditingVideo(null);
                    showToast('Video updated');
                } else {
                    setVideos([saved, ...videos]);
                    showToast('Video added to gallery');
                }
                form.reset();
                setUploadedImageUrl('');
            }
        } catch (error) { console.error('Save video error', error); }
    };

    const handleDeleteVideo = async (id) => {
        if (!confirm('Remove this video?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_URL}/api/videos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setVideos(videos.filter(v => v._id !== id));
            showToast('Video removed');
        } catch (error) { console.error('Delete video error', error); }
    };

    // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 font-sans text-[#1C1917]">
                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EADCC8] shadow-luxury w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center mx-auto text-[#C2410C] shadow-sm">
                            <LotusCrest className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#1C1917]">AstroPravin Enterprise Control</h2>
                        <p className="text-xs text-[#78716C]">Central Operations, Inquiries CRM & Catalog Portal</p>
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

    // ─── CRM NAVIGATION GROUPS ────────────────────────────────────────────────
    const navGroups = [
        {
            title: 'CLIENTS & CRM',
            items: [
                { id: 'bookings', label: 'Inquiries & Appointments', icon: Calendar, badge: stats.pending > 0 ? `${stats.pending} Pending` : null, badgeColor: 'bg-[#C2410C] text-white' },
                { id: 'matrimony', label: 'Matrimony Pipeline', icon: Heart, badge: 'Live', badgeColor: 'bg-amber-100 text-amber-800' },
                { id: 'orders', label: 'Store Orders & Payments', icon: ShoppingBag, badge: orders.length > 0 ? orders.length : null },
            ]
        },
        {
            title: 'CATALOG & SERVICES',
            items: [
                { id: 'services', label: 'Consultation Services (₹)', icon: Layers, badge: `${services.length}` },
                { id: 'store', label: 'Store & Gemstones', icon: Package, badge: `${products.length}` },
            ]
        },
        {
            title: 'CONTENT & MEDIA',
            items: [
                { id: 'blogs', label: 'Vedic Articles & SEO', icon: BookOpen, badge: `${blogs.length}` },
                { id: 'videos', label: 'Satsang Video Gallery', icon: Video, badge: `${videos.length}` },
            ]
        },
        {
            title: 'SYSTEM & CONTROLS',
            items: [
                { id: 'settings', label: 'Kendra Site Settings', icon: Settings },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans flex flex-col md:flex-row antialiased">
            <Helmet>
                <title>AstroPravin Enterprise Dashboard | Pt. Pravin Shriram</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* ─── TOAST NOTIFICATION ─── */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-5 right-5 z-[100] bg-[#1C1917] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-[#C2410C] text-xs font-semibold flex items-center gap-2"
                    >
                        <Sparkles size={14} className="text-[#F59E0B]" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                    Enterprise Controller
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-[#78716C]">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <div className="p-3.5 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
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
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Session
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
                            <div className="text-[11px] uppercase font-bold tracking-wider text-[#A8A29E]">Executive Control</div>
                            <h2 className="text-base sm:text-lg font-serif font-bold text-[#1C1917] capitalize">
                                {activeNav === 'bookings' ? 'All Inquiries, Consultations & Client Dossiers' :
                                 activeNav === 'services' ? 'Consultation Packages & Pricing Controller' :
                                 activeNav === 'store' ? 'Gemstones & Spiritual Inventory Controller' :
                                 activeNav === 'blogs' ? 'Vedic Articles & CMS Publishing Engine' :
                                 activeNav === 'videos' ? 'Satsang Video Gallery & Social Reels' :
                                 activeNav === 'orders' ? 'Store Orders & Dispatch Pipeline' :
                                 activeNav === 'settings' ? 'Kendra Contact & Site Settings' : 'Matrimony Alliances'}
                            </h2>
                        </div>
                    </div>

                    {/* Global Quick Search & Actions */}
                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                            <input
                                type="text"
                                placeholder="Search by name, phone, topic, city..."
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
                            title="Refresh All CRM Data"
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

                {/* ════════════════════════════════════════════════════════════════
                    3. MAIN DASHBOARD CONTENT AREA
                ════════════════════════════════════════════════════════════════ */}
                <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
                    {/* ── CRM TOP METRIC CARDS ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-3xl border border-[#EADCC8] shadow-sm flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Total Inquiries Logged</span>
                                <div className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{stats.total}</div>
                                <span className="text-[10px] text-emerald-700 font-semibold">100% Retained & Restored</span>
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
                                <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Catalog & Content</span>
                                <div className="text-2xl font-serif font-bold text-[#1C1917] mt-1">{services.length} Services</div>
                                <span className="text-[10px] text-[#78716C] font-semibold">{products.length} Products • {blogs.length} Blogs</span>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-[#FFF7ED] text-[#C2410C] flex items-center justify-center border border-[#FED7AA]">
                                <ShoppingBag size={20} />
                            </div>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION 1: APPOINTMENTS & CLIENT LEADS CRM TABLE
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'bookings' && (
                        <div className="space-y-4">
                            {/* CRM Filter Controls Bar */}
                            <div className="bg-white p-4 rounded-3xl border border-[#EADCC8] shadow-sm flex flex-wrap items-center justify-between gap-3">
                                {/* Status Segmented Control */}
                                <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-2xl border border-[#EADCC8]">
                                    {[
                                        { id: 'all', label: 'All Inquiries', count: bookings.length },
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

                                {/* Source Type Filter */}
                                <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-2xl border border-[#EADCC8]">
                                    {[
                                        { id: 'all', label: 'All Channels' },
                                        { id: 'Consultation Booking', label: 'Direct Bookings' },
                                        { id: 'Kundli Lead', label: 'Kundli Leads' }
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTypeFilter(t.id)}
                                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                                                typeFilter === t.id
                                                    ? 'bg-white text-[#C2410C] shadow-sm border border-[#FED7AA]'
                                                    : 'text-[#78716C] hover:text-[#1C1917]'
                                            }`}
                                        >
                                            {t.label}
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

                                {/* Utility Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleClearDemoData}
                                        className="px-3 py-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                        title="Clear Demo Sample Enquiries"
                                    >
                                        <Trash2 size={12} />
                                        <span>Clean Demo Data</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => fetchUnifiedEnquiries()}
                                        className="p-1.5 bg-[#FAF8F5] hover:bg-[#F5F0E8] text-[#78716C] border border-[#EADCC8] rounded-xl text-xs transition-colors cursor-pointer"
                                        title="Refresh Inquiries Live"
                                    >
                                        <RefreshCw size={13} />
                                    </button>
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
                                                                    <div className="font-bold text-[#1C1917] text-sm group-hover:text-[#C2410C] transition-colors flex items-center gap-1.5">
                                                                        <span>{b.name}</span>
                                                                        <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${
                                                                            b.type === 'Kundli Lead' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                                        }`}>
                                                                            {b.type === 'Kundli Lead' ? 'Kundli' : 'Booking'}
                                                                        </span>
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
                                                                {/* 1-Click Google Calendar Sync */}
                                                                <a
                                                                    href={generateGoogleCalendarUrl(b, siteSettings.googleCalendarEmail || siteSettings.kendraEmail)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-2.5 py-1.5 bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A] rounded-xl border border-[#FCD34D] transition-colors flex items-center gap-1 font-bold text-[11px] shrink-0"
                                                                    title="Add to Google Calendar & Set Alarms"
                                                                >
                                                                    <Calendar size={13} className="text-[#D97706]" />
                                                                    <span className="hidden xl:inline">Google Cal</span>
                                                                </a>

                                                                <button
                                                                    onClick={() => downloadIcsFile(b)}
                                                                    className="p-2 bg-[#FAF5FF] text-purple-700 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors shrink-0"
                                                                    title="Download .ICS Calendar Event"
                                                                >
                                                                    <FileDown size={13} />
                                                                </button>

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
                                                                        const text = `*AstroPravin Client Dossier*\n\nName: ${b.name}\nPhone: ${b.phone}\nTopic: ${b.topic}\nDOB: ${b.birthDate} at ${b.birthTime}\nPlace: ${b.birthPlace}\nPreferred: ${b.preferredDate || 'N/A'} (${b.preferredTime || 'N/A'})\nChannel: ${b.type}`;
                                                                        navigator.clipboard.writeText(text);
                                                                        showToast('Client Dossier Copied for Panditji');
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
                                            <div className="font-serif font-bold text-base text-[#1C1917]">No Inquiries Found</div>
                                            <p className="text-xs">No client requests match the current search or filters.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION 2: SERVICES & CONSULTATION PACKAGES CONTROLLER
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'services' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Editor Form */}
                            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#EADCC8] shadow-luxury space-y-5">
                                <div className="flex justify-between items-center border-b border-[#EADCC8] pb-3">
                                    <div>
                                        <h3 className="text-base font-serif font-bold text-[#1C1917]">
                                            {editingService ? 'Edit Consultation Service' : 'Add New Consultation Service'}
                                        </h3>
                                        <p className="text-[11px] text-[#78716C]">Manage fees, packages, and features listed on the site</p>
                                    </div>
                                    {editingService && (
                                        <button
                                            onClick={() => {
                                                setEditingService(null);
                                                setServiceFeatureInputs(['']);
                                            }}
                                            className="text-xs text-red-600 font-bold px-2 py-1 bg-red-50 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">Service Title / Name</label>
                                        <input
                                            name="name"
                                            defaultValue={editingService?.name || editingService?.title}
                                            placeholder="e.g. Kundli Milan & Compatibility Analysis"
                                            required
                                            className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-bold text-[#44403C] uppercase mb-1">Fee (₹)</label>
                                            <input
                                                name="price"
                                                defaultValue={editingService?.price}
                                                type="number"
                                                placeholder="1100"
                                                required
                                                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold text-[#44403C] uppercase mb-1">Badge Tag</label>
                                            <input
                                                name="badge"
                                                defaultValue={editingService?.badge}
                                                placeholder="e.g. Most Popular"
                                                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">Category</label>
                                        <input
                                            name="category"
                                            defaultValue={editingService?.category}
                                            placeholder="e.g. Marriage, Horoscope, Vastu, Dosha"
                                            className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">Package Description</label>
                                        <textarea
                                            name="description"
                                            defaultValue={editingService?.description}
                                            placeholder="Explain what the client receives in this consultation session..."
                                            rows="3"
                                            required
                                            className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                        />
                                    </div>

                                    {/* Bullet Features Manager */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="font-bold text-[#44403C] uppercase">Key Features (Bullet Points)</label>
                                            <button
                                                type="button"
                                                onClick={() => setServiceFeatureInputs([...serviceFeatureInputs, ''])}
                                                className="text-[11px] font-bold text-[#C2410C] flex items-center gap-1 hover:underline"
                                            >
                                                <Plus size={12} /> Add Feature
                                            </button>
                                        </div>
                                        {serviceFeatureInputs.map((feat, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={feat}
                                                    onChange={(e) => {
                                                        const updated = [...serviceFeatureInputs];
                                                        updated[fIdx] = e.target.value;
                                                        setServiceFeatureInputs(updated);
                                                    }}
                                                    placeholder={`Feature #${fIdx + 1} (e.g. 36 Guna Ashtakoot Scorecard)`}
                                                    className="flex-1 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                                />
                                                {serviceFeatureInputs.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setServiceFeatureInputs(serviceFeatureInputs.filter((_, i) => i !== fIdx))}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold p-3.5 rounded-xl shadow-sm hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                                    >
                                        <Check size={16} />
                                        {editingService ? 'Save Package Changes' : 'Publish Consultation Package'}
                                    </button>
                                </form>
                            </div>

                            {/* Live Preview Cards Grid */}
                            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {services.map(s => {
                                    const sTitle = s.name || s.title;
                                    return (
                                        <div key={s._id} className="bg-white p-5 rounded-3xl border border-[#EADCC8] shadow-sm flex flex-col justify-between relative group hover:border-[#C2410C] transition-all">
                                            {s.badge && (
                                                <div className="absolute -top-3 left-4 bg-[#C2410C] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                                                    {s.badge}
                                                </div>
                                            )}
                                            <div className="mt-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-serif font-bold text-[#1C1917] text-base">{sTitle}</h4>
                                                    <span className="text-[#C2410C] font-serif font-bold text-lg">
                                                        ₹{typeof s.price === 'number' ? s.price.toLocaleString('en-IN') : s.price}
                                                    </span>
                                                </div>
                                                <p className="text-[#C2410C] text-[11px] font-semibold mb-2">{s.category || 'Vedic Astrology'}</p>
                                                <p className="text-[#44403C] text-xs line-clamp-3 leading-relaxed mb-4">{s.description}</p>

                                                {s.features && s.features.length > 0 && (
                                                    <div className="space-y-1.5 border-t border-[#EADCC8] pt-3 mb-4">
                                                        {s.features.map((f, i) => (
                                                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#78716C]">
                                                                <CheckCircle2 size={12} className="text-[#C2410C] shrink-0" />
                                                                <span>{f}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-3 border-t border-[#EADCC8] flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingService(s);
                                                        setServiceFeatureInputs(s.features && s.features.length > 0 ? s.features : ['']);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="px-3 py-1.5 bg-[#EFF6FF] text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1"
                                                >
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteService(s._id)}
                                                    className="px-3 py-1.5 bg-[#FEF2F2] text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center gap-1"
                                                >
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION 3: STORE & SPIRITUAL PRODUCTS CONTROLLER
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'store' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Product Form */}
                            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#EADCC8] shadow-luxury space-y-4">
                                <div className="flex justify-between items-center border-b border-[#EADCC8] pb-3">
                                    <div>
                                        <h3 className="text-base font-serif font-bold text-[#1C1917]">
                                            {editingProduct ? 'Edit Store Item' : 'Add Spiritual Artifact'}
                                        </h3>
                                        <p className="text-[11px] text-[#78716C]">Gemstones, Rudraksha, Yantras, Puja Samagri</p>
                                    </div>
                                    {editingProduct && (
                                        <button onClick={() => setEditingProduct(null)} className="text-xs text-red-600 font-bold px-2 py-1 bg-red-50 rounded-lg">
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">Product Title</label>
                                        <input
                                            name="name"
                                            defaultValue={editingProduct?.name}
                                            placeholder="e.g. Yellow Sapphire (Pukhraj) - Certified Ceylon"
                                            required
                                            className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-bold text-[#44403C] uppercase mb-1">Price (₹)</label>
                                            <input
                                                name="price"
                                                defaultValue={editingProduct?.price}
                                                type="number"
                                                placeholder="25000"
                                                required
                                                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold text-[#44403C] uppercase mb-1">Category</label>
                                            <select
                                                name="category"
                                                defaultValue={editingProduct?.category || 'gemstones'}
                                                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                            >
                                                <option value="gemstones">Certified Gemstone</option>
                                                <option value="rudraksha">Nepali Rudraksha</option>
                                                <option value="yantras">Siddh Yantra</option>
                                                <option value="kawach">Protective Kawach</option>
                                                <option value="puja">Puja Samagri</option>
                                                <option value="books">Vedic Literature</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-bold text-[#44403C] uppercase mb-1">Weight / Carat</label>
                                            <input
                                                name="carat"
                                                defaultValue={editingProduct?.carat}
                                                placeholder="e.g. 4.25 Ratti"
                                                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold text-[#44403C] uppercase mb-1">Origin</label>
                                            <input
                                                name="origin"
                                                defaultValue={editingProduct?.origin}
                                                placeholder="e.g. Ceylon / Nepal"
                                                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-bold text-[#44403C] uppercase mb-1">Ruling Planet</label>
                                            <input
                                                name="rulingPlanet"
                                                defaultValue={editingProduct?.rulingPlanet}
                                                placeholder="e.g. Jupiter (Guru)"
                                                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold text-[#44403C] uppercase mb-1">Spiritual Power / Key Benefit</label>
                                            <input
                                                name="power"
                                                defaultValue={editingProduct?.power}
                                                placeholder="e.g. Wisdom & Wealth"
                                                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block font-bold text-[#44403C] uppercase">Item Image (Upload or URL)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="w-full bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EADCC8] text-xs text-[#78716C] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#FFF7ED] file:text-[#C2410C]"
                                        />
                                        <input
                                            name="image"
                                            placeholder="Or enter Image URL"
                                            defaultValue={uploadedImageUrl || editingProduct?.image}
                                            key={uploadedImageUrl || editingProduct?._id || 'prod_img'}
                                            className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">Spiritual Description & Mantra Energy</label>
                                        <textarea
                                            name="description"
                                            defaultValue={editingProduct?.description}
                                            placeholder="Describe authentic certification, consecration ritual..."
                                            rows="3"
                                            required
                                            className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="checkbox"
                                            name="inStock"
                                            id="inStock"
                                            defaultChecked={editingProduct ? editingProduct.inStock : true}
                                            className="w-4 h-4 text-[#C2410C] rounded"
                                        />
                                        <label htmlFor="inStock" className="font-bold text-[#1C1917]">Immediately Available (In Stock)</label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold p-3.5 rounded-xl shadow-sm hover:scale-[1.01] transition-transform"
                                    >
                                        {editingProduct ? 'Save Product Changes' : 'Publish Product to Live Store'}
                                    </button>
                                </form>
                            </div>

                            {/* Products Grid */}
                            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {products.map(p => (
                                    <div key={p._id} className="bg-white p-4 rounded-3xl border border-[#EADCC8] shadow-sm flex flex-col justify-between relative group hover:border-[#C2410C] transition-all">
                                        <div>
                                            <div className="flex gap-3">
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    className="w-20 h-20 object-cover rounded-2xl bg-[#FAF8F5] border border-[#EADCC8] shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-[#1C1917] text-sm line-clamp-1">{p.name}</h4>
                                                    <p className="text-[#C2410C] font-bold text-sm mt-0.5">
                                                        ₹{typeof p.price === 'number' ? p.price.toLocaleString('en-IN') : p.price}
                                                    </p>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EADCC8] text-[#78716C] capitalize inline-block mt-1">
                                                        {p.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-[#78716C] text-xs mt-2.5 line-clamp-2">{p.description}</p>
                                        </div>

                                        <div className="pt-3 border-t border-[#EADCC8] mt-3 flex items-center justify-between">
                                            <button
                                                onClick={() => toggleProductStock(p)}
                                                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                                                    p.inStock
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                                }`}
                                            >
                                                {p.inStock ? '● In Stock' : '○ Out of Stock'}
                                            </button>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => {
                                                        setEditingProduct(p);
                                                        setUploadedImageUrl(p.image);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="p-1.5 bg-[#EFF6FF] text-blue-600 rounded-lg shadow-sm"
                                                    title="Edit Product"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(p._id)}
                                                    className="p-1.5 bg-[#FEF2F2] text-red-600 rounded-lg shadow-sm"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION 4: BLOGS & VEDIC ARTICLES ENGINE
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'blogs' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Blog Editor Form */}
                            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#EADCC8] shadow-luxury space-y-4">
                                <div className="flex justify-between items-center border-b border-[#EADCC8] pb-3">
                                    <div>
                                        <h3 className="text-base font-serif font-bold text-[#1C1917]">
                                            {editingBlog ? 'Edit Vedic Article' : 'Compose New Article'}
                                        </h3>
                                        <p className="text-[11px] text-[#78716C]">SEO-optimized astrology, marriage, and Vastu guides</p>
                                    </div>
                                    {editingBlog && (
                                        <button onClick={() => setEditingBlog(null)} className="text-xs text-red-600 font-bold px-2 py-1 bg-red-50 rounded-lg">
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSaveBlog} className="space-y-3.5 text-xs">
                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">Article Headline / Title</label>
                                        <input
                                            name="title"
                                            defaultValue={editingBlog?.title}
                                            placeholder="e.g. Complete Guide to Kundli Milan for Marriage"
                                            required
                                            className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">Summary / Subtitle</label>
                                        <input
                                            name="subtitle"
                                            defaultValue={editingBlog?.subtitle}
                                            placeholder="Brief overview explaining what the reader learns..."
                                            className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-bold text-[#44403C] uppercase mb-1">Category</label>
                                            <select
                                                name="category"
                                                defaultValue={editingBlog?.category || 'Astrology'}
                                                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none"
                                            >
                                                <option value="Astrology">Vedic Astrology</option>
                                                <option value="Kundli Milan">Kundli Milan</option>
                                                <option value="Vastu Shastra">Vastu Shastra</option>
                                                <option value="Numerology">Numerology</option>
                                                <option value="Gemstones">Gemstones & Rudraksha</option>
                                                <option value="Festivals">Vedic Festivals & Muhurta</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-bold text-[#44403C] uppercase mb-1">Tags (Comma Separated)</label>
                                            <input
                                                name="tags"
                                                defaultValue={editingBlog?.tags?.join(', ') || ''}
                                                placeholder="Kundli, Marriage, Dosha"
                                                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none focus:border-[#C2410C]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block font-bold text-[#44403C] uppercase">Cover Image (Upload or URL)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="w-full bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EADCC8] text-xs text-[#78716C]"
                                        />
                                        <input
                                            name="image"
                                            placeholder="Or enter Image URL"
                                            defaultValue={uploadedImageUrl || editingBlog?.image}
                                            key={uploadedImageUrl || editingBlog?._id || 'blog_img'}
                                            className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">Article Content (Markdown / HTML)</label>
                                        <textarea
                                            name="content"
                                            defaultValue={editingBlog?.content}
                                            placeholder="Write in-depth Vedic predictions and advice..."
                                            rows="8"
                                            required
                                            className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold p-3.5 rounded-xl shadow-sm hover:scale-[1.01] transition-transform"
                                    >
                                        {editingBlog ? 'Update Article' : 'Publish Article to Blog'}
                                    </button>
                                </form>
                            </div>

                            {/* Blog List */}
                            <div className="lg:col-span-7 space-y-4">
                                {blogs.map(blog => (
                                    <div key={blog._id} className="bg-white p-4 rounded-3xl border border-[#EADCC8] shadow-sm flex gap-4 relative group hover:border-[#C2410C] transition-all">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-28 h-20 object-cover rounded-2xl bg-[#FAF8F5] border border-[#EADCC8] shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-[#1C1917] text-sm line-clamp-1">{blog.title}</h4>
                                            <p className="text-[#78716C] text-xs mt-0.5">
                                                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Published'} • <span className="text-[#C2410C] font-semibold">{blog.category}</span>
                                            </p>
                                            <p className="text-[#78716C] text-xs mt-1.5 line-clamp-2">{blog.subtitle || blog.content}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => {
                                                    setEditingBlog(blog);
                                                    setUploadedImageUrl(blog.image);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="p-2 bg-[#EFF6FF] text-blue-600 rounded-xl shadow-sm"
                                                title="Edit Article"
                                            >
                                                <Edit2 size={13} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBlog(blog._id)}
                                                className="p-2 bg-[#FEF2F2] text-red-600 rounded-xl shadow-sm"
                                                title="Delete Article"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION 5: VIDEOS & SATSANG MEDIA
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'videos' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#EADCC8] shadow-luxury space-y-4">
                                <div className="flex justify-between items-center border-b border-[#EADCC8] pb-3">
                                    <h3 className="text-base font-serif font-bold text-[#1C1917]">{editingVideo ? 'Edit Video Link' : 'Add New Satsang / Reel'}</h3>
                                    {editingVideo && <button onClick={() => setEditingVideo(null)} className="text-xs text-red-600 font-bold">Cancel</button>}
                                </div>
                                <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">Video Title</label>
                                        <input name="title" defaultValue={editingVideo?.title} placeholder="e.g. Navamsha Chart Secrets Explained" required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">YouTube or Instagram Reel URL</label>
                                        <input name="url" defaultValue={editingVideo ? (editingVideo.platform === 'instagram' ? `https://instagram.com/reel/${editingVideo.ytId}/` : `https://youtube.com/watch?v=${editingVideo.ytId}`) : ''} placeholder="https://youtube.com/watch?v=..." required className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-[#44403C] uppercase mb-1">Description</label>
                                        <textarea name="desc" defaultValue={editingVideo?.desc || editingVideo?.description} placeholder="Video highlights..." rows="3" className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none" />
                                    </div>
                                    <button type="submit" className="w-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold p-3.5 rounded-xl shadow-sm hover:scale-[1.01] transition-transform">
                                        {editingVideo ? 'Save Changes' : 'Publish Video to Gallery'}
                                    </button>
                                </form>
                            </div>

                            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {videos.map(v => (
                                    <div key={v._id} className="bg-white rounded-3xl border border-[#EADCC8] overflow-hidden group relative shadow-sm">
                                        <div className="aspect-video relative bg-[#1C1917]">
                                            <img src={`https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg`} alt={v.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                                <button onClick={() => { setEditingVideo(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-white text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold">Edit</button>
                                                <button onClick={() => handleDeleteVideo(v._id)} className="bg-white text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold">Delete</button>
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

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION 6: ORDERS & COMMERCE PIPELINE
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'orders' && (
                        <div className="bg-white border border-[#EADCC8] rounded-3xl shadow-luxury overflow-hidden">
                            <div className="p-6 border-b border-[#EADCC8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-base font-serif font-bold text-[#1C1917]">Spiritual Store & Commerce Orders</h3>
                                    <p className="text-xs text-[#78716C]">Razorpay payments, shipping dispatch addresses, and tracking management</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-[#78716C] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#EADCC8]">
                                        {orders.length} Total Orders
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {orders.length === 0 ? (
                                    <div className="p-16 text-center text-[#78716C] text-xs">No orders recorded yet.</div>
                                ) : (
                                    orders.map(order => (
                                        <div
                                            key={order._id}
                                            className="bg-[#FAF8F5] border border-[#EADCC8] rounded-2xl p-5 hover:border-[#FED7AA] transition-all shadow-sm space-y-4"
                                        >
                                            {/* Order Top Bar */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EADCC8]">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="font-mono text-xs font-bold text-[#C2410C]">
                                                        {order.receiptNumber || `ORD-${order._id.slice(-6)}`}
                                                    </span>
                                                    <span className="text-[11px] text-[#78716C]">
                                                        • Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                                        order.status === 'Delivered' || order.status === 'Completed'
                                                            ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                                                            : order.status === 'Shipped'
                                                            ? 'border-blue-200 text-blue-700 bg-blue-50'
                                                            : order.status === 'Paid' || order.status === 'Processing'
                                                            ? 'border-amber-200 text-amber-700 bg-amber-50'
                                                            : 'border-stone-200 text-stone-700 bg-stone-50'
                                                    }`}>
                                                        {order.status}
                                                    </span>

                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value, order.trackingNumber || '')}
                                                        className="px-2.5 py-1 bg-white border border-[#EADCC8] rounded-lg text-xs font-semibold text-[#44403C] focus:outline-none focus:border-[#C2410C]"
                                                    >
                                                        <option value="Paid">Paid</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>

                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className="text-[#A8A29E] hover:text-red-500 transition-colors p-1"
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Details 3-Column Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                {/* Customer Contact */}
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[#44403C] uppercase text-[10px] tracking-wider block">Customer Details</span>
                                                    <div className="font-bold text-[#1C1917]">{order.customerName}</div>
                                                    <div className="text-[#C2410C] font-mono">{order.customerPhone}</div>
                                                    {order.customerEmail && <div className="text-[#78716C] text-[11px]">{order.customerEmail}</div>}
                                                </div>

                                                {/* Shipping Address */}
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[#44403C] uppercase text-[10px] tracking-wider block">Shipping Address</span>
                                                    <p className="text-[#1C1917] leading-relaxed">
                                                        {order.shippingAddress || 'No street address provided'}
                                                    </p>
                                                    <div className="text-[#78716C] text-[11px]">
                                                        {order.city ? `${order.city}, ${order.state || ''} - ${order.pincode || ''}` : ''}
                                                    </div>
                                                </div>

                                                {/* Payment & Amount */}
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[#44403C] uppercase text-[10px] tracking-wider block">Payment Details</span>
                                                    <div className="text-base font-bold text-[#C2410C]">
                                                        ₹{(order.totalAmount || order.productPrice || 0).toLocaleString('en-IN')}
                                                    </div>
                                                    <div className="text-[10px] text-[#78716C] font-mono">
                                                        Payment ID: {order.paymentDetails?.razorpay_payment_id || order.utrNumber || 'Razorpay Verified'}
                                                    </div>
                                                    <div className="text-[10px] text-[#78716C]">
                                                        Method: {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'RAZORPAY'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Items Breakdown */}
                                            {order.items && order.items.length > 0 ? (
                                                <div className="pt-3 border-t border-[#EADCC8] space-y-2">
                                                    <span className="font-bold text-[#44403C] uppercase text-[10px] tracking-wider block">
                                                        Items in Order ({order.items.length})
                                                    </span>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                        {order.items.map((it, idx) => (
                                                            <div key={idx} className="bg-white border border-[#EADCC8] rounded-xl p-2.5 flex items-center gap-2.5">
                                                                {it.image && (
                                                                    <img src={it.image} alt={it.name} className="w-10 h-10 rounded-lg object-cover bg-[#FAF8F5] shrink-0" />
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-bold text-[#1C1917] text-[11px] truncate">{it.name}</div>
                                                                    <div className="text-[10px] text-[#78716C]">
                                                                        Qty: <strong className="text-[#1C1917]">{it.quantity || 1}</strong> • ₹{(it.price * (it.quantity || 1)).toLocaleString('en-IN')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="pt-2 border-t border-[#EADCC8] text-[11px] text-[#44403C]">
                                                    <strong>Item:</strong> {order.productName}
                                                </div>
                                            )}

                                            {/* Dispatch & WhatsApp Update Actions */}
                                            <div className="pt-3 border-t border-[#EADCC8] flex flex-col sm:flex-row items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <input
                                                        type="text"
                                                        placeholder="Add Courier Tracking No..."
                                                        defaultValue={order.trackingNumber || ''}
                                                        onBlur={(e) => {
                                                            if (e.target.value !== order.trackingNumber) {
                                                                handleUpdateOrderStatus(order._id, order.status, e.target.value);
                                                            }
                                                        }}
                                                        className="px-3 py-1.5 bg-white border border-[#EADCC8] rounded-lg text-xs text-[#1C1917] focus:outline-none focus:border-[#C2410C] w-full sm:w-64"
                                                    />
                                                </div>

                                                <a
                                                    href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                                        `*AstroPravin Order Update* 📦\n\nNamaste ${order.customerName},\nYour consecrated order (Ref: ${order.receiptNumber || order._id.slice(-6)}) is currently *${order.status}*.\n\n${order.trackingNumber ? `*Courier Tracking:* ${order.trackingNumber}\n\n` : ''}For any queries, please feel free to message us.\n\n🙏 Pandit Pravin Shriram`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold transition-all shrink-0"
                                                >
                                                    <MessageCircle size={13} />
                                                    <span>Notify on WhatsApp</span>
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION 7: MATRIMONY PIPELINE
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'matrimony' && (
                        <MatrimonyAdminTab />
                    )}

                    {/* ════════════════════════════════════════════════════════════════
                        SECTION 8: KENDRA SITE SETTINGS CONTROLLER
                    ════════════════════════════════════════════════════════════════ */}
                    {activeNav === 'settings' && (
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADCC8] shadow-luxury max-w-3xl space-y-6">
                            <div>
                                <h3 className="text-lg font-serif font-bold text-[#1C1917]">Kendra Site & Helpline Settings</h3>
                                <p className="text-xs text-[#78716C]">Configure public contact details, emergency banner, and consultation defaults</p>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); showToast('Settings Saved Successfully'); }} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-bold text-[#44403C] uppercase mb-1">Official Kendra Helpline / WhatsApp</label>
                                    <input
                                        type="text"
                                        value={siteSettings.helplineNumber}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, helplineNumber: e.target.value })}
                                        className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-[#44403C] uppercase mb-1">Official Email Address</label>
                                    <input
                                        type="email"
                                        value={siteSettings.kendraEmail}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, kendraEmail: e.target.value })}
                                        className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-[#44403C] uppercase mb-1 flex items-center justify-between">
                                        <span>Google Calendar Account Email (Appointment Notifications)</span>
                                        <span className="text-[10px] text-[#C2410C] font-semibold bg-[#FFF7ED] px-2 py-0.5 rounded-md border border-[#FED7AA]">Instant Calendar Sync</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={siteSettings.googleCalendarEmail || ''}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, googleCalendarEmail: e.target.value })}
                                        placeholder="e.g. pravin.shriram@gmail.com"
                                        className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none font-mono"
                                    />
                                    <p className="text-[11px] text-[#78716C] mt-1">
                                        Whenever a devotee books an appointment, this Google Calendar account receives invitations with automatic reminder alarms (30m & 15m).
                                    </p>
                                </div>

                                <div>
                                    <label className="block font-bold text-[#44403C] uppercase mb-1">Kendra Physical Address (Solapur)</label>
                                    <textarea
                                        rows="2"
                                        value={siteSettings.kendraAddress}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, kendraAddress: e.target.value })}
                                        className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-[#44403C] uppercase mb-1">Notice Banner Announcement</label>
                                    <input
                                        type="text"
                                        value={siteSettings.noticeBannerText}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, noticeBannerText: e.target.value })}
                                        className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#EADCC8] text-[#1C1917] outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-bold px-6 py-3 rounded-xl shadow-sm hover:scale-[1.01] transition-transform"
                                >
                                    Save Site Configuration
                                </button>
                            </form>
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
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C2410C] bg-[#FFF7ED] px-2 py-0.5 rounded-full border border-[#FED7AA]">
                                            Client Dossier
                                        </span>
                                        <span className="text-[10px] font-mono text-[#78716C]">
                                            {selectedBookingDrawer.type}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-[#1C1917] mt-1">{selectedBookingDrawer.name}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedBookingDrawer(null)}
                                    className="p-2 rounded-full hover:bg-[#FAF8F5] text-[#78716C]"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Google Calendar 1-Click Sync Card */}
                            <div className="p-4 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A] space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#92400E] flex items-center gap-1.5">
                                        <Calendar size={14} className="text-[#D97706]" /> Google Calendar Sync & Reminders
                                    </span>
                                    <span className="text-[10px] bg-[#FEF3C7] text-[#B45309] font-bold px-2 py-0.5 rounded-full border border-[#FCD34D]">
                                        Auto Alarms (30m & 15m)
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#78716C] leading-relaxed">
                                    Sync this consultation directly to your Google Calendar. Notifications and reminders will pop up on your devices automatically at the selected time.
                                </p>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <a
                                        href={generateGoogleCalendarUrl(selectedBookingDrawer, siteSettings.googleCalendarEmail || siteSettings.kendraEmail)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-2.5 px-3 bg-[#D97706] hover:bg-[#B45309] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm text-xs transition-colors"
                                    >
                                        <Calendar size={14} /> Add to Google Cal
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => downloadIcsFile(selectedBookingDrawer)}
                                        className="py-2.5 px-3 bg-white hover:bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs transition-colors"
                                    >
                                        <FileDown size={14} /> Download .ICS File
                                    </button>
                                </div>
                            </div>

                            {/* Status & Quick WhatsApp */}
                            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EADCC8] space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#44403C]">Consultation Status Stage</span>
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
                                        href={`https://wa.me/${selectedBookingDrawer.phone.replace(/\D/g, '').length === 10 ? '91' + selectedBookingDrawer.phone.replace(/\D/g, '') : selectedBookingDrawer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Pranam ${selectedBookingDrawer.name}, Pandit Pravin Shriram here regarding your Vedic consultation on ${selectedBookingDrawer.topic}:`)}`}
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
                                <h4 className="font-serif font-bold text-sm text-[#1C1917]">Consultation Details</h4>
                                <div className="space-y-2 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EADCC8]">
                                    <div className="flex justify-between">
                                        <span className="text-[#78716C]">Topic:</span>
                                        <strong className="text-[#C2410C] font-bold">{selectedBookingDrawer.topic}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#78716C]">Preferred Date:</span>
                                        <strong>{selectedBookingDrawer.preferredDate || 'Flexible'}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#78716C]">Preferred Time:</span>
                                        <strong>{selectedBookingDrawer.preferredTime || 'Any Time Slot'}</strong>
                                    </div>
                                    {selectedBookingDrawer.notes && (
                                        <div className="pt-2 border-t border-[#EADCC8]/60">
                                            <span className="text-[#78716C] block mb-1">Panditji Notes:</span>
                                            <p className="text-xs text-[#44403C] bg-white p-2 rounded-xl border border-[#EADCC8]">
                                                {selectedBookingDrawer.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-[#EADCC8] flex gap-2">
                                <button
                                    onClick={() => {
                                        const text = `*AstroPravin Client Dossier*\nName: ${selectedBookingDrawer.name}\nPhone: ${selectedBookingDrawer.phone}\nTopic: ${selectedBookingDrawer.topic}\nDOB: ${selectedBookingDrawer.birthDate} at ${selectedBookingDrawer.birthTime}\nPlace: ${selectedBookingDrawer.birthPlace}\nType: ${selectedBookingDrawer.type}`;
                                        navigator.clipboard.writeText(text);
                                        showToast('Copied to Clipboard!');
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

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePage, useForm, router } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Tag,
    Activity,
    PlusCircle,
    Wallet,
    Download,
    Upload,
    Users,
    PieChart,
    TrendingUp,
    TrendingDown,
    Calendar,
    User,
    Check,
    BadgeCheck,
    RefreshCw,
    RotateCcw,
    AlertCircle,
    Trash2,
    ChevronRight,
    Info,
    Plus,
    ArrowLeft,
    Trash,
    Search,
    Filter,
    Eye,
    EyeOff,
    Edit,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    X,
    Lock,
    Mail,
    LogOut,
    Utensils,
    Car,
    FileText,
    Tv,
    HeartPulse,
    Grid,
    Settings,
    Shield,
    UserPlus,
    UserMinus,
    ChevronDown,
    Bell,
    ArrowUp,
    CheckCircle2,
    Lightbulb,
    Coffee,
    CreditCard,
    Package,
    Bike,
    Home,
    Flame,
    Wrench,
    Fuel,
    ShoppingCart,
    Droplets,
    Sparkles,
    Wifi,
    HandCoins,
    Apple,
    Monitor,
    Smartphone,
    KeyRound,
    CheckCircle,
} from "lucide-react";
import ExecutiveDashboard from "../Components/ExecutiveDashboard";

const ICON_MAP = {
    Utensils,
    Car,
    FileText,
    Tv,
    HeartPulse,
    Grid,
    Package,
    CreditCard,
    Bike,
    Home,
    Flame,
    Wrench,
    Fuel,
    ShoppingCart,
    Droplets,
    Sparkles,
    Wifi,
    Coffee,
    HandCoins,
    Apple,
};

const AVAILABLE_PERMISSIONS = [
    {
        key: "catat_transaksi",
        label: "Catat Transaksi",
        desc: "Dapat mencatat pengeluaran & pemasukan harian",
    },
    {
        key: "lihat_laporan",
        label: "Lihat Laporan",
        desc: "Melihat ringkasan & riwayat transaksi",
    },
    {
        key: "kelola_dompet",
        label: "Kelola Dompet",
        desc: "Menambah & mengatur dompet/rekening",
    },
    {
        key: "lihat_dompet",
        label: "Lihat Dompet",
        desc: "Melihat dompet/rekening",
    },
    {
        key: "topup_dompet",
        label: "Top Up Dompet",
        desc: "Menambah saldo top up untuk dompet",
    },
    {
        key: "kelola_kategori",
        label: "Kelola Kategori",
        desc: "Menambah & mengedit kategori pengeluaran",
    },
    {
        key: "atur_budget",
        label: "Atur Budget",
        desc: "Mengatur anggaran bulanan per kategori",
    },
    {
        key: "kelola_anggota",
        label: "Kelola Anggota",
        desc: "Menambah & mengelola anggota keluarga",
    },
    {
        key: "ekspor_data",
        label: "Ekspor Data",
        desc: "Mengunduh laporan dalam format CSV",
    },
    {
        key: "lihat_log",
        label: "Lihat Log",
        desc: "Melihat log activity",
    },
    {
        key: "reset_data",
        label: "Reset Data",
        desc: "Mereset data seluruh aplikasi",
    }
];

const ROLE_PERMISSIONS = {
    Admin: [
        "kelola_dompet",
        "kelola_anggota",
        "lihat_log",
        "reset_data",
        "lihat_laporan",
        "atur_budget",
        "ekspor_data",
        "kelola_kategori"
    ],
    Suami: [
        "lihat_dompet",
        "topup_dompet",
        "catat_transaksi",
        "kelola_kategori",
        "lihat_laporan",
        "atur_budget",
        "ekspor_data"
    ],
    Istri: [
        "lihat_dompet",
        "topup_dompet",
        "catat_transaksi",
        "kelola_kategori",
        "lihat_laporan",
        "atur_budget",
        "ekspor_data"
    ],
    Anggota: [
        "lihat_dompet",
        "catat_transaksi",
        "lihat_laporan"
    ],
};

const INITIAL_MEMBERS = [
    {
        id: "m1",
        name: "Admin Fikrikeluarga",
        role: "Admin",
        avatarColor: "bg-indigo-600",
        email: "admin@fikrifamily.com",
        permissions: ROLE_PERMISSIONS["Admin"],
    },
    {
        id: "m2",
        name: "Suami",
        role: "Suami",
        avatarColor: "bg-blue-500",
        email: "fhm@fikrifamily.com",
        permissions: ROLE_PERMISSIONS["Suami"],
    },
    {
        id: "m3",
        name: "Istri",
        role: "Istri",
        avatarColor: "bg-pink-500",
        email: "adhs@fikrifamily.com",
        permissions: ROLE_PERMISSIONS["Istri"],
    },
];

const INITIAL_CATEGORIES = [
    { id: "c1", name: "Makan", icon: "Utensils", color: "bg-orange-500", budget: 1500000 },
    { id: "c2", name: "Jajan", icon: "Package", color: "bg-yellow-500", budget: 500000 },
    { id: "c3", name: "Kartu KRL", icon: "CreditCard", color: "bg-blue-500", budget: 200000 },
    { id: "c4", name: "Lainnya", icon: "Grid", color: "bg-slate-500", budget: 300000 },
    { id: "c5", name: "Penitipan motor", icon: "Bike", color: "bg-indigo-500", budget: 100000 },
    { id: "c6", name: "Pokok", icon: "Home", color: "bg-emerald-500", budget: 2000000 },
    { id: "c7", name: "Rokok", icon: "Flame", color: "bg-red-500", budget: 400000 },
    { id: "c8", name: "Permotoran", icon: "Wrench", color: "bg-zinc-600", budget: 300000 },
    { id: "c9", name: "Bensin", icon: "Fuel", color: "bg-cyan-500", budget: 400000 },
    { id: "c10", name: "Kebutuhan dapur", icon: "ShoppingCart", color: "bg-amber-600", budget: 800000 },
    { id: "c11", name: "Kebersihan", icon: "Droplets", color: "bg-teal-400", budget: 150000 },
    { id: "c12", name: "Skincare & Bodycare", icon: "Sparkles", color: "bg-pink-400", budget: 300000 },
    { id: "c13", name: "Kuota", icon: "Wifi", color: "bg-violet-500", budget: 150000 },
    { id: "c14", name: "Ngopi", icon: "Coffee", color: "bg-stone-600", budget: 300000 },
    { id: "c15", name: "Piutang", icon: "HandCoins", color: "bg-lime-600", budget: 500000 },
    { id: "c16", name: "Buah-buahan", icon: "Apple", color: "bg-red-400", budget: 200000 },
];

const INITIAL_WALLETS = [
    { id: "w1", name: "Rekening Utama (BCA)", balance: 8500000, type: "Bank" },
    { id: "w2", name: "Dompet Tunai Ibu", balance: 1200000, type: "Tunai" },
    {
        id: "w3",
        name: "Dana Darurat (Mandiri)",
        balance: 5000000,
        type: "Investasi",
    },
];

const INITIAL_TRANSACTIONS = [
    {
        id: "t1",
        date: "2026-07-01",
        description: "Belanja Bulanan Carrefour",
        amount: 1200000,
        type: "expense",
        categoryId: "c1",
        walletId: "w1",
        memberId: "m2",
    },
    {
        id: "t2",
        date: "2026-07-02",
        description: "Isi Bensin Mobil",
        amount: 350000,
        type: "expense",
        categoryId: "c2",
        walletId: "w1",
        memberId: "m1",
    },
    {
        id: "t3",
        date: "2026-07-03",
        description: "Pembayaran Listrik & Wifi",
        amount: 850000,
        type: "expense",
        categoryId: "c3",
        walletId: "w1",
        memberId: "m1",
    },
    {
        id: "t4",
        date: "2026-07-04",
        description: "Tiket Bioskop & Snack",
        amount: 250000,
        type: "expense",
        categoryId: "c4",
        walletId: "w2",
        memberId: "m3",
    },
    {
        id: "t5",
        date: "2026-07-05",
        description: "Pemasukan Gaji Bulanan",
        amount: 15000000,
        type: "income",
        categoryId: "c6",
        walletId: "w1",
        memberId: "m1",
    },
    {
        id: "t6",
        date: "2026-07-05",
        description: "Beli Obat Apotek",
        amount: 150000,
        type: "expense",
        categoryId: "c5",
        walletId: "w2",
        memberId: "m2",
    },
];

export default function App({ auth, initialMembers, initialCategories, initialWallets, initialTransactions, activeSessions }) {
    const currentUser = auth?.user || null;
    const isLoggedIn = !!currentUser;

    // Fallback to INITIAL_ constants if database props are empty/undefined (e.g. before full integration)
    const [transactions, setTransactions] = useState(initialTransactions || INITIAL_TRANSACTIONS);
    const [categories, setCategories] = useState(initialCategories || INITIAL_CATEGORIES);
    const [wallets, setWallets] = useState(initialWallets || INITIAL_WALLETS);
    const [members, setMembers] = useState(initialMembers || INITIAL_MEMBERS);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    // Import States
    const [importedData, setImportedData] = useState([]);
    const [importFileName, setImportFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importSearchQuery, setImportSearchQuery] = useState("");
    const [importCurrentPage, setImportCurrentPage] = useState(1);
    const [importItemsPerPage, setImportItemsPerPage] = useState(5);

    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedResetMonths, setSelectedResetMonths] = useState([]);
    const [selectedResetRole, setSelectedResetRole] = useState("all");
    const [isResetting, setIsResetting] = useState(false);

    const availableTransactionMonths = useMemo(() => {
        const monthsSet = new Set();
        
        // Add current month as a default fallback
        const now = new Date();
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        monthsSet.add(currentMonthStr);
        
        transactions.forEach(t => {
            if (t.date) {
                const m = t.date.substring(0, 7);
                if (m && /^\d{4}-\d{2}$/.test(m)) {
                    monthsSet.add(m);
                }
            }
        });
        
        return Array.from(monthsSet).sort().reverse();
    }, [transactions]);

    const formatMonthYear = (monthStr) => {
        if (!monthStr || !monthStr.includes('-')) return monthStr;
        const [year, month] = monthStr.split('-');
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const monthIdx = parseInt(month, 10) - 1;
        if (monthIdx < 0 || monthIdx > 11) return monthStr;
        return `${monthNames[monthIdx]} ${year}`;
    };

    const handleResetSubmit = () => {
        if (selectedResetMonths.length === 0) return;
        let confirmMsg = `Apakah Anda yakin ingin menghapus data transaksi untuk ${selectedResetMonths.length} bulan terpilih`;
        if (selectedResetRole !== 'all') {
            confirmMsg += ` (Role ${selectedResetRole})`;
        } else {
            confirmMsg += ` serta mereset seluruh data kategori & kantong ke data bawaan`;
        }
        confirmMsg += "? Tindakan ini tidak dapat dibatalkan.";
        if (!confirm(confirmMsg)) return;
        
        setIsResetting(true);
        axios.post(route('profile.reset-data'), { months: selectedResetMonths, role: selectedResetRole })
            .then(res => {
                showToast("Data transaksi berhasil di-reset.");
                setIsResetModalOpen(false);
                setSelectedResetMonths([]);
                router.reload({
                    preserveState: true,
                    onSuccess: () => {
                        axios.get('/api/dashboard/metrics?force_recalculate=true');
                    }
                });
            })
            .catch(err => {
                console.error(err);
                showToast("Gagal melakukan reset data.", "error");
            })
            .finally(() => {
                setIsResetting(false);
            });
    };

    const hasPermission = (permKey) => {
        if (!currentUser) return false;
        if (currentUser.role === "Administrator") return true;
        return currentUser.permissions?.includes(permKey);
    };

    const [activeTab, setActiveTab] = useState(isLoggedIn ? (currentUser.role === "Administrator" || currentUser.permissions?.includes("lihat_laporan") ? "dashboard" : "profile") : "dashboard");
    const [activeSettingsTab, setActiveSettingsTab] = useState("profile");
    
    // Form States for Profile and Security
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const { data: profileData, setData: setProfileData, post: postProfile, processing: processingProfile, errors: profileErrors, recentlySuccessful: profileSuccessful } = useForm({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        avatar: null,
        _method: 'PATCH'
    });
    
    const { data: pwdData, setData: setPwdData, put: putPassword, processing: processingPwd, errors: pwdErrors, reset: resetPwd, recentlySuccessful: pwdSuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });


    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let retVal = "";
        // Ensure at least one uppercase, one lowercase, one numeric, and one symbol
        retVal += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
        retVal += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
        retVal += "0123456789"[Math.floor(Math.random() * 10)];
        retVal += "!@#$%^&*()_+~`|}{[]:;?><,./-="[Math.floor(Math.random() * 29)];
        for (let i = 0, n = charset.length; i < 12; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        // Shuffle the string
        retVal = retVal.split('').sort(() => 0.5 - Math.random()).join('');
        setPwdData(data => ({ ...data, password: retVal, password_confirmation: retVal }));
    };
    
    const evaluatePasswordStrength = (pwd) => {
        let score = 0;
        if (pwd.length > 8) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[a-z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
        
        if (score === 0) return { label: 'Kosong', color: 'bg-slate-200' };
        if (score <= 2) return { label: 'Lemah', color: 'bg-rose-500', width: '25%' };
        if (score <= 3) return { label: 'Sedang', color: 'bg-yellow-500', width: '50%' };
        if (score === 4) return { label: 'Kuat', color: 'bg-blue-500', width: '75%' };
        return { label: 'Sangat Kuat', color: 'bg-emerald-500', width: '100%' };
    };

    const submitProfileUpdate = (e) => {
        e.preventDefault();
        postProfile(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                showToast("Profil berhasil diperbarui");
                setActiveSettingsTab("profile");
            }
        });
    };

    const submitPasswordUpdate = (e) => {
        e.preventDefault();
        putPassword(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                showToast("Password berhasil diubah");
                resetPwd();
            },
            onError: (errors) => {
                if (errors.password) {
                    resetPwd('password', 'password_confirmation');
                }
                if (errors.current_password) {
                    resetPwd('current_password');
                }
            }
        });
    };

    
    // Logs State
    const [activityLogs, setActivityLogs] = useState([]);
    const [logsPage, setLogsPage] = useState(1);
    const [logsLastPage, setLogsLastPage] = useState(1);
    const [logsTotal, setLogsTotal] = useState(0);
    const [logsFrom, setLogsFrom] = useState(0);
    const [logsTo, setLogsTo] = useState(0);
    const [logsPerPage, setLogsPerPage] = useState(10);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

    const fetchLogs = async (page = 1, perPage = logsPerPage) => {
        setIsLoadingLogs(true);
        try {
            const res = await axios.get(`/logs?page=${page}&per_page=${perPage}`);
            setActivityLogs(res.data.data);
            setLogsPage(res.data.current_page);
            setLogsLastPage(res.data.last_page);
            setLogsTotal(res.data.total);
            setLogsFrom(res.data.from || 0);
            setLogsTo(res.data.to || 0);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    // Load initial logs when tab is opened
    useEffect(() => {
        if (activeSettingsTab === "logs" && activityLogs.length === 0) {
            fetchLogs(1, logsPerPage);
        }
    }, [activeSettingsTab]);

    // Refetch when logsPerPage changes
    useEffect(() => {
        if (activeSettingsTab === "logs") {
            fetchLogs(1, logsPerPage);
        }
    }, [logsPerPage]);

    const logActivity = (action, description, icon = 'Activity', color = 'bg-blue-500') => {
        axios.post('/logs', { action, description, icon, color })
            .then(res => {
                if (activeSettingsTab === "logs" && logsPage === 1) {
                    fetchLogs(1, logsPerPage);
                }
            })
            .catch(err => console.error('Failed to log activity', err));
    };

    useEffect(() => {
        if (initialTransactions) setTransactions(initialTransactions);
        if (initialCategories) setCategories(initialCategories);
        if (initialWallets) setWallets(initialWallets);
        if (initialMembers) setMembers(initialMembers);
    }, [initialTransactions, initialCategories, initialWallets, initialMembers]);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const [isAddingTx, setIsAddingTx] = useState(false);
    const [bulkTransactions, setBulkTransactions] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterMember, setFilterMember] = useState("all");
    const [filterWallet, setFilterWallet] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showFilters, setShowFilters] = useState(false);

    const [editingTx, setEditingTx] = useState(null);

    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [topUpData, setTopUpData] = useState({ walletId: '', amount: '' });
    const [walletTxPage, setWalletTxPage] = useState(1);


    const [showColumnDropdown, setShowColumnDropdown] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        date: true,
        description: true,
        category: true,
        member: true,
        wallet: true,
        amount: true,
        action: true,
    });

    const [newCat, setNewCat] = useState({
        id: null,
        name: "",
        budget: "",
        icon: "Grid",
        color: "bg-blue-500",
    });
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showAddWalletModal, setShowAddWalletModal] = useState(false);
    const [walletSearch, setWalletSearch] = useState("");
    const [walletCategoryFilter, setWalletCategoryFilter] = useState("all");
    const [newWallet, setNewWallet] = useState({
        id: null,
        name: "",
        balance: "",
        type: "Bank",
        color: "bg-blue-600",
        icon: "Wallet",
    });
    const [newMember, setNewMember] = useState({
        id: null,
        name: "",
        role: "Anggota",
        permissions: [...ROLE_PERMISSIONS["Anggota"]],
    });
    const [selectedMemberForDetail, setSelectedMemberForDetail] = useState(null);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

    const [budgetStartDate, setBudgetStartDate] = useState("");
    const [budgetEndDate, setBudgetEndDate] = useState("");
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2026);
    const [selectedMonth, setSelectedMonth] = useState(7);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // PWA Install State
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Tampilkan ketika mendekati paling bawah (margin 150px) dan sudah ter-scroll
            const isBottom =
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 150;
            setShowScrollTop(window.scrollY > 100 && isBottom);
        };

        window.addEventListener("scroll", handleScroll);

        // PWA Install Prompt Listener
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPrompt(e);
            setShowInstallBanner(true);
        };
        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt,
        );

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt,
            );
        };
    }, []);

    const handleInstallApp = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === "accepted") {
            console.log("User accepted the install prompt");
        }
        setInstallPrompt(null);
        setShowInstallBanner(false);
    };

    const aiInsights = [
        {
            text: "Pengeluaran makan meningkat 12% dibanding bulan lalu. Pertimbangkan untuk lebih sering memasak di rumah.",
            type: "warning",
        },
        {
            text: "Saving Rate Anda sangat sehat di angka 40%, pertahankan momentum ini!",
            type: "success",
        },
        {
            text: "Budget Belanja telah over budget sebesar Rp 500.000.",
            type: "alert",
        },
        {
            text: "Kategori transport mengalami penurunan sebesar 8%.",
            type: "info",
        },
    ];

    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchQuery,
        filterStartDate,
        filterEndDate,
        filterCategory,
        filterMember,
        filterWallet,
        itemsPerPage,
    ]);

    const formatIDR = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val);
    };

    const totalIncome = useMemo(() => {
        return transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
    }, [transactions]);

    const totalExpense = useMemo(() => {
        return transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
    }, [transactions]);

    const totalWalletBalance = useMemo(() => {
        return wallets.reduce((sum, w) => sum + w.balance, 0);
    }, [wallets]);

    const totalBudget = useMemo(() => {
        return categories.reduce((sum, c) => sum + (c.budget || 0), 0);
    }, [categories]);

    const expenseByCategory = useMemo(() => {
        const map = {};
        categories.forEach((c) => {
            map[c.id] = 0;
        });
        transactions
            .filter((t) => t.type === "expense")
            .forEach((t) => {
                if (map[t.categoryId] !== undefined) {
                    map[t.categoryId] += t.amount;
                }
            });
        return map;
    }, [transactions, categories]);

    const expenseByCategoryForSelectedMonth = useMemo(() => {
        const map = {};
        categories.forEach((c) => {
            map[c.id] = 0;
        });
        transactions
            .filter((t) => {
                if (t.type !== "expense") return false;
                const txDate = new Date(t.date);
                return (
                    txDate.getMonth() + 1 === selectedMonth &&
                    txDate.getFullYear() === selectedYear
                );
            })
            .forEach((t) => {
                if (map[t.categoryId] !== undefined) {
                    map[t.categoryId] += t.amount;
                }
            });
        return map;
    }, [transactions, categories, selectedMonth, selectedYear]);

    const expenseByMember = useMemo(() => {
        const map = {};
        members.forEach((m) => {
            map[m.id] = 0;
        });
        transactions
            .filter((t) => t.type === "expense")
            .forEach((t) => {
                if (map[t.memberId] !== undefined) {
                    map[t.memberId] += t.amount;
                }
            });
        return map;
    }, [transactions, members]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            const matchesSearch = tx.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            let matchesDate = true;
            if (filterStartDate) {
                matchesDate = matchesDate && tx.date >= filterStartDate;
            }
            if (filterEndDate) {
                matchesDate = matchesDate && tx.date <= filterEndDate;
            }

            const matchesCategory =
                filterCategory === "all" || tx.categoryId === filterCategory;
            const matchesMember =
                filterMember === "all" || tx.memberId === filterMember;
            const matchesWallet =
                filterWallet === "all" || tx.walletId === filterWallet;

            return (
                matchesSearch &&
                matchesDate &&
                matchesCategory &&
                matchesMember &&
                matchesWallet
            );
        });
    }, [
        transactions,
        searchQuery,
        filterStartDate,
        filterEndDate,
        filterCategory,
        filterMember,
        filterWallet,
    ]);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(
            startIndex,
            startIndex + itemsPerPage,
        );
    }, [filteredTransactions, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
    }, [filteredTransactions, itemsPerPage]);

    const handleCredentialLogin = (e) => {
        e.preventDefault();
        if (!loginEmail.trim() || !loginPassword.trim()) {
            showToast("Harap isi email dan kata sandi Anda.", "error");
            return;
        }

        router.post(route('login'), {
            email: loginEmail,
            password: loginPassword,
        }, {
            onError: (errors) => {
                showToast(errors.email || "Login gagal, silakan periksa kredensial Anda.", "error");
            },
            onSuccess: () => {
                showToast(`Selamat datang kembali!`);
            }
        });
    };

    const handleQuickLogin = (member) => {
        setCurrentUser(member);
        setIsLoggedIn(true);
        if (member.role !== "Administrator" && !member.permissions?.includes("lihat_laporan")) {
            setActiveTab("profile");
        } else {
            setActiveTab("dashboard");
        }
        showToast(`Berhasil masuk sebagai ${member.name}`);
    };

    const handleLogout = () => {
        if (window.confirm("Apakah Anda yakin ingin keluar?")) {
            router.post(route('logout'), {}, {
                onSuccess: () => {
                    setLoginEmail("");
                    setLoginPassword("");
                    showToast("Anda telah keluar dari aplikasi", "info");
                }
            });
        }
    };

    const handleStartAddTransaction = () => {
        setBulkTransactions([
            {
                id: "bulk_" + Date.now() + "_0",
                description: "",
                amount: "",
                type: "expense",
                categoryId: categories[0]?.id || "c1",
                walletId: wallets[0]?.id || "w1",
                memberId: currentUser?.id || members[0]?.id || "m1",
                date: new Date().toISOString().split("T")[0],
            },
        ]);
        setIsAddingTx(true);
    };

    const handleAddBulkRow = () => {
        setBulkTransactions([
            ...bulkTransactions,
            {
                id: "bulk_" + Date.now() + "_" + bulkTransactions.length,
                description: "",
                amount: "",
                type: "expense",
                categoryId: categories[0]?.id || "c1",
                walletId: wallets[0]?.id || "w1",
                memberId: currentUser?.id || members[0]?.id || "m1",
                date: new Date().toISOString().split("T")[0],
            },
        ]);
    };

    const handleRemoveBulkRow = (index) => {
        if (bulkTransactions.length === 1) {
            showToast(
                "Minimal harus terdapat satu baris transaksi untuk dikirim.",
                "error",
            );
            return;
        }
        setBulkTransactions(bulkTransactions.filter((_, i) => i !== index));
    };

    const handleUpdateBulkField = (index, field, value) => {
        const updated = [...bulkTransactions];
        updated[index][field] = value;
        setBulkTransactions(updated);
    };

    
    const handleTopUpSubmit = (e) => {
        e.preventDefault();
        if (!topUpData.amount || isNaN(topUpData.amount) || parseFloat(topUpData.amount) <= 0) {
            showToast("Nominal top up tidak valid", "error");
            return;
        }
        const amountNum = parseFloat(topUpData.amount);
        const newTx = {
            id: "t_" + Date.now(),
            description: "Top Up Kantong",
            amount: amountNum,
            type: "income",
            categoryId: categories[0]?.id || "c1",
            walletId: topUpData.walletId,
            memberId: currentUser?.id || members[0]?.id || "m1",
            date: new Date().toISOString().split("T")[0],
        };
        
        setWallets(prev => prev.map(w => w.id === topUpData.walletId ? { ...w, balance: w.balance + amountNum } : w));
        setTransactions(prev => [newTx, ...prev]);
        showToast("Top up berhasil!", "success");
        logActivity('Top Up Dompet', `Top up kantong senilai Rp ${formatIDR(amountNum)}`, 'Tambah', 'bg-emerald-500');
        setShowTopUpModal(false);
    };

    const handleSaveBulkTransactions = (e) => {
        e.preventDefault();

        for (let i = 0; i < bulkTransactions.length; i++) {
            const tx = bulkTransactions[i];
            if (!tx.description.trim()) {
                showToast(
                    `Deskripsi pada transaksi ke-${i + 1} tidak boleh kosong.`,
                    "error",
                );
                return;
            }
            const amountNum = parseFloat(tx.amount);
            if (isNaN(amountNum) || amountNum <= 0) {
                showToast(
                    `Nominal pada transaksi ke-${i + 1} harus berupa angka valid di atas 0.`,
                    "error",
                );
                return;
            }
        }

        const finalTransactions = bulkTransactions.map((tx, i) => ({
            id: "t_" + Date.now() + "_" + i,
            description: tx.description.trim(),
            amount: parseFloat(tx.amount),
            type: tx.type,
            categoryId: tx.categoryId,
            walletId: tx.walletId,
            memberId: tx.memberId,
            date: tx.date,
        }));

        setWallets((prevWallets) => {
            let updatedWallets = [...prevWallets];
            finalTransactions.forEach((tx) => {
                updatedWallets = updatedWallets.map((w) => {
                    if (w.id === tx.walletId) {
                        const balanceChange =
                            tx.type === "income" ? tx.amount : -tx.amount;
                        return {
                            ...w,
                            balance: w.balance + balanceChange,
                        };
                    }
                    return w;
                });
            });
            return updatedWallets;
        });

        setTransactions((prev) => [...finalTransactions, ...prev]);
        setIsAddingTx(false);
        setBulkTransactions([]);
        showToast(
            `${finalTransactions.length} Transaksi berhasil ditambahkan.`,
        );
        logActivity('Tambah Transaksi', `Menambahkan ${finalTransactions.length} transaksi baru dengan total Rp ${finalTransactions.reduce((acc, tx) => acc + tx.amount, 0).toLocaleString('id-ID')}`, 'PlusCircle', 'bg-blue-500');
    };

    const handleOpenEdit = (tx) => {
        setEditingTx({ ...tx });
    };

    const handleSaveEditTransaction = (e) => {
        e.preventDefault();
        if (!editingTx.description.trim() || !editingTx.amount) {
            showToast("Semua kolom data transaksi wajib diisi.", "error");
            return;
        }

        const amountNum = parseFloat(editingTx.amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            showToast(
                "Nominal transaksi harus bernilai lebih dari 0.",
                "error",
            );
            return;
        }

        const originalTx = transactions.find((t) => t.id === editingTx.id);
        if (!originalTx) return;

        router.put(`/transactions/${editingTx.id}`, {
            date: editingTx.date,
            description: editingTx.description,
            amount: amountNum,
            type: editingTx.type,
            category_id: editingTx.categoryId || null,
            wallet_id: editingTx.walletId,
            user_id: editingTx.memberId,
        }, {
            onSuccess: () => {
                setEditingTx(null);
                showToast("Transaksi berhasil diperbarui");
                logActivity('Update Transaksi', `Memperbarui transaksi: ${editingTx.description}`, 'Edit', 'bg-amber-500');
            },
            onError: (err) => {
                showToast("Gagal memperbarui transaksi", "error");
            }
        });
    };

    const handleDeleteTransaction = (id, type, amount, walletId) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
        const txToDelete = transactions.find(t => t.id === id);

        router.delete(`/transactions/${id}`, {
            onSuccess: () => {
                showToast("Transaksi berhasil dihapus", "info");
                if (txToDelete) {
                    logActivity('Hapus Transaksi', `Menghapus transaksi: ${txToDelete.description}`, 'Trash2', 'bg-rose-500');
                }
            },
            onError: (err) => {
                showToast("Gagal menghapus transaksi", "error");
            }
        });
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!newCat.name || !newCat.budget) {
            showToast("Nama kategori dan anggaran wajib diisi", "error");
            return;
        }

        if (newCat.id) {
            setCategories(
                categories.map((c) =>
                    c.id === newCat.id
                        ? {
                              ...c,
                              name: newCat.name,
                              budget: parseFloat(newCat.budget),
                              icon: newCat.icon || c.icon,
                              color: newCat.color || c.color,
                          }
                        : c,
                ),
            );
            showToast("Kategori berhasil diubah");
        } else {
            const newC = {
                id: "c_" + Date.now(),
                name: newCat.name,
                budget: parseFloat(newCat.budget),
                icon: newCat.icon || "Grid",
                color: newCat.color || "bg-blue-500",
            };
            setCategories([...categories, newC]);
            setShowAddCategoryModal(false);
            showToast("Kategori baru berhasil ditambahkan");
            logActivity('Tambah Kategori', `Kategori baru ditambahkan: ${newCat.name}`, 'Tag', 'bg-emerald-500');
        }

        setNewCat({
            id: null,
            name: "",
            budget: "",
            icon: "Grid",
            color: "bg-blue-500",
        });
        setShowAddCategoryModal(false);
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm("Yakin ingin menghapus kategori ini?")) {
            const catToDel = categories.find(c => c.id === id);
            
            // Jika id berupa string dengan awalan 'c_' berarti ini adalah data mock frontend
            if (typeof id === 'string' && id.startsWith('c_')) {
                setCategories(categories.filter((c) => c.id !== id));
                showToast("Kategori berhasil dihapus", "info");
                logActivity('Hapus Kategori', `Kategori dihapus: ${catToDel?.name}`, 'Trash2', 'bg-rose-500');
                return;
            }

            // Hapus data dari database via backend
            router.delete(`/categories/${id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    showToast("Kategori berhasil dihapus", "info");
                    logActivity('Hapus Kategori', `Kategori dihapus: ${catToDel?.name}`, 'Trash2', 'bg-rose-500');
                },
                onError: (errors) => {
                    showToast("Gagal menghapus kategori", "error");
                    console.error("Gagal hapus kategori:", errors);
                }
            });
        }
    };


    const handleDeleteWallet = (id) => {
        if (window.confirm("Yakin ingin menghapus kantong ini?")) {
            const walletToDel = wallets.find(w => w.id === id);
            
            if (typeof id === 'string' && id.startsWith('w_')) {
                setWallets(wallets.filter((w) => w.id !== id));
                showToast("Kantong berhasil dihapus", "info");
                logActivity('Hapus Kantong', `Kantong dihapus: ${walletToDel?.name}`, 'Trash2', 'bg-rose-500');
                return;
            }

            router.delete(`/wallets/${id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    showToast("Kantong berhasil dihapus", "info");
                    logActivity('Hapus Kantong', `Kantong dihapus: ${walletToDel?.name}`, 'Trash2', 'bg-rose-500');
                },
                onError: (errors) => {
                    showToast("Gagal menghapus kantong", "error");
                }
            });
        }
    };

    const handleAddWallet = (e) => {
        e.preventDefault();
        if (!newWallet.name || !newWallet.balance) {
            showToast("Nama dompet dan saldo awal wajib diisi", "error");
            return;
        }

        const payload = {
            ...newWallet,
            balance: parseFloat(newWallet.balance) || 0,
        };

        if (newWallet.id && typeof newWallet.id === "number") {
            router.put(`/wallets/${newWallet.id}`, payload, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowAddWalletModal(false);
                    showToast("Kantong berhasil diperbarui");
                },
                onError: (errors) => {
                    showToast("Gagal memperbarui kantong", "error");
                }
            });
        } else if (newWallet.id && typeof newWallet.id === "string" && newWallet.id.startsWith("w_")) {
            setWallets(wallets.map(w => w.id === newWallet.id ? { ...w, ...payload } : w));
            setShowAddWalletModal(false);
            showToast("Kantong berhasil diperbarui");
        } else {
            router.post('/wallets', payload, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowAddWalletModal(false);
                    showToast("Kantong baru berhasil didaftarkan");
                },
                onError: (errors) => {
                    showToast("Gagal menambahkan kantong", "error");
                }
            });
        }
    };

    const handleAddMember = (e) => {
        e.preventDefault();
        if (!newMember.name) {
            showToast("Nama anggota keluarga wajib diisi", "error");
            return;
        }

        if (newMember.id) {
            // Update existing member
            router.put(route('users.update', newMember.id), {
                name: newMember.name,
                role: newMember.role,
                permissions: newMember.permissions,
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddMemberModal(false);
                    showToast("Data anggota berhasil diperbarui");
                    logActivity('Update Anggota', `Memperbarui data anggota: ${newMember.name}`, 'User', 'bg-amber-500');
                    setNewMember({
                        id: null,
                        name: "",
                        role: "Anggota",
                        permissions: [...ROLE_PERMISSIONS["Anggota"]],
                    });
                },
                onError: () => showToast("Gagal memperbarui data anggota", "error")
            });
        } else {
            // Create new member
            const colors = [
                "bg-purple-500",
                "bg-teal-500",
                "bg-indigo-500",
                "bg-amber-500",
                "bg-sky-500",
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const generatedEmail = `${newMember.name.toLowerCase().replace(/\s+/g, "")}${Math.floor(Math.random()*1000)}@Fikrikeluarga.com`;

            router.post(route('users.store'), {
                name: newMember.name,
                email: generatedEmail,
                password: 'password123', // Default password
                role: newMember.role,
                avatarColor: randomColor,
                permissions: newMember.permissions,
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddMemberModal(false);
                    showToast("Anggota keluarga baru berhasil didaftarkan");
                    logActivity('Tambah Anggota', `Mendaftarkan anggota baru: ${newMember.name}`, 'UserPlus', 'bg-emerald-500');
                    setNewMember({
                        id: null,
                        name: "",
                        role: "Anggota",
                        permissions: [...ROLE_PERMISSIONS["Anggota"]],
                    });
                },
                onError: () => showToast("Gagal mendaftarkan anggota", "error")
            });
        }
    };

    const handleDeleteMember = (id) => {
        if (window.confirm("Yakin ingin menghapus anggota ini?")) {
            const memberToDel = members.find(m => m.id === id);
            router.delete(route('users.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    showToast("Anggota berhasil dihapus", "info");
                    logActivity('Hapus Anggota', `Menghapus anggota: ${memberToDel?.name}`, 'UserMinus', 'bg-rose-500');
                },
                onError: () => showToast("Gagal menghapus anggota", "error")
            });
        }
    };

    const handleTogglePermission = (permKey) => {
        setNewMember((prev) => {
            const has = prev.permissions.includes(permKey);
            return {
                ...prev,
                permissions: has
                    ? prev.permissions.filter((p) => p !== permKey)
                    : [...prev.permissions, permKey],
            };
        });
    };

    const handleToggleMemberPermission = (memberId, permKey) => {
        const memberToUpdate = members.find(m => m.id === memberId);
        if (!memberToUpdate) return;
        
        const perms = memberToUpdate.permissions || [];
        const has = perms.includes(permKey);
        const newPerms = has ? perms.filter(p => p !== permKey) : [...perms, permKey];

        // Optimistic UI update
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, permissions: newPerms } : m));

        router.put(route('users.update', memberId), {
            name: memberToUpdate.name,
            role: memberToUpdate.role,
            permissions: newPerms,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => showToast("Hak akses berhasil diperbarui"),
            onError: () => {
                showToast("Gagal memperbarui hak akses", "error");
                // Revert optimistic update
                setMembers(prev => prev.map(m => m.id === memberId ? { ...m, permissions: perms } : m));
            }
        });
    };

    const handleNewMemberRoleChange = (role) => {
        setNewMember((prev) => ({
            ...prev,
            role,
            permissions: [...(ROLE_PERMISSIONS[role] || [])],
        }));
    };

    const handleUpdateBudget = (catId, newBudget) => {
        setCategories((prev) =>
            prev.map((c) => {
                if (c.id === catId) {
                    return { ...c, budget: parseFloat(newBudget) || 0 };
                }
                return c;
            }),
        );
        showToast("Anggaran bulanan diperbarui");
    };

    const downloadTemplate = () => {
        const csvContent = "Tanggal,Deskripsi,Nominal,Kategori,Dompet,Anggota Keluarga\n" +
                           "2026-07-08,Belanja Dapur Harian,150000,Kebutuhan Dapur,Mandiri Ibu,Ibu\n" +
                           "2026-07-08,Isi Bensin Motor,50000,Bensin,BCA Ayah,Ayah (Admin)\n" +
                           "2026-07-08,Kopi Sore KRL,35000,Ngopi,Uang Tunai,Kakak";
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "template_import_pengeluaran.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const parseCSV = (text) => {
        if (!text) return [];
        
        // Detect delimiter: comma or semicolon (Indonesian local excel export)
        let delimiter = ',';
        const firstLine = text.split(/\r?\n/)[0] || '';
        if (firstLine.includes(';')) {
            delimiter = ';';
        }
        
        const lines = [];
        let currentLine = [];
        let currentToken = '';
        let inQuotes = false;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') {
                if (inQuotes && text[i+1] === '"') {
                    currentToken += '"';
                    i++; // skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                currentLine.push(currentToken.trim());
                currentToken = '';
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
                if (char === '\r' && text[i+1] === '\n') {
                    i++;
                }
                currentLine.push(currentToken.trim());
                lines.push(currentLine);
                currentLine = [];
                currentToken = '';
            } else {
                currentToken += char;
            }
        }
        if (currentToken || currentLine.length > 0) {
            currentLine.push(currentToken.trim());
            lines.push(currentLine);
        }
        
        if (lines.length < 2) return [];
        const results = [];
        
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i];
            if (row.length < 3 || (row.length === 1 && row[0] === '')) continue;
            
            results.push({
                date: row[0] || '',
                description: row[1] || '',
                amount: parseFloat(row[2]) || 0,
                categoryName: row[3] || '',
                walletName: row[4] || '',
                memberName: row[5] || ''
            });
        }
        return results;
    };

    const handleFileChange = (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;
            setImportFileName(file.name);
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const text = event.target.result;
                    const parsed = parseCSV(text);
                    if (parsed.length === 0) {
                        showToast("File CSV kosong atau format tidak sesuai", "error");
                    } else {
                        showToast("Berhasil memproses pratinjau data");
                    }
                    setImportedData(parsed);
                    setImportCurrentPage(1); // Reset to page 1
                } catch (err) {
                    console.error("CSV parse error:", err);
                    showToast("Gagal memproses baris file CSV", "error");
                }
            };
            reader.onerror = () => {
                showToast("Gagal membaca file", "error");
            };
            reader.readAsText(file);
        } catch (err) {
            console.error("File selection error:", err);
            showToast("Gagal memuat file", "error");
        }
    };

    const handleCellEdit = (index, field, value) => {
        setImportedData(prev => prev.map((item, idx) => {
            if (idx === index) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const handleDeleteImportRow = (index) => {
        setImportedData(prev => prev.filter((_, idx) => idx !== index));
    };

    // Filtered data based on search query in import preview
    const filteredImportedData = useMemo(() => {
        return importedData.map((item, idx) => ({ ...item, originalIndex: idx }))
            .filter(item => {
                const query = importSearchQuery.toLowerCase();
                return (item.description || '').toLowerCase().includes(query) ||
                       (item.categoryName || '').toLowerCase().includes(query) ||
                       (item.walletName || '').toLowerCase().includes(query) ||
                       (item.memberName || '').toLowerCase().includes(query) ||
                       (item.date || '').includes(query);
            });
    }, [importedData, importSearchQuery]);

    // Paginated data in import preview
    const paginatedImportedData = useMemo(() => {
        const startIndex = (importCurrentPage - 1) * importItemsPerPage;
        return filteredImportedData.slice(startIndex, startIndex + importItemsPerPage);
    }, [filteredImportedData, importCurrentPage, importItemsPerPage]);

    const totalImportPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredImportedData.length / importItemsPerPage));
    }, [filteredImportedData, importItemsPerPage]);

    useEffect(() => {
        if (importCurrentPage > totalImportPages) {
            setImportCurrentPage(totalImportPages);
        }
    }, [totalImportPages, importCurrentPage]);

    const handleImportSubmit = () => {
        try {
            if (importedData.length === 0) return;
            setIsImporting(true);
            
            const transactionsToPost = importedData.map(row => {
                const rowCatName = row.categoryName || '';
                const rowWalletName = row.walletName || '';
                const rowMemberName = row.memberName || '';

                const cat = categories.find(c => c.name && c.name.toLowerCase() === rowCatName.toLowerCase()) 
                    || categories.find(c => c.name === 'Lainnya');
                    
                const wal = wallets.find(w => w.name && w.name.toLowerCase() === rowWalletName.toLowerCase());
                
                const mem = members.find(m => m.name && m.name.toLowerCase() === rowMemberName.toLowerCase()) 
                    || currentUser;
                
                return {
                    date: row.date,
                    description: row.description,
                    amount: row.amount,
                    type: 'expense',
                    category_id: cat ? cat.id : null,
                    wallet_id: wal ? wal.id : null,
                    user_id: mem ? mem.id : (currentUser ? currentUser.id : null)
                };
            });
            
            if (transactionsToPost.some(t => !t.wallet_id)) {
                showToast("Gagal: Beberapa baris data tidak memiliki Dompet yang cocok.", "error");
                setIsImporting(false);
                return;
            }
            
            axios.post('/transactions', { transactions: transactionsToPost })
                .then(res => {
                    showToast("Berhasil mengimpor " + transactionsToPost.length + " transaksi pengeluaran.");
                    setImportedData([]);
                    setImportFileName("");
                    setIsAddingTx(false);
                    setActiveTab("pencatatan");
                    
                    router.reload({
                        preserveState: true,
                        onSuccess: () => {
                            axios.get('/api/dashboard/metrics?force_recalculate=true');
                        }
                    });
                })
                .catch(err => {
                    console.error(err);
                    showToast("Gagal mengirim data import ke server.", "error");
                })
                .finally(() => {
                    setIsImporting(false);
                });
        } catch (err) {
            console.error("Submit error:", err);
            showToast("Terjadi kesalahan saat pengiriman data", "error");
            setIsImporting(false);
        }
    };

    const toggleColumn = (colName) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [colName]: !prev[colName],
        }));
    };

    // JIKA BELUM LOGIN, TAMPILKAN HALAMAN LOGIN YANG ELEGAN
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-blue-500 selection:text-white">
                {/* === NOTIFIKASI TOAST === */}
                {toast && (
                    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 animate-bounce">
                        <div
                            className={`p-4 rounded-xl shadow-lg border flex items-center space-x-3 ${
                                toast.type === "success"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                    : toast.type === "error"
                                      ? "bg-rose-50 border-rose-200 text-rose-800"
                                      : "bg-blue-50 border-blue-200 text-blue-800"
                            }`}
                        >
                            {toast.type === "success" && (
                                <Check className="w-5 h-5 text-emerald-600" />
                            )}
                            {toast.type === "error" && (
                                <AlertCircle className="w-5 h-5 text-rose-600" />
                            )}
                            {toast.type === "info" && (
                                <Info className="w-5 h-5 text-blue-600" />
                            )}
                            <p className="text-sm font-semibold">{toast.message}</p>
                        </div>
                    </div>
                )}
                
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-fadeIn">
                    {/* SISI KIRI: BRANDING & MOCKUP VISUAL */}
                    <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>

                        <div className="flex items-center space-x-3 z-10">
                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight">
                                Fikrikeluarga
                            </span>
                        </div>

                        <div className="space-y-4 z-10">
                            <h2 className="text-3xl font-extrabold leading-tight">
                                Wujudkan Impian Finansial Keluarga Sehat.
                            </h2>
                            <p className="text-sm text-blue-100 font-medium">
                                Satu platform kolaboratif untuk mengelola
                                anggaran harian, melacak tabungan, dan
                                mengontrol pengeluaran bersama seluruh anggota
                                keluarga.
                            </p>
                        </div>

                        <div className="text-xs text-blue-200/80 z-10">
                            © 2026 Fikrikeluarga System. All rights reserved.
                        </div>
                    </div>

                    {/* SISI KANAN: FORM LOGIN & QUICK CHOOSE USER */}
                    <div className="p-8 md:p-10 flex flex-col justify-center space-y-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">
                                Selamat Datang
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Silakan masuk untuk mengelola keuangan keluarga
                                Anda hari ini.
                            </p>
                        </div>



                        {/* FORM CREDENTIALS LOGIN */}
                        <form
                            onSubmit={handleCredentialLogin}
                            className="space-y-4"
                        >
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        placeholder="nama@email.com"
                                        value={loginEmail}
                                        onChange={(e) =>
                                            setLoginEmail(e.target.value)
                                        }
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                                        Kata Sandi
                                    </label>
                                    <span className="text-[9px] text-slate-400 font-medium">
                                        Sandi simulasi: <strong>123456</strong>
                                    </span>
                                </div>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={(e) =>
                                            setLoginPassword(e.target.value)
                                        }
                                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        title={showPassword ? "Sembunyikan Sandi" : "Lihat Sandi"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 flex items-center justify-center space-x-1"
                            >
                                <span>Masuk Ke Dashboard</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // JIKA SUDAH LOGIN, AKAN MERENDER CORE APLIKASI UTAMA
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            {/* === TOP BAR (DESKTOP & MOBILE) === */}
            <header className="bg-transparent px-4 py-4 z-30">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    {/* KIRI: Nama Halaman */}
                    <div className="text-left">
                        <h1 className="font-extrabold text-xl md:text-2xl text-slate-800 tracking-tight capitalize">
                            {activeTab === "dashboard"
                                ? "Dashboard"
                                : activeTab === "dompet"
                                  ? "Kantong"
                                  : activeTab === "budgeting"
                                    ? "Budgeting"
                                    : activeTab === "pencatatan"
                                      ? "History Transaksi"
                                      : activeTab === "profile"
                                        ? "Profile"
                                        : activeTab}
                        </h1>
                    </div>

                    {/* KANAN: Hanya Icon Tanpa Card (Kalender, Notifikasi, Profile) */}
                    <div className="flex items-center space-x-1 md:space-x-2">
                        {/* 1. Calendar Icon (Custom Dropdown) */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowCalendarDropdown(
                                        !showCalendarDropdown,
                                    )
                                }
                                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100"
                            >
                                <Calendar className="w-5 h-5 md:w-5 md:h-5" />
                            </button>

                            {showCalendarDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fadeIn origin-top-right">
                                    <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
                                        <button
                                            onClick={() =>
                                                setSelectedYear(
                                                    selectedYear - 1,
                                                )
                                            }
                                            className="p-1.5 hover:bg-white rounded-lg text-slate-500 transition-colors"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                        </button>
                                        <span className="font-bold text-slate-800">
                                            {selectedYear}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setSelectedYear(
                                                    selectedYear + 1,
                                                )
                                            }
                                            className="p-1.5 hover:bg-white rounded-lg text-slate-500 transition-colors"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="p-3 grid grid-cols-3 gap-2">
                                        {[
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "Mei",
                                            "Jun",
                                            "Jul",
                                            "Agt",
                                            "Sep",
                                            "Okt",
                                            "Nov",
                                            "Des",
                                        ].map((m, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setSelectedMonth(i + 1);
                                                    setShowCalendarDropdown(
                                                        false,
                                                    );
                                                }}
                                                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                                                    selectedMonth === i + 1
                                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                        : "text-slate-600 hover:bg-slate-100"
                                                }`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Notification Icon */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowNotifDropdown(!showNotifDropdown)
                                }
                                className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100"
                            >
                                <Bell className="w-5 h-5 md:w-5 md:h-5" />
                                <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-50"></span>
                            </button>

                            {showNotifDropdown && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fadeIn origin-top-right">
                                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                        <h3 className="font-bold text-slate-800 text-sm">
                                            Notifikasi
                                        </h3>
                                        <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                            {aiInsights.length} Baru
                                        </span>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {aiInsights.map((insight, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer"
                                            >
                                                <div className="shrink-0 mt-0.5">
                                                    {insight.type ===
                                                        "warning" && (
                                                        <AlertCircle className="w-5 h-5 text-orange-500" />
                                                    )}
                                                    {insight.type ===
                                                        "success" && (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    )}
                                                    {insight.type ===
                                                        "alert" && (
                                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                                    )}
                                                    {insight.type ===
                                                        "info" && (
                                                        <Lightbulb className="w-5 h-5 text-blue-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 leading-snug">
                                                    {insight.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 text-center border-t border-slate-100">
                                        <button
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                            onClick={() =>
                                                setShowNotifDropdown(false)
                                            }
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* === NOTIFIKASI TOAST === */}
            {toast && (
                <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 animate-bounce">
                    <div
                        className={`p-4 rounded-xl shadow-lg border flex items-center space-x-3 ${
                            toast.type === "success"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : toast.type === "error"
                                  ? "bg-rose-50 border-rose-200 text-rose-800"
                                  : "bg-blue-50 border-blue-200 text-blue-800"
                        }`}
                    >
                        {toast.type === "success" && (
                            <Check className="w-5 h-5 text-emerald-600" />
                        )}
                        {toast.type === "error" && (
                            <AlertCircle className="w-5 h-5 text-rose-600" />
                        )}
                        {toast.type === "info" && (
                            <Info className="w-5 h-5 text-blue-600" />
                        )}
                        <p className="text-sm font-semibold">{toast.message}</p>
                    </div>
                </div>
            )}

            {/* === PWA INSTALL BANNER === */}
            {showInstallBanner && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow-md animate-fadeInDown">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Download className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">
                                Pasang Aplikasi Menkeu
                            </p>
                            <p className="text-xs text-blue-100 hidden sm:block">
                                Akses lebih cepat langsung dari layar utama
                                (Home Screen) HP Anda.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                        <button
                            onClick={handleInstallApp}
                            className="bg-white text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm"
                        >
                            Install
                        </button>
                        <button
                            onClick={() => setShowInstallBanner(false)}
                            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* === AREA KONTEN UTAMA === */}
            <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:py-8 pb-24 md:pb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* SIDEBAR NAVIGATION (DESKTOP) */}
                <aside className="hidden md:block col-span-1 h-fit space-y-1.5 pr-2 sticky top-8">
                    {hasPermission("catat_transaksi") && (
                        <div className="mb-6 px-1">
                            <button
                                onClick={() => {
                                    setActiveTab("pencatatan");
                                    handleStartAddTransaction();
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Catat Pengeluaran</span>
                            </button>
                        </div>
                    )}
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">
                        Menu Utama
                    </p>
                    {[
                        hasPermission("lihat_laporan") && {
                            id: "dashboard",
                            label: "Dashboard",
                            icon: LayoutDashboard,
                        },
                        (hasPermission("kelola_dompet") || hasPermission("lihat_dompet")) && { id: "dompet", label: "Kantong", icon: Wallet },
                        hasPermission("atur_budget") && { id: "budgeting", label: "Budgeting", icon: PieChart },
                        hasPermission("ekspor_data") && { id: "import", label: "Import Data", icon: Upload },
                        hasPermission("kelola_kategori") && {
                            id: "kategori",
                            label: "Kategori",
                            icon: Tag,
                            action: () => {
                                setActiveTab("profile");
                                setActiveSettingsTab("kategori");
                            }
                        },
                        {
                            id: "profile",
                            label: (
                                <div className="flex items-center gap-1.5">
                                    <span>{currentUser?.name || "Profile"}</span>
                                    <BadgeCheck className="w-4 h-4 text-white fill-blue-500 flex-shrink-0" />
                                </div>
                            ),
                            icon: "PROFILE_PHOTO",
                            action: () => {
                                setActiveTab("profile");
                                setActiveSettingsTab("profile");
                            }
                        },
                    ].filter(Boolean).map((item) => {
                        const IconComponent = item.icon;
                        let isSelected = activeTab === item.id;
                        if (item.id === "kategori") {
                            isSelected = activeTab === "profile" && activeSettingsTab === "kategori";
                        } else if (item.id === "profile") {
                            isSelected = activeTab === "profile" && activeSettingsTab !== "kategori";
                        }
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.action) {
                                        item.action();
                                    } else {
                                        setActiveTab(item.id);
                                    }
                                    if (item.id !== "pencatatan") {
                                        setIsAddingTx(false);
                                    }
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                                    isSelected
                                        ? "bg-white text-blue-600 shadow-sm border border-slate-100/50"
                                        : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-800"
                                }`}
                            >
                                {item.icon === "PROFILE_PHOTO" ? (
                                    currentUser?.avatar ? (
                                        <img src={`/storage/${currentUser.avatar}`} alt="Avatar" className={`w-6 h-6 rounded-full object-cover border ${isSelected ? "border-white" : "border-transparent"}`} />
                                    ) : (
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${isSelected ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}
                                        >
                                            {currentUser?.name
                                                ? currentUser.name
                                                      .charAt(0)
                                                      .toUpperCase()
                                                : "U"}
                                        </div>
                                    )
                                ) : (
                                    <IconComponent
                                        className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-slate-400"}`}
                                    />
                                )}
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </aside>

                {/* CONTAINER DINAMIS SESUAI TAB AKTIF */}
                <section className="col-span-1 md:col-span-3 space-y-6">
                    {/* TAB 1: DASHBOARD */}
                    {activeTab === "dashboard" && <ExecutiveDashboard />}

                    {/* TAB 2: CATAT PENGELUARAN HARIAN */}
                    {activeTab === "pencatatan" && (
                        <div className="space-y-6 animate-fadeIn">
                                {/* HALAMAN INPUT TRANSAKSI BARU (MODERN & SIMPLE) */}
                                <div className="space-y-4 animate-fadeIn">
                                    <form
                                        onSubmit={handleSaveBulkTransactions}
                                        className="space-y-4"
                                    >
                                        {bulkTransactions.map((tx, idx) => (
                                            <div
                                                key={tx.id}
                                                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group transition-all hover:shadow-md"
                                            >
                                                {/* Tombol Hapus Baris */}
                                                {bulkTransactions.length >
                                                    1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveBulkRow(
                                                                idx,
                                                            )
                                                        }
                                                        className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-rose-100 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-110 shadow-sm transition-all z-10"
                                                        title="Hapus"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {/* Header Baris / Nomor Form */}
                                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black shadow-sm">
                                                            {idx + 1}
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-700">
                                                            Catatan Pengeluaran
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        {idx + 1} dari{" "}
                                                        {
                                                            bulkTransactions.length
                                                        }
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    {/* 1. Nominal (Paling atas sesuai request) */}
                                                    <div className="md:col-span-2">
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                                                            Nominal
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                <span className="text-slate-500 font-bold text-lg">
                                                                    Rp
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                placeholder="0"
                                                                value={
                                                                    tx.amount
                                                                        ? new Intl.NumberFormat(
                                                                              "id-ID",
                                                                          ).format(
                                                                              tx.amount,
                                                                          )
                                                                        : ""
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const rawValue =
                                                                        e.target.value.replace(
                                                                            /\D/g,
                                                                            "",
                                                                        );
                                                                    handleUpdateBulkField(
                                                                        idx,
                                                                        "amount",
                                                                        rawValue
                                                                            ? parseInt(
                                                                                  rawValue,
                                                                                  10,
                                                                              )
                                                                            : "",
                                                                    );
                                                                }}
                                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-lg font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                                autoFocus={
                                                                    idx === 0
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Deskripsi (Kita tetap butuh untuk data transaksi) */}
                                                    <div className="md:col-span-2">
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                                                            Catatan / Deskripsi
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Makan siang, bensin, dll..."
                                                            value={
                                                                tx.description
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateBulkField(
                                                                    idx,
                                                                    "description",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        />
                                                    </div>

                                                    {/* 2. Kategori */}
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                                                            Kategori
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                value={
                                                                    tx.categoryId
                                                                }
                                                                onChange={(e) =>
                                                                    handleUpdateBulkField(
                                                                        idx,
                                                                        "categoryId",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                                            >
                                                                {categories.map(
                                                                    (c) => (
                                                                        <option
                                                                            key={
                                                                                c.id
                                                                            }
                                                                            value={
                                                                                c.id
                                                                            }
                                                                        >
                                                                            {
                                                                                c.name
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* 3. Dompet */}
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                                                            Dompet / Sumber Dana
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                value={
                                                                    tx.walletId
                                                                }
                                                                onChange={(e) =>
                                                                    handleUpdateBulkField(
                                                                        idx,
                                                                        "walletId",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                                            >
                                                                {wallets.map(
                                                                    (w) => (
                                                                        <option
                                                                            key={
                                                                                w.id
                                                                            }
                                                                            value={
                                                                                w.id
                                                                            }
                                                                        >
                                                                            {
                                                                                w.name
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* 4. Tanggal (Pilih bulan & tahun pop-up native) */}
                                                    <div className="md:col-span-2">
                                                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                                                            Tanggal
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={tx.date}
                                                            onChange={(e) =>
                                                                handleUpdateBulkField(
                                                                    idx,
                                                                    "date",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Button Tambah Baris (Outline putus-putus) */}
                                        <button
                                            type="button"
                                            onClick={handleAddBulkRow}
                                            className="w-full py-4 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600 font-bold text-sm flex items-center justify-center space-x-2 hover:bg-blue-50 hover:border-blue-400 transition-all"
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>Tambah Baris</span>
                                        </button>

                                        {/* Action Buttons: Batal & Simpan */}
                                        <div className="flex items-center justify-end space-x-4 pt-6 pb-32 md:pb-6">
                                            <button
                                                onClick={() => {
                                                    setActiveTab("dompet");
                                                    setIsAddingTx(false);
                                                    setBulkTransactions([]);
                                                }}
                                                className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center space-x-2"
                                            >
                                                <Check className="w-4 h-4" />
                                                <span>Simpan</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>

                        </div>
                    )}

                    {/* TAB: BUDGETING */}
                    {activeTab === "budgeting" && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* (Tab Toggle Dihilangkan) */}

                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => {
                                        setActiveTab("pencatatan");
                                        handleStartAddTransaction();
                                    }}
                                    className="px-4 py-2.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all text-sm flex items-center justify-center shadow-md shadow-blue-200 shrink-0"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="ml-1.5">
                                        Catat Pengeluaran
                                    </span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(() => {
                                    let txs = transactions.filter(
                                        (t) => t.type === "expense",
                                    );
                                    if (budgetStartDate)
                                        txs = txs.filter(
                                            (t) => t.date >= budgetStartDate,
                                        );
                                    if (budgetEndDate)
                                        txs = txs.filter(
                                            (t) => t.date <= budgetEndDate,
                                        );

                                    const stats = categories
                                        .map((cat) => {
                                            const spent = txs
                                                .filter(
                                                    (t) =>
                                                        t.categoryId === cat.id,
                                                )
                                                .reduce(
                                                    (sum, t) => sum + t.amount,
                                                    0,
                                                );
                                            const percentage =
                                                cat.budget > 0
                                                    ? Math.min(
                                                          (spent / cat.budget) *
                                                              100,
                                                          100,
                                                      )
                                                    : 0;
                                            return {
                                                ...cat,
                                                spent,
                                                percentage,
                                            };
                                        })
                                        .sort((a, b) => b.spent - a.spent);

                                    return stats.map((cat) => {
                                        const IconComponent =
                                            cat.icon && ICON_MAP[cat.icon]
                                                ? ICON_MAP[cat.icon]
                                                : Grid;

                                        const isOverBudget =
                                            cat.spent > cat.budget;
                                        const isWarning =
                                            !isOverBudget &&
                                            cat.percentage > 80;

                                        let barColor = "bg-blue-500";
                                        if (isOverBudget)
                                            barColor = "bg-rose-500";
                                        else if (isWarning)
                                            barColor = "bg-amber-500";
                                        else if (cat.color)
                                            barColor = cat.color;

                                        const borderColor = cat.color
                                            ? cat.color.replace(
                                                  "bg-",
                                                  "border-",
                                              )
                                            : "border-slate-200";

                                        return (
                                            <div
                                                key={cat.id}
                                                className={`p-5 rounded-2xl border-2 ${borderColor} bg-white shadow-sm hover:shadow-md transition-all`}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.color ? cat.color.replace("-500", "-100") : "bg-slate-100"}`}
                                                        >
                                                            <IconComponent
                                                                className={`w-4 h-4 ${cat.color ? cat.color.replace("bg-", "text-").replace("-500", "-600") : "text-slate-500"}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800">
                                                                {cat.name}
                                                            </h4>
                                                            <p className="text-[10px] font-semibold text-slate-400">
                                                                Plafon:{" "}
                                                                {formatIDR(
                                                                    cat.budget,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end">
                                                        <span
                                                            className={`text-sm font-black ${isOverBudget ? "text-rose-600" : "text-slate-800"}`}
                                                        >
                                                            {formatIDR(
                                                                cat.spent,
                                                            )}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                                                            Terpakai
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${barColor} transition-all duration-700`}
                                                        style={{
                                                            width: `${Math.max(cat.percentage, 2)}%`,
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex justify-between items-center mt-2.5">
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isOverBudget ? "bg-rose-100 text-rose-600" : isWarning ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-600"}`}
                                                    >
                                                        {isOverBudget
                                                            ? "Over budget!"
                                                            : isWarning
                                                              ? "Hampir habis"
                                                              : "Aman"}
                                                    </span>
                                                    <span
                                                        className={`text-xs font-bold ${isOverBudget ? "text-rose-600" : "text-slate-600"}`}
                                                    >
                                                        {cat.percentage.toFixed(
                                                            0,
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: DOMPET & AKUN */}
                    {activeTab === "dompet" && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Kantong Keuangan</h3>
                                    <p className="text-xs text-slate-500">Kelola rekening, e-wallet, dan uang tunai Anda</p>
                                </div>
                                {hasPermission("kelola_dompet") && (
                                    <button
                                        onClick={() => {
                                            setNewWallet({ id: null, name: "", balance: "", type: "Bank", color: "bg-blue-600", icon: "Wallet" });
                                            setShowAddWalletModal(true);
                                        }}
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Tambah Kantong
                                    </button>
                                )}
                            </div>

                            {/* List Kantong */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {wallets.map((w) => {
                                    const isWalletIstri = w.name.toLowerCase().includes('istri') || w.name.toLowerCase().includes('ibu');
                                    const canTopUp = hasPermission("topup_dompet") && !(currentUser?.role?.toLowerCase() === 'suami' && isWalletIstri);

                                    return (
                                        <div key={w.id} className={`p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}>
                                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${w.color || "bg-blue-600"}`}></div>
                                            <div className="flex items-start justify-between mb-2 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${w.color || "bg-blue-600"}`}>
                                                        {w.icon === 'Wallet' && <Wallet className="w-5 h-5" />}
                                                        {w.icon === 'CreditCard' && <CreditCard className="w-5 h-5" />}
                                                        {w.icon === 'Building' && <Building className="w-5 h-5" />}
                                                        {w.icon === 'Smartphone' && <Smartphone className="w-5 h-5" />}
                                                        {w.icon === 'Coins' && <Coins className="w-5 h-5" />}
                                                        {!['Wallet','CreditCard','Building','Smartphone','Coins'].includes(w.icon) && <Wallet className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 leading-tight">{w.name}</h4>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{w.type}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {hasPermission("kelola_dompet") && (
                                                        <>
                                                            <button onClick={() => { setNewWallet(w); setShowAddWalletModal(true); }} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                                                            <button onClick={() => handleDeleteWallet(w.id)} className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex items-end justify-between mt-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Total Saldo</p>
                                                    <p className="text-xl font-black text-slate-900 tracking-tight">{formatIDR(w.balance)}</p>
                                                </div>
                                                {canTopUp && (
                                                    <button 
                                                        onClick={() => {
                                                            setTopUpData({ walletId: w.id, amount: '' });
                                                            setShowTopUpModal(true);
                                                        }} 
                                                        className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" /> Top Up
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Transaksi Section */}
                            <div className="mt-8 border-t border-slate-100 pt-6">
                                <h3 className="font-bold text-lg text-slate-900 mb-4">Riwayat Transaksi</h3>
                                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                    <div className="relative flex-1">
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="text" value={walletSearch} onChange={(e) => setWalletSearch(e.target.value)} placeholder="Cari deskripsi transaksi..." className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm" />
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <select value={walletCategoryFilter} onChange={(e) => setWalletCategoryFilter(e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm">
                                            <option value="all">Semua Kategori</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

<div className="space-y-6">
                                    {(() => {
                                        const walletTxPerPage = 15;
                                        const filteredWalletTxs = transactions
                                            .filter(t => {
                                                const d = new Date(t.date);
                                                return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
                                            })
                                            .filter(t => (walletSearch ? t.description.toLowerCase().includes(walletSearch.toLowerCase()) : true))
                                            .filter(t => (walletCategoryFilter !== "all" ? t.categoryId == walletCategoryFilter : true))
                                            .sort((a, b) => new Date(b.date) - new Date(a.date));

                                        const totalWalletPages = Math.ceil(filteredWalletTxs.length / walletTxPerPage) || 1;
                                        // Pastikan current page tidak melebihi total
                                        const currentPg = Math.min(walletTxPage, totalWalletPages);
                                        const paginatedWalletTxs = filteredWalletTxs.slice((currentPg - 1) * walletTxPerPage, currentPg * walletTxPerPage);
                                        
                                        if (filteredWalletTxs.length === 0) {
                                            return (
                                                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                                                    <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                                    <p className="text-slate-500 font-bold">Tidak ada transaksi yang cocok di bulan ini.</p>
                                                </div>
                                            );
                                        }

                                        const grouped = paginatedWalletTxs.reduce((groups, t) => {
                                            const date = t.date;
                                            if (!groups[date]) groups[date] = [];
                                            groups[date].push(t);
                                            return groups;
                                        }, {});

                                        return (
                                            <>
                                                {Object.entries(grouped).map(([date, txs]) => (
                                                    <div key={date}>
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                                                        <div className="space-y-2">
                                                            {txs.map(t => {
                                                                const cat = categories.find(c => c.id == t.categoryId);
                                                                const wal = wallets.find(w => w.id == t.walletId);
                                                                const isIncome = t.type === 'income';
                                                                return (
                                                                    <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-blue-200 transition-colors group">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${isIncome ? 'bg-emerald-500' : (cat?.color || 'bg-slate-400')} shrink-0`}>
                                                                                <div className="text-xs font-bold">{isIncome ? '+' : (cat?.name?.charAt(0) || '?')}</div>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-bold text-sm text-slate-900">{t.description}</h5>
                                                                                <p className="text-[10px] font-bold text-slate-500">{isIncome ? 'Pemasukan' : (cat?.name || 'Tanpa Kategori')} • {wal?.name || 'Tanpa Dompet'}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-50 pt-2 sm:pt-0 sm:border-0">
                                                                            <div className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                                {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5">
                                                                                <button
                                                                                    onClick={() => handleOpenEdit(t)}
                                                                                    className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                                                                                    title="Ubah Transaksi"
                                                                                >
                                                                                    <Edit className="w-3.5 h-3.5" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteTransaction(t.id, t.type, t.amount, t.walletId)}
                                                                                    className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"
                                                                                    title="Hapus Transaksi"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Pagination Controls */}
                                                {totalWalletPages > 1 && (
                                                    <div className="flex items-center justify-center pt-6 gap-2">
                                                        <button
                                                            onClick={() => setWalletTxPage(p => Math.max(1, p - 1))}
                                                            disabled={currentPg === 1}
                                                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 shadow-sm"
                                                        >
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </button>
                                                        <div className="flex gap-1.5">
                                                            {Array.from({ length: totalWalletPages }, (_, i) => i + 1).map(pageNum => (
                                                                <button
                                                                    key={pageNum}
                                                                    onClick={() => setWalletTxPage(pageNum)}
                                                                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                                                                        currentPg === pageNum
                                                                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                                    }`}
                                                                >
                                                                    {pageNum}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <button
                                                            onClick={() => setWalletTxPage(p => Math.min(totalWalletPages, p + 1))}
                                                            disabled={currentPg === totalWalletPages}
                                                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 shadow-sm"
                                                        >
                                                            <ChevronRightIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: PROFILE */}
                    {activeTab === "profile" && (
                        <div className="space-y-6 animate-fadeIn">
                            {activeSettingsTab === "profile" && (
                                <>
                                    {/* Profile Header Card */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                                        <div className="p-5 sm:p-6 flex items-center space-x-4 border-b border-slate-100">
                                            <div className="relative">
                                                {currentUser?.avatar ? (
                                                    <img src={`/storage/${currentUser.avatar}`} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm shrink-0">
                                                        {currentUser?.name
                                                            ? currentUser.name
                                                                  .charAt(0)
                                                                  .toUpperCase()
                                                            : "U"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-lg font-bold text-slate-900 truncate flex items-center gap-1.5">
                                                    {currentUser?.name || "User"}
                                                    <BadgeCheck className="w-5 h-5 text-white fill-blue-500 flex-shrink-0" />
                                                </h2>
                                                <p className="text-sm text-slate-500 truncate">
                                                    {currentUser?.email || "user@example.com"}
                                                </p>
                                            </div>
                                            <button onClick={() => setActiveSettingsTab("edit_profile")} className="text-blue-600 hover:text-blue-700 bg-blue-50 p-2 rounded-xl transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-4 bg-slate-50 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                                    <Wallet className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase">
                                                        Total Saldo
                                                    </p>
                                                    <p className="text-base font-black text-slate-900">
                                                        Rp{" "}
                                                        {new Intl.NumberFormat(
                                                            "id-ID",
                                                        ).format(
                                                            wallets.reduce(
                                                                (sum, w) =>
                                                                    sum +
                                                                    parseFloat(
                                                                        w.balance ||
                                                                            0,
                                                                    ),
                                                                0,
                                                            ),
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setActiveTab("dompet")
                                                }
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center"
                                            >
                                                Kelola{" "}
                                                <ChevronRight className="w-4 h-4 ml-0.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Menu List */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        {hasPermission("kelola_kategori") && (
                                            <button
                                                onClick={() =>
                                                    setActiveSettingsTab("kategori")
                                                }
                                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-100 transition-colors"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <Tag className="w-5 h-5 text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-700">
                                                        Manajemen Kategori
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-300" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setActiveSettingsTab("security")}
                                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-100 transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <Shield className="w-5 h-5 text-slate-400" />
                                                <span className="text-sm font-bold text-slate-700">
                                                    Keamanan & Akun
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300" />
                                        </button>

                                        {hasPermission("kelola_anggota") && (
                                            <button
                                                onClick={() =>
                                                    setActiveSettingsTab("anggota")
                                                }
                                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-100 transition-colors"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <Users className="w-5 h-5 text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-700">
                                                        Manajemen Anggota
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-300" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setActiveSettingsTab("logs")}
                                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-100 transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <Activity className="w-5 h-5 text-slate-400" />
                                                <span className="text-sm font-bold text-slate-700">
                                                    Log Aktivitas
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300" />
                                        </button>

                                        {/* Reset Seluruh Data (Hanya untuk yang memiliki permission reset_data) */}
                                        {hasPermission("reset_data") && (
                                            <button
                                                onClick={() => setIsResetModalOpen(true)}
                                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-100 transition-colors group"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <RotateCcw className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                                                    <span className="text-sm font-bold text-slate-700 group-hover:text-rose-500 transition-colors">
                                                        Reset Seluruh Data
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-300" />
                                            </button>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-between p-4 hover:bg-rose-50 transition-colors group"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <LogOut className="w-5 h-5 text-rose-500 group-hover:text-rose-600 transition-colors" />
                                                <span className="text-sm font-bold text-rose-500 group-hover:text-rose-600 transition-colors">
                                                    Keluar dari Akun
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </>
                            )}

                            {activeSettingsTab === "kategori" && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <button
                                            onClick={() =>
                                                setActiveSettingsTab("profile")
                                            }
                                            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Kembali ke Profile</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setNewCat({
                                                    id: null,
                                                    name: "",
                                                    budget: "",
                                                    icon: "Grid",
                                                    color: "bg-blue-500",
                                                });
                                                setShowAddCategoryModal(true);
                                            }}
                                            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 flex items-center justify-center space-x-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Tambah Kategori</span>
                                        </button>
                                    </div>
                                    <div className="mb-4 pt-2">
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">
                                            Kategori Pengeluaran
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Data berdasarkan bulan{" "}
                                            {
                                                [
                                                    "Januari",
                                                    "Februari",
                                                    "Maret",
                                                    "April",
                                                    "Mei",
                                                    "Juni",
                                                    "Juli",
                                                    "Agustus",
                                                    "September",
                                                    "Oktober",
                                                    "November",
                                                    "Desember",
                                                ][selectedMonth - 1]
                                            }{" "}
                                            {selectedYear}.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                                        {categories.map((c) => {
                                            const spent =
                                                expenseByCategoryForSelectedMonth[
                                                    c.id
                                                ] || 0;
                                            const percentage =
                                                c.budget > 0
                                                    ? Math.min(
                                                          (spent / c.budget) *
                                                              100,
                                                          100,
                                                      )
                                                    : 0;
                                            let IconComp = Grid;
                                            if (c.icon === "Utensils")
                                                IconComp = Utensils;
                                            if (c.icon === "Car")
                                                IconComp = Car;
                                            if (c.icon === "FileText")
                                                IconComp = FileText;
                                            if (c.icon === "Tv") IconComp = Tv;
                                            if (c.icon === "HeartPulse")
                                                IconComp = HeartPulse;

                                            return (
                                                <div
                                                    key={c.id}
                                                    className="p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] hover:border-blue-100 transition-all duration-300 group flex flex-col justify-between"
                                                >
                                                    <div className="flex items-start justify-between mb-5">
                                                        <div className="flex items-center space-x-3">
                                                            <div
                                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${c.color}`}
                                                            >
                                                                <IconComp className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                                                                    {c.name}
                                                                </h4>
                                                                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                                                                    Limit:{" "}
                                                                    {formatIDR(
                                                                        c.budget,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-1.5 md:opacity-0 md:group-hover:opacity-100 transition-all">
                                                            <button
                                                                onClick={() => {
                                                                    setNewCat({
                                                                        id: c.id,
                                                                        name: c.name,
                                                                        budget: c.budget.toString(),
                                                                        icon:
                                                                            c.icon ||
                                                                            "Grid",
                                                                        color:
                                                                            c.color ||
                                                                            "bg-blue-500",
                                                                    });
                                                                    setShowAddCategoryModal(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 shadow-sm transition-all"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteCategory(
                                                                        c.id,
                                                                    )
                                                                }
                                                                className="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 shadow-sm transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-end mb-2 font-bold">
                                                            <div>
                                                                <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                                                                    Terpakai
                                                                </span>
                                                                <span
                                                                    className={`text-sm ${percentage >= 100 ? "text-rose-600" : "text-slate-800"}`}
                                                                >
                                                                    {formatIDR(
                                                                        spent,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span
                                                                className={`text-xs ${percentage >= 100 ? "text-rose-500" : "text-blue-600"}`}
                                                            >
                                                                {percentage.toFixed(
                                                                    0,
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-slate-100/80 rounded-full h-2 overflow-hidden shadow-inner">
                                                            <div
                                                                className={`h-2 rounded-full transition-all duration-500 ${percentage >= 100 ? "bg-rose-500 shadow-rose-200" : "bg-blue-500 shadow-blue-200"} shadow-[0_0_8px_rgba(0,0,0,0.2)]`}
                                                                style={{
                                                                    width: `${percentage}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {showAddCategoryModal && (
                                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
                                            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                                    <h3 className="font-bold text-lg text-slate-800">
                                                        {newCat.id
                                                            ? "Edit Kategori"
                                                            : "Tambah Kategori"}
                                                    </h3>
                                                    <button
                                                        onClick={() =>
                                                            setShowAddCategoryModal(
                                                                false,
                                                            )
                                                        }
                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <form
                                                    onSubmit={handleAddCategory}
                                                    className="p-6 overflow-y-auto"
                                                >
                                                    <div className="space-y-5">
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                                                Nama Kategori
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Contoh: Pendidikan Anak"
                                                                value={
                                                                    newCat.name
                                                                }
                                                                onChange={(e) =>
                                                                    setNewCat({
                                                                        ...newCat,
                                                                        name: e
                                                                            .target
                                                                            .value,
                                                                    })
                                                                }
                                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                                                Anggaran Bulanan
                                                                (Limit)
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    placeholder={
                                                                        newCat.id
                                                                            ? "Budget bulan lalu"
                                                                            : "Rp 0"
                                                                    }
                                                                    value={
                                                                        newCat.budget
                                                                            ? formatIDR(
                                                                                  newCat.budget,
                                                                              )
                                                                            : ""
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const val =
                                                                            e.target.value.replace(
                                                                                /[^0-9]/g,
                                                                                "",
                                                                            );
                                                                        setNewCat(
                                                                            {
                                                                                ...newCat,
                                                                                budget: val,
                                                                            },
                                                                        );
                                                                    }}
                                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                                                Warna Kategori
                                                            </label>
                                                            <div className="flex flex-wrap gap-3">
                                                                {[
                                                                    "bg-blue-500",
                                                                    "bg-emerald-500",
                                                                    "bg-rose-500",
                                                                    "bg-orange-500",
                                                                    "bg-purple-500",
                                                                    "bg-slate-800",
                                                                ].map(
                                                                    (color) => (
                                                                        <button
                                                                            key={
                                                                                color
                                                                            }
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setNewCat(
                                                                                    {
                                                                                        ...newCat,
                                                                                        color,
                                                                                    },
                                                                                )
                                                                            }
                                                                            className={`w-10 h-10 rounded-full ${color} shadow-sm border-4 transition-all ${newCat.color === color ? "border-white ring-2 ring-blue-500 scale-110" : "border-transparent opacity-80 hover:opacity-100"}`}
                                                                        />
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                                                Ikon
                                                            </label>
                                                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                                                {Object.keys(ICON_MAP).map(
                                                                    (name) => {
                                                                        const Icon = ICON_MAP[name];
                                                                        return (
                                                                        <button
                                                                            key={
                                                                                name
                                                                            }
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setNewCat(
                                                                                    {
                                                                                        ...newCat,
                                                                                        icon: name,
                                                                                    },
                                                                                )
                                                                            }
                                                                            className={`flex items-center justify-center p-3 rounded-xl border transition-all ${newCat.icon === name ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                                                                        >
                                                                            <Icon className="w-5 h-5" />
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-8">
                                                        <button
                                                            type="submit"
                                                            className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
                                                        >
                                                            {newCat.id
                                                                ? "Simpan Perubahan"
                                                                : "Tambahkan Kategori"}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: EDIT PROFILE */}
                            {activeSettingsTab === "edit_profile" && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <button
                                            onClick={() => setActiveSettingsTab("profile")}
                                            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Kembali</span>
                                        </button>
                                        <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-3">
                                            <User className="w-7 h-7 text-blue-600" />
                                            <span>Ubah Profil</span>
                                        </h2>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <form onSubmit={submitProfileUpdate} className="p-5 sm:p-8 space-y-8">
                                            {/* Photo Profile Section */}
                                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                                <div className="relative group cursor-pointer">
                                                    <label htmlFor="avatar-upload" className="block cursor-pointer">
                                                        {profileData.avatar ? (
                                                            <img src={URL.createObjectURL(profileData.avatar)} alt="Avatar" className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-md border-4 border-white" />
                                                        ) : currentUser?.avatar ? (
                                                            <img src={`/storage/${currentUser.avatar}`} alt="Avatar" className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-md border-4 border-white" />
                                                        ) : (
                                                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl shadow-md border-4 border-white">
                                                                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                                                            </div>
                                                        )}
                                                        <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors group-hover:scale-110">
                                                            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </div>
                                                    </label>
                                                    <input 
                                                        id="avatar-upload" 
                                                        type="file" 
                                                        accept=".jpg,.jpeg,.png" 
                                                        className="hidden" 
                                                        onChange={(e) => setProfileData('avatar', e.target.files[0])}
                                                    />
                                                </div>
                                                <div className="text-center sm:text-left flex-1 pt-2">
                                                    <h3 className="font-bold text-slate-800 text-lg mb-1">Foto Profil</h3>
                                                    <p className="text-sm text-slate-500 max-w-md">
                                                        Gunakan foto dengan rasio 1:1. Ukuran maksimal 2MB. (Format: JPG, PNG).
                                                    </p>
                                                    {profileErrors.avatar && <p className="text-xs text-rose-500 mt-1.5">{profileErrors.avatar}</p>}
                                                </div>
                                            </div>

                                            <hr className="border-slate-100" />

                                            {/* Form Fields */}
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                            <User className="w-5 h-5" />
                                                        </div>
                                                        <input 
                                                            type="text" 
                                                            value={profileData.name} 
                                                            onChange={e => setProfileData('name', e.target.value)}
                                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
                                                            placeholder="Masukkan nama lengkap Anda"
                                                        />
                                                    </div>
                                                    {profileErrors.name && <p className="text-xs text-rose-500 mt-1.5">{profileErrors.name}</p>}
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Email</label>
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                            <Mail className="w-5 h-5" />
                                                        </div>
                                                        <input 
                                                            type="email" 
                                                            value={profileData.email} 
                                                            onChange={e => setProfileData('email', e.target.value)}
                                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
                                                            placeholder="contoh@email.com"
                                                        />
                                                    </div>
                                                    {profileErrors.email && <p className="text-xs text-rose-500 mt-1.5">{profileErrors.email}</p>}
                                                </div>
                                            </div>

                                            <div className="pt-4 flex justify-end">
                                                <button disabled={processingProfile} type="submit" className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2">
                                                    {processingProfile ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                                    <span>Simpan Perubahan</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* TAB: SECURITY */}
                            {activeSettingsTab === "security" && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <button
                                            onClick={() => setActiveSettingsTab("profile")}
                                            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Kembali</span>
                                        </button>
                                        <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-3">
                                            <Shield className="w-7 h-7 text-blue-600" />
                                            <span>Keamanan & Akun</span>
                                        </h2>
                                    </div>

                                    {/* Ubah Password Form */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center space-x-3">
                                            <KeyRound className="w-6 h-6 text-slate-400" />
                                            <h3 className="font-bold text-slate-800">Ubah Password</h3>
                                        </div>
                                        <form onSubmit={submitPasswordUpdate} className="p-5 sm:p-6 space-y-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Password Saat Ini</label>
                                                <div className="relative">
                                                    <input 
                                                        type={showPassword ? "text" : "password"}
                                                        value={pwdData.current_password}
                                                        onChange={e => setPwdData('current_password', e.target.value)}
                                                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                                        placeholder="Masukkan password lama"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {pwdErrors.current_password && <p className="text-xs text-rose-500 mt-1">{pwdErrors.current_password}</p>}
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-xs font-bold text-slate-600 uppercase">Password Baru</label>
                                                    <button type="button" onClick={generatePassword} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-lg">
                                                        <Sparkles className="w-3.5 h-3.5" />
                                                        <span>Generate</span>
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <input 
                                                        type={showPassword ? "text" : "password"}
                                                        value={pwdData.password}
                                                        onChange={e => setPwdData('password', e.target.value)}
                                                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                                        placeholder="Masukkan password baru"
                                                    />
                                                </div>
                                                {pwdErrors.password && <p className="text-xs text-rose-500 mt-1">{pwdErrors.password}</p>}
                                                
                                                {/* Password Strength Indicator */}
                                                {pwdData.password && (() => {
                                                    const strength = evaluatePasswordStrength(pwdData.password);
                                                    return (
                                                        <div className="mt-3">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs font-bold text-slate-500">Kekuatan Password</span>
                                                                <span className={`text-xs font-bold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
                                                            </div>
                                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                                                <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }}></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                                
                                                {/* Password Rules */}
                                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    <div className={`flex items-center space-x-1.5 text-xs font-bold ${/[A-Z]/.test(pwdData.password) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        <span>Huruf Besar</span>
                                                    </div>
                                                    <div className={`flex items-center space-x-1.5 text-xs font-bold ${/[0-9]/.test(pwdData.password) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        <span>Angka</span>
                                                    </div>
                                                    <div className={`flex items-center space-x-1.5 text-xs font-bold ${/[^A-Za-z0-9]/.test(pwdData.password) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        <span>Simbol (!@#)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Konfirmasi Password</label>
                                                <div className="relative">
                                                    <input 
                                                        type={showPassword ? "text" : "password"}
                                                        value={pwdData.password_confirmation}
                                                        onChange={e => setPwdData('password_confirmation', e.target.value)}
                                                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                                        placeholder="Ulangi password baru"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-2 flex justify-end">
                                                <button disabled={processingPwd} type="submit" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center space-x-2">
                                                    {processingPwd ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                                    <span>Update Password</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Active Devices Info */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center space-x-3">
                                            <Monitor className="w-6 h-6 text-slate-400" />
                                            <h3 className="font-bold text-slate-800">Sesi & Perangkat Aktif</h3>
                                        </div>
                                        <div className="p-5 sm:p-6 divide-y divide-slate-100">
                                            {activeSessions && activeSessions.length > 0 ? activeSessions.map((session, i) => (
                                                <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between">
                                                    <div className="flex space-x-4">
                                                        <div className="mt-1">
                                                            {session.user_agent?.toLowerCase().includes('mobile') ? (
                                                                <Smartphone className="w-6 h-6 text-slate-400" />
                                                            ) : (
                                                                <Monitor className="w-6 h-6 text-slate-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <h4 className="text-sm font-bold text-slate-800">
                                                                    {(() => {
                                                                        const agent = session.user_agent || "";
                                                                        let browser = "Browser";
                                                                        let os = "OS";
                                                                        if (agent.includes("Chrome")) browser = "Google Chrome";
                                                                        else if (agent.includes("Firefox")) browser = "Firefox";
                                                                        else if (agent.includes("Safari")) browser = "Safari";
                                                                        
                                                                        if (agent.includes("Mac")) os = "Mac";
                                                                        else if (agent.includes("Windows")) os = "Windows";
                                                                        else if (agent.includes("Linux")) os = "Linux";
                                                                        else if (agent.includes("Android")) os = "Android";
                                                                        else if (agent.includes("iPhone")) os = "iPhone";
                                                                        
                                                                        return `${os} - ${browser}`;
                                                                    })()}
                                                                </h4>
                                                                {session.is_current && (
                                                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-md">Saat Ini</span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-1">{session.ip_address} • Aktif {session.last_activity}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-sm text-slate-500 italic">Informasi sesi tidak tersedia (driver session bukan database).</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* TAB 6: ANGGOTA KELUARGA (SETTINGS) */}
                            {activeSettingsTab === "anggota" && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <button
                                            onClick={() =>
                                                setActiveSettingsTab("profile")
                                            }
                                            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Kembali ke Profile</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setNewMember({
                                                    id: null,
                                                    name: "",
                                                    role: "Anggota",
                                                    permissions: [
                                                        ...ROLE_PERMISSIONS[
                                                            "Anggota"
                                                        ],
                                                    ],
                                                });
                                                setShowAddMemberModal(true);
                                            }}
                                            className="px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-100 self-start sm:self-center"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            <span>Tambah Anggota</span>
                                        </button>
                                    </div>
                                    <div className="mb-4 pt-2">
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">
                                            Manajemen Anggota Keluarga
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Kelola anggota keluarga beserta hak akses masing-masing pengguna.
                                        </p>
                                    </div>

                                    {/* Daftar Anggota */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {members.map((m) => (
                                        <div
                                            key={m.id}
                                            className="p-5 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] hover:border-blue-100 transition-all duration-300 group flex flex-col justify-between"
                                        >
                                            <div className="flex items-center space-x-4 mb-5">
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-sm ${m.avatarColor}`}
                                                >
                                                    {m.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                                                        {m.name}
                                                    </h4>
                                                    <span className="text-xs text-slate-500 block mt-0.5">
                                                        {m.role}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                                                <div className="flex items-center gap-1.5">
                                                    <Shield className="w-4 h-4 text-blue-500" />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                        {(m.permissions || []).length} Hak Akses
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                                                    <button 
                                                        onClick={() => setSelectedMemberForDetail(m)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                                        title="Detail"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setNewMember({
                                                                id: m.id,
                                                                name: m.name,
                                                                role: m.role,
                                                                permissions: [...m.permissions]
                                                            });
                                                            setShowAddMemberModal(true);
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteMember(m.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>


                            {/* Modal Detail Anggota */}
                            {selectedMemberForDetail && createPortal(
                                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
                                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 animate-scaleUp">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm ${selectedMemberForDetail.avatarColor}`}>
                                                    {selectedMemberForDetail.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900">{selectedMemberForDetail.name}</h3>
                                                    <p className="text-sm text-slate-500">{selectedMemberForDetail.role}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{selectedMemberForDetail.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setSelectedMemberForDetail(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-xl transition-colors">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        
                                        <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-blue-500" />
                                            Hak Akses Aktif:
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1">
                                            {selectedMemberForDetail.permissions.length === 0 ? (
                                                <p className="text-sm text-slate-500 italic col-span-1 sm:col-span-2">Tidak ada hak akses.</p>
                                            ) : (
                                                selectedMemberForDetail.permissions.map(permKey => {
                                                    const permObj = AVAILABLE_PERMISSIONS.find(p => p.key === permKey);
                                                    return (
                                                        <div key={permKey} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800">{permObj?.label || permKey}</p>
                                                                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{permObj?.desc}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            , document.body)}

                            {/* Modal Tambah/Edit Anggota Baru */}
                            {showAddMemberModal && createPortal(
                                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                                    <div className="bg-white rounded-2xl border border-slate-150 max-w-3xl w-full p-6 shadow-xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-xl">
                                                    <UserPlus className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-base">
                                                        {newMember.id ? "Edit Data Anggota" : "Tambah Anggota Baru"}
                                                    </h3>
                                                    <p className="text-[11px] text-slate-400">
                                                        {newMember.id 
                                                            ? "Perbarui informasi dan hak akses anggota" 
                                                            : "Daftarkan anggota keluarga baru beserta hak aksesnya"}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setShowAddMemberModal(false)
                                                }
                                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <form
                                            onSubmit={handleAddMember}
                                            className="space-y-5"
                                        >
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                                                    Nama Lengkap
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Adik (Doni)"
                                                    value={newMember.name}
                                                    onChange={(e) =>
                                                        setNewMember({
                                                            ...newMember,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                                                    Peran
                                                </label>
                                                <select
                                                    value={newMember.role}
                                                    onChange={(e) =>
                                                        handleNewMemberRoleChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                                >
                                                    <option value="Anggota">
                                                        Anggota Keluarga
                                                    </option>
                                                    <option value="Bendahara">
                                                        Bendahara
                                                    </option>
                                                    <option value="Administrator">
                                                        Administrator
                                                    </option>
                                                </select>
                                            </div>

                                            {/* Permission Checklist */}
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 uppercase mb-3 flex items-center gap-1.5">
                                                    <Shield className="w-3.5 h-3.5 text-blue-600" />{" "}
                                                    Hak Akses & Permission
                                                </label>
                                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto">
                                                    {AVAILABLE_PERMISSIONS.map(
                                                        (perm) => {
                                                            const isChecked =
                                                                newMember.permissions.includes(
                                                                    perm.key,
                                                                );
                                                            return (
                                                                <label
                                                                    key={
                                                                        perm.key
                                                                    }
                                                                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                                        isChecked
                                                                            ? "bg-blue-50/70"
                                                                            : "hover:bg-white"
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            isChecked
                                                                        }
                                                                        onChange={() =>
                                                                            handleTogglePermission(
                                                                                perm.key,
                                                                            )
                                                                        }
                                                                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p
                                                                            className={`text-xs font-bold ${isChecked ? "text-blue-700" : "text-slate-600"}`}
                                                                        >
                                                                            {
                                                                                perm.label
                                                                            }
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                                                            {
                                                                                perm.desc
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </label>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowAddMemberModal(
                                                            false,
                                                        )
                                                    }
                                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all flex items-center gap-2"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                    Daftarkan Anggota
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            , document.body)}
                        </div>
                    )}

                    {/* TAB LOG AKTIVITAS (SETTINGS) */}
                    {activeSettingsTab === "logs" && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <button
                                    onClick={() => setActiveSettingsTab("profile")}
                                    className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Kembali ke Profile</span>
                                </button>
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl hidden sm:flex">
                                    <Activity className="w-5 h-5" />
                                </div>
                            </div>
                            
                            <div className="mb-4 pt-2 border-b border-slate-100 pb-5">
                                <h3 className="font-bold text-lg text-slate-900 mb-1">
                                    Log Aktivitas Sistem
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Merekam seluruh aktivitas pengguna di dalam aplikasi untuk transparansi dan keamanan.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                                <div className="divide-y divide-slate-100">
                                    {activityLogs.length === 0 && !isLoadingLogs ? (
                                        <div className="text-center py-10">
                                            <Activity className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                            <p className="text-slate-500 text-sm font-bold">Belum ada aktivitas terekam.</p>
                                        </div>
                                    ) : (
                                        activityLogs.map((log) => {
                                            const logDate = new Date(log.date || log.created_at);
                                            const isToday = logDate.toDateString() === new Date().toDateString();
                                            const timeString = logDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                            const dateString = logDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

                                            return (
                                                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${log.color}`}>
                                                            {log.icon === 'User' && <User className="w-4 h-4" />}
                                                            {log.icon === 'LogOut' && <LogOut className="w-4 h-4" />}
                                                            {log.icon === 'PlusCircle' && <PlusCircle className="w-4 h-4" />}
                                                            {log.icon === 'Edit' && <Edit className="w-4 h-4" />}
                                                            {log.icon === 'Trash2' && <Trash2 className="w-4 h-4" />}
                                                            {log.icon === 'Tag' && <Tag className="w-4 h-4" />}
                                                            {log.icon === 'UserPlus' && <UserPlus className="w-4 h-4" />}
                                                            {log.icon === 'UserMinus' && <UserMinus className="w-4 h-4" />}
                                                            {log.icon === 'Activity' && <Activity className="w-4 h-4" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{log.action}</h4>
                                                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{log.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <div className="text-xs font-bold text-slate-700">{log.user?.name || 'Sistem'}</div>
                                                        <div className="text-[10px] text-slate-400 mt-1">{isToday ? `Hari ini, ${timeString}` : `${dateString}`}</div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                
                                {/* Pagination Controls */}
                                {activityLogs.length > 0 && (
                                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-500 font-medium">Tampilkan:</span>
                                            <select
                                                value={logsPerPage}
                                                onChange={(e) => setLogsPerPage(Number(e.target.value))}
                                                className="rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white pl-2.5 pr-8 py-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all shadow-sm"
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={15}>15</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </select>
                                            <span className="text-slate-500 font-medium">
                                                Menampilkan {logsFrom} - {logsTo} dari {logsTotal} log
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={logsPage === 1 || isLoadingLogs}
                                                onClick={() => fetchLogs(logsPage - 1)}
                                                className="px-3 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-xl disabled:opacity-40 disabled:hover:bg-transparent transition-all font-bold text-slate-600 shadow-sm bg-white"
                                            >
                                                Sebelumnya
                                            </button>
                                            <span className="font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                                                {logsPage} / {logsLastPage}
                                            </span>
                                            <button
                                                disabled={logsPage === logsLastPage || isLoadingLogs}
                                                onClick={() => fetchLogs(logsPage + 1)}
                                                className="px-3 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-xl disabled:opacity-40 disabled:hover:bg-transparent transition-all font-bold text-slate-600 shadow-sm bg-white"
                                            >
                                                Selanjutnya
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 7: IMPORT DATA */}
                    {activeTab === "import" && (
                        <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
                            {/* Card 1: Dokumentasi & Unduh Template */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                                        <Info className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-lg text-slate-900">
                                            Panduan Import Transaksi Pengeluaran
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            Anda dapat mencatat banyak transaksi pengeluaran sekaligus dengan mengunggah file spreadsheet berformat `.csv`. Pastikan berkas Anda mengikuti struktur kolom berikut agar dapat diproses tanpa error.
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
                                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                <span className="font-bold text-slate-700 block">Tanggal</span>
                                                <span className="text-slate-400 text-[10px]">Format: YYYY-MM-DD</span>
                                            </div>
                                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                <span className="font-bold text-slate-700 block">Deskripsi</span>
                                                <span className="text-slate-400 text-[10px]">Nama/keterangan belanja</span>
                                            </div>
                                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                <span className="font-bold text-slate-700 block">Nominal</span>
                                                <span className="text-slate-400 text-[10px]">Angka bulat (contoh: 50000)</span>
                                            </div>
                                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                <span className="font-bold text-slate-700 block">Kategori</span>
                                                <span className="text-slate-400 text-[10px]">Misal: Makan, Bensin, dll.</span>
                                            </div>
                                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                <span className="font-bold text-slate-700 block">Dompet</span>
                                                <span className="text-slate-400 text-[10px]">Misal: BCA Ayah, Mandiri Ibu</span>
                                            </div>
                                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                <span className="font-bold text-slate-700 block">Anggota Keluarga</span>
                                                <span className="text-slate-400 text-[10px]">Misal: Ayah (Admin), Ibu</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 flex flex-wrap gap-3">
                                            <button
                                                onClick={downloadTemplate}
                                                className="px-4 py-2 border border-blue-200 hover:border-blue-300 text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Unduh Template format_import.csv
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Dropzone Pengunggahan */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="font-bold text-md text-slate-800 flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-blue-500" /> Unggah File CSV
                                </h3>

                                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 text-center transition-all bg-slate-50/50 hover:bg-blue-50/10 relative group">
                                    <input 
                                        type="file" 
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    <div className="flex flex-col items-center">
                                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        {importFileName ? (
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-800">{importFileName}</p>
                                                <p className="text-xs text-blue-600 font-medium">Klik atau seret file lain untuk mengganti</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-700">Pilih berkas CSV Anda</p>
                                                <p className="text-xs text-slate-400">Seret & lepas berkas ke sini, atau klik untuk mencari berkas</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Preview Data (Tampil hanya jika ada data pratinjau) */}
                            <AnimatePresence>
                                {importedData.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 15 }}
                                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                            <div>
                                                <h3 className="font-bold text-md text-slate-800">
                                                    Pratinjau & Edit Data Transaksi (.CSV)
                                                </h3>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Anda dapat mengedit data langsung pada tabel di bawah ini seperti Excel sebelum menyimpannya.
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                {/* Limit Selector */}
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <span>Baris:</span>
                                                    <select 
                                                        value={importItemsPerPage} 
                                                        onChange={(e) => {
                                                            setImportItemsPerPage(parseInt(e.target.value) || 5);
                                                            setImportCurrentPage(1);
                                                        }}
                                                        className="border border-slate-200 focus:border-blue-400 rounded-xl pl-2.5 pr-8 py-1 text-xs outline-none bg-white cursor-pointer transition-colors"
                                                    >
                                                        <option value={5}>5</option>
                                                        <option value={10}>10</option>
                                                        <option value={25}>25</option>
                                                        <option value={50}>50</option>
                                                        <option value={100}>100</option>
                                                    </select>
                                                </div>
                                                {/* Search Input */}
                                                <div className="relative">
                                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Cari pratinjau..." 
                                                        value={importSearchQuery} 
                                                        onChange={(e) => {
                                                            setImportSearchQuery(e.target.value);
                                                            setImportCurrentPage(1);
                                                        }}
                                                        className="pl-8 pr-4 py-1.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs focus:ring-0 outline-none transition-colors w-48"
                                                    />
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        setImportedData([]);
                                                        setImportFileName("");
                                                        setSelectedFile(null);
                                                    }}
                                                    className="text-xs font-bold text-rose-500 hover:underline"
                                                >
                                                    Hapus File
                                                </button>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto border border-slate-100 rounded-xl">
                                            <table className="w-full min-w-[1080px] text-left text-xs border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 font-bold text-slate-500 border-b border-slate-100">
                                                        <th className="p-3 w-32">Tanggal</th>
                                                        <th className="p-3 min-w-[280px]">Deskripsi</th>
                                                        <th className="p-3 w-40">Nominal</th>
                                                        <th className="p-3 w-40">Kategori</th>
                                                        <th className="p-3 w-40">Dompet</th>
                                                        <th className="p-3 w-40">Anggota</th>
                                                        <th className="p-3 w-32">Status</th>
                                                        <th className="p-3 w-20 text-center">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 text-slate-700">
                                                    {paginatedImportedData.map((row, idx) => {
                                                        const rowDate = row.date || '';
                                                        const rowDesc = row.description || '';
                                                        const rowAmt = typeof row.amount === 'number' && !isNaN(row.amount) ? row.amount : 0;
                                                        const rowCatName = row.categoryName || '';
                                                        const rowWalletName = row.walletName || '';
                                                        const rowMemberName = row.memberName || '';

                                                        const dateValid = rowDate && !isNaN(Date.parse(rowDate));
                                                        const amountValid = rowAmt > 0;
                                                        
                                                        const catObj = categories.find(c => c.name && c.name.toLowerCase() === rowCatName.toLowerCase()) 
                                                            || categories.find(c => c.name === 'Lainnya');
                                                            
                                                        const walletObj = wallets.find(w => w.name && w.name.toLowerCase() === rowWalletName.toLowerCase());
                                                        
                                                        const memberObj = members.find(m => m.name && m.name.toLowerCase() === rowMemberName.toLowerCase()) 
                                                            || currentUser;

                                                        let statusType = 'success';
                                                        let statusMsg = 'Valid';

                                                        if (!dateValid) {
                                                            statusType = 'error';
                                                            statusMsg = 'Format Tanggal Salah';
                                                        } else if (!amountValid) {
                                                            statusType = 'error';
                                                            statusMsg = 'Nominal harus > 0';
                                                        } else if (!walletObj) {
                                                            statusType = 'error';
                                                            statusMsg = 'Dompet tidak terdaftar';
                                                        } else if (rowCatName && !categories.find(c => c.name && c.name.toLowerCase() === rowCatName.toLowerCase())) {
                                                            statusType = 'warning';
                                                            statusMsg = 'Kategori masuk ke "Lainnya"';
                                                        } else if (rowMemberName && !members.find(m => m.name && m.name.toLowerCase() === rowMemberName.toLowerCase())) {
                                                            statusType = 'warning';
                                                            statusMsg = `Masuk ke akun ${currentUser?.name || 'User'}`;
                                                        }

                                                        return (
                                                            <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                                                {/* Tanggal (Editable Date Input) */}
                                                                <td className="p-2">
                                                                    <input 
                                                                        type="date" 
                                                                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 text-xs w-full font-mono outline-none"
                                                                        value={rowDate} 
                                                                        onChange={(e) => handleCellEdit(row.originalIndex, 'date', e.target.value)} 
                                                                    />
                                                                </td>
                                                                {/* Deskripsi (Editable Text Input) */}
                                                                <td className="p-2 min-w-[280px]">
                                                                    <input 
                                                                        type="text" 
                                                                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 text-xs w-full outline-none"
                                                                        value={rowDesc} 
                                                                        onChange={(e) => handleCellEdit(row.originalIndex, 'description', e.target.value)} 
                                                                    />
                                                                </td>
                                                                {/* Nominal (Editable Number Input + IDR visual label) */}
                                                                <td className="p-2">
                                                                    <div className="space-y-0.5">
                                                                        <input 
                                                                            type="number" 
                                                                            className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 text-xs w-full font-semibold outline-none"
                                                                            value={rowAmt} 
                                                                            onChange={(e) => handleCellEdit(row.originalIndex, 'amount', parseFloat(e.target.value) || 0)} 
                                                                        />
                                                                        <div className="text-[10px] text-slate-400 px-1 font-medium">{formatIDR(rowAmt)}</div>
                                                                    </div>
                                                                </td>
                                                                {/* Kategori (Editable Category Dropdown) */}
                                                                <td className="p-2">
                                                                    <select 
                                                                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded py-1 pl-1.5 pr-7 text-xs w-full outline-none cursor-pointer"
                                                                        value={rowCatName} 
                                                                        onChange={(e) => handleCellEdit(row.originalIndex, 'categoryName', e.target.value)}
                                                                    >
                                                                        {categories.map(c => (
                                                                            <option key={c.id} value={c.name}>{c.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                {/* Dompet (Editable Wallet Dropdown) */}
                                                                <td className="p-2">
                                                                    <select 
                                                                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded py-1 pl-1.5 pr-7 text-xs w-full outline-none text-slate-500 font-medium cursor-pointer"
                                                                        value={rowWalletName} 
                                                                        onChange={(e) => handleCellEdit(row.originalIndex, 'walletName', e.target.value)}
                                                                    >
                                                                        <option value="">-- Pilih --</option>
                                                                        {wallets.map(w => (
                                                                            <option key={w.id} value={w.name}>{w.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                {/* Anggota (Editable Member Dropdown) */}
                                                                <td className="p-2">
                                                                    <select 
                                                                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded py-1 pl-1.5 pr-7 text-xs w-full outline-none text-slate-600 font-medium cursor-pointer"
                                                                        value={rowMemberName} 
                                                                        onChange={(e) => handleCellEdit(row.originalIndex, 'memberName', e.target.value)}
                                                                    >
                                                                        {members.map(m => (
                                                                            <option key={m.id} value={m.name}>{m.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                {/* Status */}
                                                                <td className="p-3">
                                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                                        statusType === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                                        statusType === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                                        'bg-rose-50 text-rose-600 border border-rose-100'
                                                                    }`}>
                                                                        {statusMsg}
                                                                    </span>
                                                                </td>
                                                                {/* Aksi */}
                                                                <td className="p-2 text-center">
                                                                    <button
                                                                        onClick={() => handleDeleteImportRow(row.originalIndex)}
                                                                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                                                                        title="Hapus Baris"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination Controls */}
                                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-4 text-xs gap-3">
                                            <span className="text-slate-500">
                                                Menampilkan {filteredImportedData.length > 0 ? (importCurrentPage - 1) * importItemsPerPage + 1 : 0} - {Math.min(importCurrentPage * importItemsPerPage, filteredImportedData.length)} dari {filteredImportedData.length} baris
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    disabled={importCurrentPage === 1}
                                                    onClick={() => setImportCurrentPage(prev => Math.max(1, prev - 1))}
                                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl disabled:opacity-50 disabled:hover:bg-transparent transition-all font-bold text-slate-600"
                                                >
                                                    Sebelumnya
                                                </button>
                                                <span className="font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                    Halaman {importCurrentPage} dari {totalImportPages}
                                                </span>
                                                <button
                                                    disabled={importCurrentPage === totalImportPages}
                                                    onClick={() => setImportCurrentPage(prev => Math.min(totalImportPages, prev + 1))}
                                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl disabled:opacity-50 disabled:hover:bg-transparent transition-all font-bold text-slate-600"
                                                >
                                                    Selanjutnya
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                            <button
                                                onClick={() => {
                                                    setImportedData([]);
                                                    setImportFileName("");
                                                    setSelectedFile(null);
                                                }}
                                                className="px-4 py-2 border border-slate-200 hover:border-slate-350 text-slate-600 rounded-xl text-xs font-bold transition-all"
                                            >
                                                Batalkan
                                            </button>
                                            <button
                                                disabled={isImporting || importedData.length === 0 || importedData.some(row => {
                                                    const rowDate = row.date || '';
                                                    const rowAmt = typeof row.amount === 'number' && !isNaN(row.amount) ? row.amount : 0;
                                                    const rowWalletName = row.walletName || '';
                                                    const dateValid = rowDate && !isNaN(Date.parse(rowDate));
                                                    const amountValid = rowAmt > 0;
                                                    const walletObj = wallets.find(w => w.name && w.name.toLowerCase() === rowWalletName.toLowerCase());
                                                    return !walletObj || !dateValid || !amountValid;
                                                })}
                                                onClick={handleImportSubmit}
                                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isImporting ? (
                                                    <>
                                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                        Mengimpor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-3.5 h-3.5" />
                                                        Simpan & Import {importedData.length} Transaksi
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Modal Reset Data Transaksi */}
                    {isResetModalOpen && createPortal(
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl border border-slate-150 max-w-lg w-full p-6 shadow-xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-rose-50 rounded-xl">
                                            <RotateCcw className="w-5 h-5 text-rose-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-base">
                                                Reset Seluruh Data
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                Bersihkan data transaksi pada bulan tertentu
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsResetModalOpen(false);
                                            setSelectedResetMonths([]);
                                        }}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
 
                                {/* Warning Box */}
                                <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                                            Peringatan Penting!
                                        </h4>
                                        <p className="text-xs text-rose-600 leading-relaxed font-medium">
                                            Tindakan ini akan menghapus semua transaksi pengeluaran & pemasukan secara permanen pada bulan yang dipilih. Jika memilih Semua Role, seluruh data kategori & kantong juga akan dikembalikan ke data bawaan. Akun pengguna dan hak akses tetap aman.
                                        </p>
                                    </div>
                                </div>
 
                                {/* Month Selection List */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                            Pilih Bulan Transaksi
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (selectedResetMonths.length === availableTransactionMonths.length) {
                                                    setSelectedResetMonths([]);
                                                } else {
                                                    setSelectedResetMonths([...availableTransactionMonths]);
                                                }
                                            }}
                                            className="text-xs text-blue-600 hover:underline font-bold"
                                        >
                                            {selectedResetMonths.length === availableTransactionMonths.length ? "Batal Pilih Semua" : "Pilih Semua"}
                                        </button>
                                    </div>
 
                                    <div className="border border-slate-150 rounded-2xl divide-y divide-slate-100 max-h-48 overflow-y-auto bg-slate-50/30">
                                        {availableTransactionMonths.length === 0 ? (
                                            <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                                Tidak ada data transaksi yang tersedia untuk direset.
                                            </div>
                                        ) : (
                                            availableTransactionMonths.map(monthStr => {
                                                const isChecked = selectedResetMonths.includes(monthStr);
                                                return (
                                                    <label 
                                                        key={monthStr}
                                                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                                                    >
                                                        <span className="text-xs font-bold text-slate-700">
                                                            {formatMonthYear(monthStr)}
                                                        </span>
                                                        <input 
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => {
                                                                if (isChecked) {
                                                                    setSelectedResetMonths(prev => prev.filter(m => m !== monthStr));
                                                                } else {
                                                                    setSelectedResetMonths(prev => [...prev, monthStr]);
                                                                }
                                                            }}
                                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                                        />
                                                    </label>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
 
                                {/* Role Selection */}
                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                            Pilih Role (Opsional)
                                        </span>
                                    </div>
                                    <select
                                        value={selectedResetRole}
                                        onChange={(e) => setSelectedResetRole(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                    >
                                        <option value="all">Semua Role</option>
                                        <option value="Suami">Suami</option>
                                        <option value="Istri">Istri</option>
                                    </select>
                                </div>

                                {/* Modal Actions */}
                                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsResetModalOpen(false);
                                            setSelectedResetMonths([]);
                                        }}
                                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        disabled={selectedResetMonths.length === 0 || isResetting}
                                        onClick={handleResetSubmit}
                                        className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                    >
                                        {isResetting ? (
                                            <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                Mereset...
                                            </>
                                        ) : (
                                            <>
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                Reset Data ({selectedResetMonths.length} Bulan)
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    , document.body)}
                </section>
            </main>

            {/* === BOTTOM NAVIGATION BAR (MOBILE ONLY) === */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 px-6 py-2 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.1)] flex justify-between items-center h-16">
                {/* KIRI */}
                <div className="flex space-x-6">
                    {hasPermission("lihat_laporan") && (
                        <button
                            onClick={() => {
                                setActiveTab("dashboard");
                                setIsAddingTx(false);
                            }}
                            className="flex flex-col items-center justify-center p-2 transition-transform active:scale-95"
                        >
                            <LayoutDashboard
                                className={`w-6 h-6 ${activeTab === "dashboard" ? "text-blue-600" : "text-slate-400"}`}
                            />
                        </button>
                    )}
                    {(hasPermission("kelola_dompet") || hasPermission("lihat_dompet")) && (
                        <button
                            onClick={() => {
                                setActiveTab("dompet");
                                setIsAddingTx(false);
                            }}
                            className="flex flex-col items-center justify-center p-2 transition-transform active:scale-95"
                        >
                            <Wallet
                                className={`w-6 h-6 ${activeTab === "dompet" ? "text-blue-600" : "text-slate-400"}`}
                            />
                        </button>
                    )}
                </div>

                {/* TENGAH (FAB - Floating Action Button) */}
                {hasPermission("catat_transaksi") && (
                    <div className="relative -top-6">
                        <button
                            onClick={() => {
                                setActiveTab("pencatatan");
                                handleStartAddTransaction();
                            }}
                            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-300 hover:bg-blue-700 active:scale-95 transition-all border-4 border-slate-50"
                        >
                            <Plus className="w-7 h-7" />
                        </button>
                    </div>
                )}

                {/* KANAN */}
                <div className="flex space-x-6">
                    {hasPermission("atur_budget") && (
                        <button
                            onClick={() => {
                                setActiveTab("budgeting");
                                setIsAddingTx(false);
                            }}
                            className="flex flex-col items-center justify-center p-2 transition-transform active:scale-95"
                        >
                            <PieChart
                                className={`w-6 h-6 ${activeTab === "budgeting" ? "text-blue-600" : "text-slate-400"}`}
                            />
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setActiveTab("profile");
                            setActiveSettingsTab("profile");
                            setIsAddingTx(false);
                        }}
                        className="flex flex-col items-center justify-center p-2 transition-transform active:scale-95"
                    >
                        {currentUser?.avatar ? (
                            <img src={`/storage/${currentUser.avatar}`} alt="Avatar" className={`w-7 h-7 rounded-full object-cover border-2 ${activeTab === "profile" ? "border-blue-500 shadow-md shadow-blue-200" : "border-transparent"}`} />
                        ) : (
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${activeTab === "profile" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-slate-200 text-slate-500"}`}
                            >
                                {currentUser?.name
                                    ? currentUser.name.charAt(0).toUpperCase()
                                    : "U"}
                            </div>
                        )}
                    </button>
                </div>
            </nav>

            {/* MODAL TAMBAH / EDIT KANTONG */}
            {showAddWalletModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slideUp">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900">{newWallet.id ? "Edit Kantong" : "Tambah Kantong"}</h3>
                            <button onClick={() => setShowAddWalletModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAddWallet} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Nama Kantong</label>
                                    <input type="text" value={newWallet.name} onChange={(e) => setNewWallet({...newWallet, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Contoh: BCA Ayah" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Nominal Saldo Awal</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">Rp</span>
                                        <input type="text" value={newWallet.balance} onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setNewWallet({...newWallet, balance: val});
                                        }} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="0" required />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Otomatis terformat: {formatIDR(newWallet.balance || 0)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Tipe Kantong</label>
                                        <select value={newWallet.type} onChange={(e) => setNewWallet({...newWallet, type: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all">
                                            <option value="Bank">Bank</option>
                                            <option value="E-Wallet">E-Wallet</option>
                                            <option value="Tunai">Tunai</option>
                                            <option value="Investasi">Investasi</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Ikon</label>
                                        <select value={newWallet.icon || "Wallet"} onChange={(e) => setNewWallet({...newWallet, icon: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all">
                                            <option value="Wallet">Dompet</option>
                                            <option value="CreditCard">Kartu Kredit</option>
                                            <option value="Building">Bank</option>
                                            <option value="Smartphone">HP (E-Wallet)</option>
                                            <option value="Coins">Koin</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Warna Kantong</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['bg-blue-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-500', 'bg-purple-600', 'bg-indigo-600', 'bg-cyan-600', 'bg-slate-800'].map(c => (
                                            <button key={c} type="button" onClick={() => setNewWallet({...newWallet, color: c})} className={`w-8 h-8 rounded-full ${c} ${newWallet.color === c ? 'ring-2 ring-offset-2 ring-blue-500 shadow-md scale-110' : 'opacity-80 hover:opacity-100 hover:scale-110'} transition-all`}></button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex gap-3">
                                    <button type="button" onClick={() => setShowAddWalletModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                                    <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Tombol Kembali Ke Atas */}
            <div
                className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 transition-all duration-300 transform ${showScrollTop ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
            >
                <button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="p-3 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all"
                    title="Kembali ke atas"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            </div>

                            {/* MODAL EDIT DATA TRANSAKSI (Sleek Overlay) */}
                            {editingTx && (
                                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                    <div className="bg-white rounded-2xl border border-slate-150 max-w-lg w-full p-6 shadow-xl space-y-4 animate-scaleUp">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <h3 className="font-bold text-slate-900 text-base">
                                                Ubah Transaksi
                                            </h3>
                                            <button
                                                onClick={() =>
                                                    setEditingTx(null)
                                                }
                                                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <form
                                             onSubmit={handleSaveEditTransaction}
                                             className="space-y-4"
                                         >
                                             {/* Nominal (Rp) - Readonly / Disabled with Format Rupiah */}
                                             <div>
                                                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                                     Nominal (Rp)
                                                 </label>
                                                 <input
                                                     type="text"
                                                     value={editingTx.amount ? `Rp ${parseInt(editingTx.amount.toString().replace(/[^0-9]/g, "") || 0).toLocaleString('id-ID')}` : ""}
                                                     disabled
                                                     className="w-full px-3 py-2 border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed rounded-lg text-xs font-bold"
                                                 />
                                             </div>

                                             {/* Kategori & Dompet */}
                                             {editingTx.type !== "income" && (
                                                 <div className="grid grid-cols-2 gap-4">
                                                     <div>
                                                         <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                                             Kategori
                                                         </label>
                                                         <select
                                                             value={
                                                                 editingTx.categoryId
                                                             }
                                                             onChange={(e) =>
                                                                 setEditingTx({
                                                                     ...editingTx,
                                                                     categoryId:
                                                                         e.target
                                                                             .value,
                                                                 })
                                                             }
                                                             className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:ring-1 focus:ring-blue-500"
                                                         >
                                                             {categories.map((c) => (
                                                                 <option
                                                                     key={c.id}
                                                                     value={c.id}
                                                                 >
                                                                     {c.name}
                                                                 </option>
                                                             ))}
                                                         </select>
                                                     </div>

                                                     <div>
                                                         <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                                             Dompet
                                                         </label>
                                                         <select
                                                             value={
                                                                 editingTx.walletId
                                                             }
                                                             onChange={(e) =>
                                                                 setEditingTx({
                                                                     ...editingTx,
                                                                     walletId:
                                                                         e.target
                                                                             .value,
                                                                 })
                                                             }
                                                             className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:ring-1 focus:ring-blue-500"
                                                         >
                                                             {wallets.map((w) => (
                                                                 <option
                                                                     key={w.id}
                                                                     value={w.id}
                                                                 >
                                                                     {w.name}
                                                                 </option>
                                                             ))}
                                                         </select>
                                                     </div>
                                                 </div>
                                             )}

                                             {/* Tanggal */}
                                             <div>
                                                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                                     Tanggal
                                                 </label>
                                                 <input
                                                     type="date"
                                                     value={editingTx.date}
                                                     onChange={(e) =>
                                                         setEditingTx({
                                                             ...editingTx,
                                                             date: e.target
                                                                 .value,
                                                         })
                                                     }
                                                     className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                                                 />
                                             </div>

                                             {/* Deskripsi (at the bottom) */}
                                             <div>
                                                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                                     Deskripsi
                                                 </label>
                                                 <input
                                                     type="text"
                                                     value={
                                                         editingTx.description
                                                     }
                                                     onChange={(e) =>
                                                         setEditingTx({
                                                             ...editingTx,
                                                             description:
                                                                 e.target.value,
                                                         })
                                                     }
                                                     className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 text-slate-800"
                                                 />
                                             </div>

                                             {/* Anggota (Hidden input, because member is determined by active login session) */}
                                             <input
                                                 type="hidden"
                                                 value={editingTx.memberId}
                                             />

                                             <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                                                 <button
                                                     type="button"
                                                     onClick={() =>
                                                         setEditingTx(null)
                                                     }
                                                     className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-all"
                                                 >
                                                     Batal
                                                 </button>
                                                 <button
                                                     type="submit"
                                                     className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all"
                                                 >
                                                     Simpan Perubahan
                                                 </button>
                                             </div>
                                         </form>
                                    </div>
                                </div>
                            )}
            {/* MODAL TOP UP */}
            {showTopUpModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-150 max-w-sm w-full p-6 shadow-xl animate-scaleUp">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <h3 className="font-bold text-slate-900 text-base">Top Up Kantong</h3>
                            <button onClick={() => setShowTopUpModal(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleTopUpSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nominal Top Up</label>
                                <input
                                    type="text"
                                    value={topUpData.amount ? `Rp ${parseInt(topUpData.amount.toString().replace(/[^0-9]/g, "") || 0).toLocaleString('id-ID')}` : ""}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                        setTopUpData({ ...topUpData, amount: val });
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                                    placeholder="Rp 0"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setShowTopUpModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200">Batal</button>
                                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200">Top Up</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePage, useForm, router } from "@inertiajs/react";
import axios from "axios";
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
    Coins,
    Building,
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
import MonthRangePicker from "../Components/MonthRangePicker";
import WalletFormModal from "./Dashboard/Partials/WalletFormModal";
import TopUpModal from "./Dashboard/Partials/TopUpModal";
import TransferModal from "./Dashboard/Partials/TransferModal";
import BudgetingTab from "./Dashboard/Partials/BudgetingTab";

// Modular tab components
import PencatatanTab from "../Components/Dashboard/PencatatanTab";
import DompetTab from "../Components/Dashboard/DompetTab";
import SampahTab from "../Components/Dashboard/SampahTab";
import ProfileTab from "../Components/Dashboard/ProfileTab";
import ImportTab from "../Components/Dashboard/ImportTab";
import EditTransactionModal from "../Components/Dashboard/EditTransactionModal";
const isParentCategory = (cat) => {
    if (!cat) return false;
    return (
        !cat.parentId &&
        [
            "Kebutuhan Pokok",
            "Transportasi & Kerja",
            "Kebutuhan Pendukung",
            "Kesehatan & Perawatan",
            "Gaya Hidup & Konsumtif",
        ].includes(cat.name)
    );
};

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
    },
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
        "kelola_kategori",
    ],
    Suami: [
        "lihat_dompet",
        "topup_dompet",
        "catat_transaksi",
        "kelola_kategori",
        "lihat_laporan",
        "atur_budget",
        "ekspor_data",
        "kelola_dompet",
        "kelola_anggota",
        "lihat_log",
        "reset_data",
    ],
    Istri: [
        "lihat_dompet",
        "topup_dompet",
        "catat_transaksi",
        "lihat_laporan",
        "atur_budget",
        "ekspor_data",
    ],
    Anggota: ["lihat_dompet", "catat_transaksi", "lihat_laporan"],
};

const INITIAL_MEMBERS = [
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
    {
        id: "c1",
        name: "Makan",
        icon: "Utensils",
        color: "bg-orange-500",
        budget: 1500000,
    },
    {
        id: "c2",
        name: "Jajan",
        icon: "Package",
        color: "bg-yellow-500",
        budget: 500000,
    },
    {
        id: "c3",
        name: "Kartu KRL",
        icon: "CreditCard",
        color: "bg-blue-500",
        budget: 200000,
    },
    {
        id: "c4",
        name: "Lainnya",
        icon: "Grid",
        color: "bg-slate-500",
        budget: 300000,
    },
    {
        id: "c5",
        name: "Penitipan motor",
        icon: "Bike",
        color: "bg-indigo-500",
        budget: 100000,
    },
    {
        id: "c6",
        name: "Pokok",
        icon: "Home",
        color: "bg-emerald-500",
        budget: 2000000,
    },
    {
        id: "c7",
        name: "Rokok",
        icon: "Flame",
        color: "bg-red-500",
        budget: 400000,
    },
    {
        id: "c8",
        name: "Permotoran",
        icon: "Wrench",
        color: "bg-zinc-600",
        budget: 300000,
    },
    {
        id: "c9",
        name: "Bensin",
        icon: "Fuel",
        color: "bg-cyan-500",
        budget: 400000,
    },
    {
        id: "c10",
        name: "Kebutuhan dapur",
        icon: "ShoppingCart",
        color: "bg-amber-600",
        budget: 800000,
    },
    {
        id: "c11",
        name: "Kebersihan",
        icon: "Droplets",
        color: "bg-teal-400",
        budget: 150000,
    },
    {
        id: "c12",
        name: "Skincare & Bodycare",
        icon: "Sparkles",
        color: "bg-pink-400",
        budget: 300000,
    },
    {
        id: "c13",
        name: "Kuota",
        icon: "Wifi",
        color: "bg-violet-500",
        budget: 150000,
    },
    {
        id: "c14",
        name: "Ngopi",
        icon: "Coffee",
        color: "bg-stone-600",
        budget: 300000,
    },
    {
        id: "c15",
        name: "Piutang",
        icon: "HandCoins",
        color: "bg-lime-600",
        budget: 500000,
    },
    {
        id: "c16",
        name: "Buah-buahan",
        icon: "Apple",
        color: "bg-red-400",
        budget: 200000,
    },
];

const INITIAL_WALLETS = [
    {
        id: "w1",
        name: "Rekening Utama (BCA)",
        balance: 8500000,
        type: "Bank",
        isUtama: true,
        userId: "m1",
    },
    {
        id: "w2",
        name: "Dompet Tunai Ibu",
        balance: 1200000,
        type: "Tunai",
        userId: "m3",
    },
    {
        id: "w3",
        name: "Dana Darurat (Mandiri)",
        balance: 5000000,
        type: "Investasi",
        userId: "m2",
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

export default function App({
    auth,
    initialMembers,
    initialCategories,
    initialWallets,
    initialTransactions,
    activeSessions,
    initialTrashTransactions,
    initialTrashCategories,
    initialTrashWallets,
    trustedDevice,
}) {
    const currentUser = auth?.user || null;
    const isLoggedIn = !!currentUser;

    // Fallback to INITIAL_ constants if database props are empty/undefined (e.g. before full integration)
    const [transactions, setTransactions] = useState(
        initialTransactions || INITIAL_TRANSACTIONS,
    );
    const [trashTransactions, setTrashTransactions] = useState(
        initialTrashTransactions || [],
    );
    const [trashCategories, setTrashCategories] = useState(
        initialTrashCategories || [],
    );
    const [trashWallets, setTrashWallets] = useState(initialTrashWallets || []);
    const [trashSubTab, setTrashSubTab] = useState("tx");
    const [categories, setCategories] = useState(
        initialCategories || INITIAL_CATEGORIES,
    );
    const [wallets, setWallets] = useState(initialWallets || INITIAL_WALLETS);
    const [members, setMembers] = useState(initialMembers || INITIAL_MEMBERS);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // PIN Login States
    const [usePinLogin, setUsePinLogin] = useState(!!trustedDevice);
    const [pin, setPin] = useState("");
    const [pinError, setPinError] = useState("");

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
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        monthsSet.add(currentMonthStr);

        transactions.forEach((t) => {
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
        if (!monthStr || !monthStr.includes("-")) return monthStr;
        const [year, month] = monthStr.split("-");
        const monthNames = [
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
        ];
        const monthIdx = parseInt(month, 10) - 1;
        if (monthIdx < 0 || monthIdx > 11) return monthStr;
        return `${monthNames[monthIdx]} ${year}`;
    };

    const handleResetSubmit = () => {
        if (selectedResetMonths.length === 0) return;
        let confirmMsg = `Apakah Anda yakin ingin menghapus data transaksi untuk ${selectedResetMonths.length} bulan terpilih`;
        if (selectedResetRole !== "all") {
            confirmMsg += ` (Role ${selectedResetRole})`;
        } else {
            confirmMsg += ` serta mereset seluruh data kategori & kantong ke data bawaan`;
        }
        confirmMsg += "? Tindakan ini tidak dapat dibatalkan.";
        if (!confirm(confirmMsg)) return;

        setIsResetting(true);
        axios
            .post(route("profile.reset-data"), {
                months: selectedResetMonths,
                role: selectedResetRole,
            })
            .then((res) => {
                showToast("Data transaksi berhasil di-reset.");
                setIsResetModalOpen(false);
                setSelectedResetMonths([]);
                router.reload({
                    preserveState: true,
                    onSuccess: () => {
                        axios.get(
                            "/api/dashboard/metrics?force_recalculate=true",
                        );
                    },
                });
            })
            .catch((err) => {
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

    const [activeTab, setActiveTab] = useState(
        isLoggedIn
            ? currentUser.role === "Administrator" ||
              currentUser.permissions?.includes("lihat_laporan")
                ? "dashboard"
                : "profile"
            : "dashboard",
    );
    const [activeSettingsTab, setActiveSettingsTab] = useState("profile");

    // Form States for Profile and Security
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const {
        data: profileData,
        setData: setProfileData,
        post: postProfile,
        processing: processingProfile,
        errors: profileErrors,
        recentlySuccessful: profileSuccessful,
    } = useForm({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        avatar: null,
        _method: "PATCH",
    });

    const {
        data: pwdData,
        setData: setPwdData,
        put: putPassword,
        processing: processingPwd,
        errors: pwdErrors,
        reset: resetPwd,
        recentlySuccessful: pwdSuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const generatePassword = () => {
        const charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let retVal = "";
        // Ensure at least one uppercase, one lowercase, one numeric, and one symbol
        retVal += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
        retVal += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
        retVal += "0123456789"[Math.floor(Math.random() * 10)];
        retVal += "!@#$%^&*()_+~`|}{[]:;?><,./-="[
            Math.floor(Math.random() * 29)
        ];
        for (let i = 0, n = charset.length; i < 12; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        // Shuffle the string
        retVal = retVal
            .split("")
            .sort(() => 0.5 - Math.random())
            .join("");
        setPwdData((data) => ({
            ...data,
            password: retVal,
            password_confirmation: retVal,
        }));
    };

    const evaluatePasswordStrength = (pwd) => {
        let score = 0;
        if (pwd.length > 8) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[a-z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        if (score === 0) return { label: "Kosong", color: "bg-slate-200" };
        if (score <= 2)
            return { label: "Lemah", color: "bg-rose-500", width: "25%" };
        if (score <= 3)
            return { label: "Sedang", color: "bg-yellow-500", width: "50%" };
        if (score === 4)
            return { label: "Kuat", color: "bg-blue-500", width: "75%" };
        return { label: "Sangat Kuat", color: "bg-emerald-500", width: "100%" };
    };

    const submitProfileUpdate = (e) => {
        e.preventDefault();
        postProfile(route("profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                showToast("Profil berhasil diperbarui");
                setActiveSettingsTab("profile");
            },
        });
    };

    const submitPasswordUpdate = (e) => {
        e.preventDefault();
        putPassword(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => {
                showToast("Password berhasil diubah");
                resetPwd();
            },
            onError: (errors) => {
                if (errors.password) {
                    resetPwd("password", "password_confirmation");
                }
                if (errors.current_password) {
                    resetPwd("current_password");
                }
            },
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
            const res = await axios.get(
                `/logs?page=${page}&per_page=${perPage}`,
            );
            const payload = res.data.data;
            if (payload && payload.data) {
                setActivityLogs(payload.data);
                const meta = payload.meta || {};
                setLogsPage(meta.current_page || 1);
                setLogsLastPage(meta.last_page || 1);
                setLogsTotal(meta.total || 0);
                setLogsFrom(meta.from || 0);
                setLogsTo(meta.to || 0);
            } else {
                setActivityLogs(res.data.data || []);
                setLogsPage(res.data.current_page || 1);
                setLogsLastPage(res.data.last_page || 1);
                setLogsTotal(res.data.total || 0);
                setLogsFrom(res.data.from || 0);
                setLogsTo(res.data.to || 0);
            }
        } catch (err) {
            console.error("Failed to fetch logs", err);
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

    const logActivity = (
        action,
        description,
        icon = "Activity",
        color = "bg-blue-500",
    ) => {
        axios
            .post("/logs", { action, description, icon, color })
            .then((res) => {
                if (activeSettingsTab === "logs" && logsPage === 1) {
                    fetchLogs(1, logsPerPage);
                }
            })
            .catch((err) => console.error("Failed to log activity", err));
    };

    useEffect(() => {
        if (initialTransactions) setTransactions(initialTransactions);
        if (initialCategories) setCategories(initialCategories);
        if (initialWallets) setWallets(initialWallets);
        if (initialMembers) setMembers(initialMembers);
        if (initialTrashTransactions)
            setTrashTransactions(initialTrashTransactions);
        if (initialTrashCategories) setTrashCategories(initialTrashCategories);
        if (initialTrashWallets) setTrashWallets(initialTrashWallets);
    }, [
        initialTransactions,
        initialCategories,
        initialWallets,
        initialMembers,
        initialTrashTransactions,
        initialTrashCategories,
        initialTrashWallets,
    ]);

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
    const [topUpData, setTopUpData] = useState({
        walletId: "",
        sourceWalletId: "",
        amount: "",
    });
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
        parentId: null,
        priorityLevel: 5,
    });
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showAddWalletModal, setShowAddWalletModal] = useState(false);
    const [walletSearch, setWalletSearch] = useState("");
    const [walletCategoryFilter, setWalletCategoryFilter] = useState("all");
    const [selectedWalletId, setSelectedWalletId] = useState(null);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferData, setTransferData] = useState({
        sourceWalletId: "",
        targetWalletId: "",
        amount: "",
    });
    const [detailSearch, setDetailSearch] = useState("");
    const [detailCategoryFilter, setDetailCategoryFilter] = useState("all");
    const [detailTxPage, setDetailTxPage] = useState(1);
    const [newWallet, setNewWallet] = useState({
        id: null,
        name: "",
        balance: "",
        type: "Bank",
        color: "bg-blue-600",
        icon: "Wallet",
        is_utama: false,
    });
    const [newMember, setNewMember] = useState({
        id: null,
        name: "",
        role: "Anggota",
        permissions: [...ROLE_PERMISSIONS["Anggota"]],
    });
    const [selectedMemberForDetail, setSelectedMemberForDetail] =
        useState(null);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

    const [budgetStartDate, setBudgetStartDate] = useState("");
    const [budgetEndDate, setBudgetEndDate] = useState("");

    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2026);
    const [selectedMonth, setSelectedMonth] = useState(7);
    const [selectedEndMonth, setSelectedEndMonth] = useState(7);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // PWA Install State
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    // Trusted Devices & PIN Security states
    const [pinMessage, setPinMessage] = useState({ text: "", type: "" });
    const [currentPasswordForPin, setCurrentPasswordForPin] = useState("");
    const [newPinCode, setNewPinCode] = useState("");
    const [confirmNewPinCode, setConfirmNewPinCode] = useState("");
    const [isPinProcessing, setIsPinProcessing] = useState(false);
    const [trustedDevices, setTrustedDevices] = useState([]);
    const [isLoadingDevices, setIsLoadingDevices] = useState(false);
    const [renameDeviceId, setRenameDeviceId] = useState(null);
    const [renameDeviceName, setRenameDeviceName] = useState("");

    const fetchTrustedDevices = () => {
        setIsLoadingDevices(true);
        axios.get(route('trusted-devices.index'))
            .then(res => {
                setTrustedDevices(res.data.devices || []);
            })
            .catch(err => {
                showToast("Gagal mengambil data perangkat terpercaya.", "error");
            })
            .finally(() => {
                setIsLoadingDevices(false);
            });
    };

    useEffect(() => {
        if (activeSettingsTab === "trusted_devices" && activeTab === "profile") {
            fetchTrustedDevices();
        }
    }, [activeSettingsTab, activeTab]);

    const handleResetPin = (e) => {
        e.preventDefault();
        setIsPinProcessing(true);
        setPinMessage({ text: "", type: "" });
        if (newPinCode !== confirmNewPinCode) {
            setPinMessage({ text: "Konfirmasi PIN tidak cocok.", type: "error" });
            setIsPinProcessing(false);
            return;
        }
        router.post(route('pin.reset'), {
            password: currentPasswordForPin,
            pin: newPinCode,
        }, {
            onSuccess: () => {
                setPinMessage({ text: "PIN berhasil diperbarui.", type: "success" });
                setCurrentPasswordForPin("");
                setNewPinCode("");
                setConfirmNewPinCode("");
            },
            onError: (errors) => {
                setPinMessage({ text: errors.password || errors.pin || "Gagal memperbarui PIN.", type: "error" });
            },
            onFinish: () => {
                setIsPinProcessing(false);
            }
        });
    };

    const handleRemoveDevice = (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus perangkat ini?")) return;
        setIsLoadingDevices(true);
        router.delete(route('trusted-devices.destroy', { id }), {
            onSuccess: () => {
                showToast("Perangkat berhasil dihapus.", "success");
                fetchTrustedDevices();
            },
            onError: () => {
                showToast("Gagal menghapus perangkat.", "error");
            },
            onFinish: () => {
                setIsLoadingDevices(false);
            }
        });
    };

    const handleRemoveAllDevices = () => {
        if (!confirm("Apakah Anda yakin ingin menghapus semua perangkat lain?")) return;
        setIsLoadingDevices(true);
        router.delete(route('trusted-devices.destroy-all'), {
            onSuccess: () => {
                showToast("Semua perangkat lain berhasil dihapus.", "success");
                fetchTrustedDevices();
            },
            onError: () => {
                showToast("Gagal menghapus semua perangkat lain.", "error");
            },
            onFinish: () => {
                setIsLoadingDevices(false);
            }
        });
    };

    const handleRenameDevice = (id) => {
        if (!renameDeviceName.trim()) return;
        setIsLoadingDevices(true);
        router.put(route('trusted-devices.update', { id }), {
            device_name: renameDeviceName
        }, {
            onSuccess: () => {
                showToast("Perangkat berhasil diubah namanya.", "success");
                fetchTrustedDevices();
                setRenameDeviceId(null);
                setRenameDeviceName("");
            },
            onError: () => {
                showToast("Gagal mengubah nama perangkat.", "error");
            },
            onFinish: () => {
                setIsLoadingDevices(false);
            }
        });
    };

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
                const m = txDate.getMonth() + 1;
                return (
                    m >= selectedMonth &&
                    m <= selectedEndMonth &&
                    txDate.getFullYear() === selectedYear
                );
            })
            .forEach((t) => {
                if (map[t.categoryId] !== undefined) {
                    map[t.categoryId] += t.amount;
                }
            });
        return map;
    }, [
        transactions,
        categories,
        selectedMonth,
        selectedEndMonth,
        selectedYear,
    ]);

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

        router.post(
            route("login"),
            {
                email: loginEmail,
                password: loginPassword,
            },
            {
                onError: (errors) => {
                    showToast(
                        errors.email ||
                            "Login gagal, silakan periksa kredensial Anda.",
                        "error",
                    );
                },
                onSuccess: () => {
                    showToast(`Selamat datang kembali!`);
                },
            },
        );
    };

    const handlePinLogin = (e) => {
        e.preventDefault();
        if (pin.length !== 6 || isNaN(pin)) {
            setPinError("PIN harus berupa 6 digit angka.");
            return;
        }

        setPinError("");
        router.post(
            route("pin.login"),
            { pin },
            {
                onError: (errors) => {
                    setPinError(errors.pin || "Gagal masuk menggunakan PIN.");
                    setPin("");
                },
                onSuccess: () => {
                    showToast(`Selamat datang kembali!`);
                },
            }
        );
    };

    const handleQuickLogin = (member) => {
        setCurrentUser(member);
        setIsLoggedIn(true);
        if (
            member.role !== "Administrator" &&
            !member.permissions?.includes("lihat_laporan")
        ) {
            setActiveTab("profile");
        } else {
            setActiveTab("dashboard");
        }
        showToast(`Berhasil masuk sebagai ${member.name}`);
    };

    const handleLogout = () => {
        if (window.confirm("Apakah Anda yakin ingin keluar?")) {
            router.post(
                route("logout"),
                {},
                {
                    onSuccess: () => {
                        setLoginEmail("");
                        setLoginPassword("");
                        showToast("Anda telah keluar dari aplikasi", "info");
                    },
                },
            );
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
        if (
            !topUpData.amount ||
            isNaN(topUpData.amount) ||
            parseFloat(topUpData.amount) <= 0
        ) {
            showToast("Nominal top up tidak valid", "error");
            return;
        }
        const amountNum = parseFloat(topUpData.amount);

        const targetWallet = wallets.find((w) => w.id === topUpData.walletId);
        if (!targetWallet) {
            showToast("Kantong tujuan tidak ditemukan.", "error");
            return;
        }

        // Jika target wallet adalah dompet utama, maka source_wallet_id diset sama dengan target wallet (top up mandiri)
        const sourceId = targetWallet.isUtama
            ? topUpData.walletId
            : topUpData.sourceWalletId;

        if (!sourceId) {
            showToast("Silakan pilih kantong sumber dana.", "error");
            return;
        }

        const sourceWallet = wallets.find((w) => w.id === sourceId);
        if (!sourceWallet) {
            showToast("Kantong sumber dana tidak ditemukan.", "error");
            return;
        }

        router.post(
            "/wallets/top-up",
            {
                wallet_id: topUpData.walletId,
                source_wallet_id: sourceId,
                amount: amountNum,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowTopUpModal(false);
                    showToast("Top up kantong berhasil!", "success");
                    logActivity(
                        "Top Up Kantong",
                        `Top up kantong ${targetWallet.name} senilai Rp ${formatIDR(amountNum)} dari ${sourceWallet.name}`,
                        "Tambah",
                        "bg-emerald-500",
                    );
                },
                onError: (errors) => {
                    const errorMsg = errors.amount || "Gagal melakukan top up";
                    showToast(errorMsg, "error");
                },
            },
        );
    };

    const handleTransferSubmit = (e) => {
        e.preventDefault();
        if (
            !transferData.amount ||
            isNaN(transferData.amount) ||
            parseFloat(transferData.amount) <= 0
        ) {
            showToast("Nominal transfer tidak valid", "error");
            return;
        }
        const amountNum = parseFloat(transferData.amount);

        const sourceWallet = wallets.find(
            (w) => w.id === transferData.sourceWalletId,
        );
        if (!sourceWallet) {
            showToast("Kantong asal tidak ditemukan.", "error");
            return;
        }

        if (sourceWallet.isUtama && sourceWallet.balance < amountNum) {
            showToast(
                "Saldo Dompet Utama tidak mencukupi untuk dipindahkan.",
                "error",
            );
            return;
        }

        const targetWallet = wallets.find(
            (w) => w.id === transferData.targetWalletId,
        );
        if (!targetWallet) {
            showToast("Kantong tujuan tidak ditemukan.", "error");
            return;
        }

        if (sourceWallet.id === targetWallet.id) {
            showToast(
                "Tidak bisa mentransfer uang ke kantong yang sama.",
                "error",
            );
            return;
        }

        router.post(
            "/wallets/transfer",
            {
                source_wallet_id: transferData.sourceWalletId,
                target_wallet_id: transferData.targetWalletId,
                amount: amountNum,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowTransferModal(false);
                    showToast("Uang berhasil dipindahkan!", "success");
                    logActivity(
                        "Pindahkan Saldo",
                        `Transfer saldo senilai Rp ${formatIDR(amountNum)} dari ${sourceWallet.name} ke ${targetWallet.name}`,
                        "Kirim",
                        "bg-blue-500",
                    );
                },
                onError: (errors) => {
                    const errorMsg = errors.amount || "Gagal memindahkan saldo";
                    showToast(errorMsg, "error");
                },
            },
        );
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
        logActivity(
            "Tambah Transaksi",
            `Menambahkan ${finalTransactions.length} transaksi baru dengan total Rp ${finalTransactions.reduce((acc, tx) => acc + tx.amount, 0).toLocaleString("id-ID")}`,
            "PlusCircle",
            "bg-blue-500",
        );
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

        router.put(
            `/transactions/${editingTx.id}`,
            {
                date: editingTx.date,
                description: editingTx.description,
                amount: amountNum,
                type: editingTx.type,
                category_id: editingTx.categoryId || null,
                wallet_id: editingTx.walletId,
                user_id: editingTx.memberId,
            },
            {
                onSuccess: () => {
                    setEditingTx(null);
                    showToast("Transaksi berhasil diperbarui");
                    logActivity(
                        "Update Transaksi",
                        `Memperbarui transaksi: ${editingTx.description}`,
                        "Edit",
                        "bg-amber-500",
                    );
                },
                onError: (err) => {
                    showToast("Gagal memperbarui transaksi", "error");
                },
            },
        );
    };

    const handleDeleteTransaction = (id, type, amount, walletId) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?"))
            return;
        const txToDelete = transactions.find((t) => t.id === id);

        router.delete(`/transactions/${id}`, {
            onSuccess: () => {
                showToast("Transaksi berhasil dihapus", "info");
                if (txToDelete) {
                    logActivity(
                        "Hapus Transaksi",
                        `Menghapus transaksi: ${txToDelete.description}`,
                        "Trash2",
                        "bg-rose-500",
                    );
                }
            },
            onError: (err) => {
                showToast("Gagal menghapus transaksi", "error");
            },
        });
    };

    const handleRestoreItem = (type, id) => {
        router.post(
            `/trash/restore/${type}/${id}`,
            {},
            {
                onSuccess: () => {
                    showToast("Data berhasil dipulihkan");
                    logActivity(
                        "Restore Data",
                        `Memulihkan data ${type} dari kotak sampah`,
                        "RotateCcw",
                        "bg-blue-500",
                    );
                },
                onError: () => {
                    showToast("Gagal memulihkan data", "error");
                },
            },
        );
    };

    const handleForceDeleteItem = (type, id) => {
        if (
            !window.confirm(
                "Apakah Anda yakin ingin menghapus data ini secara permanen? Tindakan ini tidak dapat dibatalkan.",
            )
        )
            return;
        router.delete(`/trash/force-delete/${type}/${id}`, {
            onSuccess: () => {
                showToast("Data berhasil dihapus permanen", "info");
                logActivity(
                    "Hapus Permanen",
                    `Menghapus permanen data ${type} dari kotak sampah`,
                    "Trash2",
                    "bg-rose-600",
                );
            },
            onError: () => {
                showToast("Gagal menghapus data", "error");
            },
        });
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!newCat.name) {
            showToast("Nama kategori wajib diisi", "error");
            return;
        }

        const payload = {
            name: newCat.name,
            budget: parseFloat(newCat.budget) || 0,
            icon: newCat.icon || "Grid",
            color: newCat.color || "bg-blue-500",
            parent_id: newCat.parentId ? newCat.parentId : null,
            priority_level: parseInt(newCat.priorityLevel) || 5,
        };

        if (newCat.id) {
            router.put(`/categories/${newCat.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddCategoryModal(false);
                    showToast("Kategori berhasil diperbarui");
                    logActivity(
                        "Ubah Kategori",
                        `Kategori diperbarui: ${newCat.name}`,
                        "Edit",
                        "bg-blue-500",
                    );
                },
                onError: (errors) => {
                    showToast(
                        errors.budget || "Gagal mengubah kategori",
                        "error",
                    );
                },
            });
        } else {
            router.post("/categories", payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddCategoryModal(false);
                    showToast("Kategori baru berhasil ditambahkan");
                    logActivity(
                        "Tambah Kategori",
                        `Kategori baru ditambahkan: ${newCat.name}`,
                        "Tag",
                        "bg-emerald-500",
                    );
                },
                onError: (errors) => {
                    showToast(
                        errors.budget || "Gagal menambahkan kategori",
                        "error",
                    );
                },
            });
        }

        setNewCat({
            id: null,
            name: "",
            budget: "0",
            icon: "Grid",
            color: "bg-blue-500",
            parentId: null,
            priorityLevel: 5,
        });
        setShowAddCategoryModal(false);
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm("Yakin ingin menghapus kategori ini?")) {
            const catToDel = categories.find((c) => c.id === id);

            // Jika id berupa string dengan awalan 'c_' berarti ini adalah data mock frontend
            if (typeof id === "string" && id.startsWith("c_")) {
                setCategories(categories.filter((c) => c.id !== id));
                showToast("Kategori berhasil dihapus", "info");
                logActivity(
                    "Hapus Kategori",
                    `Kategori dihapus: ${catToDel?.name}`,
                    "Trash2",
                    "bg-rose-500",
                );
                return;
            }

            // Hapus data dari database via backend
            router.delete(`/categories/${id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    showToast("Kategori berhasil dihapus", "info");
                    logActivity(
                        "Hapus Kategori",
                        `Kategori dihapus: ${catToDel?.name}`,
                        "Trash2",
                        "bg-rose-500",
                    );
                },
                onError: (errors) => {
                    showToast("Gagal menghapus kategori", "error");
                    console.error("Gagal hapus kategori:", errors);
                },
            });
        }
    };

    const handleDeleteWallet = (id) => {
        if (window.confirm("Yakin ingin menghapus kantong ini?")) {
            const walletToDel = wallets.find((w) => w.id === id);

            if (typeof id === "string" && id.startsWith("w_")) {
                setWallets(wallets.filter((w) => w.id !== id));
                showToast("Kantong berhasil dihapus", "info");
                logActivity(
                    "Hapus Kantong",
                    `Kantong dihapus: ${walletToDel?.name}`,
                    "Trash2",
                    "bg-rose-500",
                );
                return;
            }

            router.delete(`/wallets/${id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    showToast("Kantong berhasil dihapus", "info");
                    logActivity(
                        "Hapus Kantong",
                        `Kantong dihapus: ${walletToDel?.name}`,
                        "Trash2",
                        "bg-rose-500",
                    );
                },
                onError: (errors) => {
                    showToast("Gagal menghapus kantong", "error");
                },
            });
        }
    };

    const handleAddWallet = (e) => {
        e.preventDefault();
        if (!newWallet.name) {
            showToast("Nama kantong wajib diisi", "error");
            return;
        }

        const payload = {
            name: newWallet.name,
            type: newWallet.type,
            color: newWallet.color,
            icon: newWallet.icon,
            is_utama: newWallet.is_utama ? 1 : 0,
        };

        if (newWallet.id && !newWallet.id.toString().startsWith("w_")) {
            router.put(`/wallets/${newWallet.id}`, payload, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowAddWalletModal(false);
                    showToast("Kantong berhasil diperbarui");
                },
                onError: (errors) => {
                    showToast("Gagal memperbarui kantong", "error");
                },
            });
        } else if (newWallet.id && newWallet.id.toString().startsWith("w_")) {
            setWallets(
                wallets.map((w) =>
                    w.id === newWallet.id
                        ? { ...w, ...payload, isUtama: !!payload.is_utama }
                        : w,
                ),
            );
            setShowAddWalletModal(false);
            showToast("Kantong berhasil diperbarui");
        } else {
            router.post("/wallets", payload, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowAddWalletModal(false);
                    showToast("Kantong baru berhasil didaftarkan");
                },
                onError: (errors) => {
                    showToast("Gagal menambahkan kantong", "error");
                },
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
            router.put(
                route("users.update", newMember.id),
                {
                    name: newMember.name,
                    role: newMember.role,
                    permissions: newMember.permissions,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowAddMemberModal(false);
                        showToast("Data anggota berhasil diperbarui");
                        logActivity(
                            "Update Anggota",
                            `Memperbarui data anggota: ${newMember.name}`,
                            "User",
                            "bg-amber-500",
                        );
                        setNewMember({
                            id: null,
                            name: "",
                            role: "Anggota",
                            permissions: [...ROLE_PERMISSIONS["Anggota"]],
                        });
                    },
                    onError: () =>
                        showToast("Gagal memperbarui data anggota", "error"),
                },
            );
        } else {
            // Create new member
            const colors = [
                "bg-purple-500",
                "bg-teal-500",
                "bg-indigo-500",
                "bg-amber-500",
                "bg-sky-500",
            ];
            const randomColor =
                colors[Math.floor(Math.random() * colors.length)];
            const generatedEmail = `${newMember.name.toLowerCase().replace(/\s+/g, "")}${Math.floor(Math.random() * 1000)}@Fikrikeluarga.com`;

            router.post(
                route("users.store"),
                {
                    name: newMember.name,
                    email: generatedEmail,
                    password: "password123", // Default password
                    role: newMember.role,
                    avatarColor: randomColor,
                    permissions: newMember.permissions,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowAddMemberModal(false);
                        showToast("Anggota keluarga baru berhasil didaftarkan");
                        logActivity(
                            "Tambah Anggota",
                            `Mendaftarkan anggota baru: ${newMember.name}`,
                            "UserPlus",
                            "bg-emerald-500",
                        );
                        setNewMember({
                            id: null,
                            name: "",
                            role: "Anggota",
                            permissions: [...ROLE_PERMISSIONS["Anggota"]],
                        });
                    },
                    onError: () =>
                        showToast("Gagal mendaftarkan anggota", "error"),
                },
            );
        }
    };

    const handleDeleteMember = (id) => {
        if (window.confirm("Yakin ingin menghapus anggota ini?")) {
            const memberToDel = members.find((m) => m.id === id);
            router.delete(route("users.destroy", id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    showToast("Anggota berhasil dihapus", "info");
                    logActivity(
                        "Hapus Anggota",
                        `Menghapus anggota: ${memberToDel?.name}`,
                        "UserMinus",
                        "bg-rose-500",
                    );
                },
                onError: () => showToast("Gagal menghapus anggota", "error"),
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
        const memberToUpdate = members.find((m) => m.id === memberId);
        if (!memberToUpdate) return;

        const perms = memberToUpdate.permissions || [];
        const has = perms.includes(permKey);
        const newPerms = has
            ? perms.filter((p) => p !== permKey)
            : [...perms, permKey];

        // Optimistic UI update
        setMembers((prev) =>
            prev.map((m) =>
                m.id === memberId ? { ...m, permissions: newPerms } : m,
            ),
        );

        router.put(
            route("users.update", memberId),
            {
                name: memberToUpdate.name,
                role: memberToUpdate.role,
                permissions: newPerms,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => showToast("Hak akses berhasil diperbarui"),
                onError: () => {
                    showToast("Gagal memperbarui hak akses", "error");
                    // Revert optimistic update
                    setMembers((prev) =>
                        prev.map((m) =>
                            m.id === memberId
                                ? { ...m, permissions: perms }
                                : m,
                        ),
                    );
                },
            },
        );
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
        const csvContent =
            "Tanggal,Deskripsi,Nominal,Kategori,Dompet,Anggota Keluarga\n" +
            "2026-07-08,Belanja Dapur Harian,150000,Kebutuhan Dapur,Mandiri Ibu,Ibu\n" +
            "2026-07-08,Isi Bensin Motor,50000,Bensin,BCA Ayah,Ayah (Admin)\n" +
            "2026-07-08,Kopi Sore KRL,35000,Ngopi,Uang Tunai,Kakak";
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
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
        let delimiter = ",";
        const firstLine = text.split(/\r?\n/)[0] || "";
        if (firstLine.includes(";")) {
            delimiter = ";";
        }

        const lines = [];
        let currentLine = [];
        let currentToken = "";
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') {
                if (inQuotes && text[i + 1] === '"') {
                    currentToken += '"';
                    i++; // skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                currentLine.push(currentToken.trim());
                currentToken = "";
            } else if ((char === "\n" || char === "\r") && !inQuotes) {
                if (char === "\r" && text[i + 1] === "\n") {
                    i++;
                }
                currentLine.push(currentToken.trim());
                lines.push(currentLine);
                currentLine = [];
                currentToken = "";
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
            if (row.length < 3 || (row.length === 1 && row[0] === "")) continue;

            results.push({
                date: row[0] || "",
                description: row[1] || "",
                amount: parseFloat(row[2]) || 0,
                categoryName: row[3] || "",
                walletName: row[4] || "",
                memberName: row[5] || "",
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
                        showToast(
                            "File CSV kosong atau format tidak sesuai",
                            "error",
                        );
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
        setImportedData((prev) =>
            prev.map((item, idx) => {
                if (idx === index) {
                    return { ...item, [field]: value };
                }
                return item;
            }),
        );
    };

    const handleDeleteImportRow = (index) => {
        setImportedData((prev) => prev.filter((_, idx) => idx !== index));
    };

    // Filtered data based on search query in import preview
    const filteredImportedData = useMemo(() => {
        return importedData
            .map((item, idx) => ({ ...item, originalIndex: idx }))
            .filter((item) => {
                const query = importSearchQuery.toLowerCase();
                return (
                    (item.description || "").toLowerCase().includes(query) ||
                    (item.categoryName || "").toLowerCase().includes(query) ||
                    (item.walletName || "").toLowerCase().includes(query) ||
                    (item.memberName || "").toLowerCase().includes(query) ||
                    (item.date || "").includes(query)
                );
            });
    }, [importedData, importSearchQuery]);

    // Paginated data in import preview
    const paginatedImportedData = useMemo(() => {
        const startIndex = (importCurrentPage - 1) * importItemsPerPage;
        return filteredImportedData.slice(
            startIndex,
            startIndex + importItemsPerPage,
        );
    }, [filteredImportedData, importCurrentPage, importItemsPerPage]);

    const totalImportPages = useMemo(() => {
        return Math.max(
            1,
            Math.ceil(filteredImportedData.length / importItemsPerPage),
        );
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

            const transactionsToPost = importedData.map((row) => {
                const rowCatName = row.categoryName || "";
                const rowWalletName = row.walletName || "";
                const rowMemberName = row.memberName || "";

                const cat =
                    categories.find(
                        (c) =>
                            c.name &&
                            c.name.toLowerCase() === rowCatName.toLowerCase(),
                    ) || categories.find((c) => c.name === "Lainnya");

                const wal = wallets.find(
                    (w) =>
                        w.name &&
                        w.name.toLowerCase() === rowWalletName.toLowerCase(),
                );

                const mem =
                    members.find(
                        (m) =>
                            m.name &&
                            m.name.toLowerCase() ===
                                rowMemberName.toLowerCase(),
                    ) || currentUser;

                return {
                    date: row.date,
                    description: row.description,
                    amount: row.amount,
                    type: "expense",
                    category_id: cat ? cat.id : null,
                    wallet_id: wal ? wal.id : null,
                    user_id: mem ? mem.id : currentUser ? currentUser.id : null,
                };
            });

            if (transactionsToPost.some((t) => !t.wallet_id)) {
                showToast(
                    "Gagal: Beberapa baris data tidak memiliki Dompet yang cocok.",
                    "error",
                );
                setIsImporting(false);
                return;
            }

            axios
                .post("/transactions", { transactions: transactionsToPost })
                .then((res) => {
                    showToast(
                        "Berhasil mengimpor " +
                            transactionsToPost.length +
                            " transaksi pengeluaran.",
                    );
                    setImportedData([]);
                    setImportFileName("");
                    setIsAddingTx(false);
                    setActiveTab("pencatatan");

                    router.reload({
                        preserveState: true,
                        onSuccess: () => {
                            axios.get(
                                "/api/dashboard/metrics?force_recalculate=true",
                            );
                        },
                    });
                })
                .catch((err) => {
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
                    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-[9999] animate-bounce">
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
                            <p className="text-sm font-semibold">
                                {toast.message}
                            </p>
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
                        {usePinLogin && trustedDevice ? (
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">
                                    Masuk dengan PIN
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Gunakan PIN Keamanan 6 digit untuk mengakses akun Anda pada perangkat ini ({trustedDevice.device_name}).
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">
                                    Selamat Datang
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Silakan masuk untuk mengelola keuangan keluarga Anda hari ini.
                                </p>
                            </div>
                        )}

                        {usePinLogin && trustedDevice ? (
                            <form onSubmit={handlePinLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase text-center">
                                        Masukkan PIN Keamanan
                                    </label>
                                    <div className="flex justify-center">
                                        <input
                                            type="password"
                                            maxLength={6}
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                            className="w-48 text-center py-3 text-2xl font-bold tracking-[0.75em] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
                                            placeholder="••••••"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    {pinError && (
                                        <p className="text-xs text-rose-600 text-center font-semibold mt-1">
                                            {pinError}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 flex items-center justify-center space-x-1"
                                >
                                    <span>Masuk</span>
                                </button>

                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setUsePinLogin(false)}
                                        className="text-xs text-blue-600 hover:underline font-semibold"
                                    >
                                        Masuk dengan Email & Password
                                    </button>
                                </div>
                            </form>
                        ) : (
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
                                            type={
                                                showPassword ? "text" : "password"
                                            }
                                            placeholder="••••••••"
                                            value={loginPassword}
                                            onChange={(e) =>
                                                setLoginPassword(e.target.value)
                                            }
                                            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            title={
                                                showPassword
                                                    ? "Sembunyikan Sandi"
                                                    : "Lihat Sandi"
                                            }
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
                        )}
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
                        {activeTab !== "profile" && (
                            <p className="text-[10px] md:text-xs font-bold text-slate-400 mt-1 flex items-center gap-1.5 animate-fadeIn">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Penyaringan: {[
                                    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                                    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                                ][selectedMonth - 1]}
                                {selectedMonth !== selectedEndMonth && (
                                    <> - {[
                                        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                                        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                                    ][selectedEndMonth - 1]}
                                    </>
                                )}{" "}{selectedYear}
                            </p>
                        )}
                    </div>

                    {/* KANAN: Hanya Icon Tanpa Card (Kalender, Notifikasi, Profile) */}
                    <div className="flex items-center space-x-1 md:space-x-2">
                        {/* 1. Calendar Icon (Custom Dropdown - Month Range Picker) */}
                        <div className="relative">
                            <MonthRangePicker
                                value={{
                                    startMonth: selectedMonth,
                                    endMonth: selectedEndMonth,
                                    year: selectedYear,
                                }}
                                onChange={(val) => {
                                    setSelectedMonth(val.startMonth);
                                    setSelectedEndMonth(val.endMonth);
                                    setSelectedYear(val.year);
                                }}
                            />
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
                <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-[9999] animate-bounce">
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
                        (hasPermission("kelola_dompet") ||
                            hasPermission("lihat_dompet")) && {
                            id: "dompet",
                            label: "Kantong",
                            icon: Wallet,
                        },
                        hasPermission("atur_budget") && {
                            id: "budgeting",
                            label: "Budgeting",
                            icon: PieChart,
                        },
                        hasPermission("ekspor_data") && {
                            id: "import",
                            label: "Import Data",
                            icon: Upload,
                        },
                        {
                            id: "sampah",
                            label: "Sampah",
                            icon: Trash2,
                        },
                        {
                            id: "profile",
                            label: (
                                <div className="flex items-center gap-1.5">
                                    <span>
                                        {currentUser?.name || "Profile"}
                                    </span>
                                    <BadgeCheck className="w-4 h-4 text-white fill-blue-500 flex-shrink-0" />
                                </div>
                            ),
                            icon: "PROFILE_PHOTO",
                            action: () => {
                                setActiveTab("profile");
                                setActiveSettingsTab("profile");
                            },
                        },
                    ]
                        .filter(Boolean)
                        .map((item) => {
                            const IconComponent = item.icon;
                            let isSelected = activeTab === item.id;
                            if (item.id === "profile") {
                                isSelected = activeTab === "profile";
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
                                            <img
                                                src={`/storage/${currentUser.avatar}`}
                                                alt="Avatar"
                                                className={`w-6 h-6 rounded-full object-cover border ${isSelected ? "border-white" : "border-transparent"}`}
                                            />
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
                    {activeTab === "dashboard" && (
                        <ExecutiveDashboard
                            categories={categories}
                            transactions={transactions}
                            currentUser={currentUser}
                        />
                    )}

                    {/* TAB 2: CATAT PENGELUARAN HARIAN */}
                    {activeTab === "pencatatan" && (
                        <PencatatanTab
                            categories={categories}
                            wallets={wallets}
                            members={members}
                            currentUser={currentUser}
                            bulkTransactions={bulkTransactions}
                            setBulkTransactions={setBulkTransactions}
                            onSaveBulkTransactions={handleSaveBulkTransactions}
                            onCancel={() => {
                                setActiveTab("dompet");
                                setIsAddingTx(false);
                                setBulkTransactions([]);
                            }}
                        />
                    )}

                    {/* TAB: BUDGETING */}
                    {activeTab === "budgeting" && (
                        <BudgetingTab
                            categories={categories}
                            transactions={transactions}
                            wallets={wallets}
                            budgetStartDate={budgetStartDate}
                            budgetEndDate={budgetEndDate}
                            formatIDR={formatIDR}
                            showToast={showToast}
                            setActiveTab={setActiveTab}
                            handleStartAddTransaction={
                                handleStartAddTransaction
                            }
                            currentUser={currentUser}
                        />
                    )}

                    {/* TAB 4: DOMPET & AKUN */}
                    {activeTab === "dompet" && (
                        <DompetTab
                            wallets={wallets}
                            transactions={transactions}
                            categories={categories}
                            members={members}
                            currentUser={currentUser}
                            hasPermission={hasPermission}
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                            onOpenAddWallet={() => {
                                setNewWallet({
                                    name: "",
                                    type: "Tunai",
                                    color: "bg-blue-600",
                                    icon: "Wallet",
                                    is_utama: false,
                                });
                                setShowAddWalletModal(true);
                            }}
                            onOpenEditWallet={(w) => {
                                setNewWallet({
                                    id: w.id,
                                    name: w.name,
                                    type: w.type,
                                    color: w.color,
                                    icon: w.icon,
                                    is_utama: !!w.isUtama,
                                });
                                setShowAddWalletModal(true);
                            }}
                            onDeleteWallet={handleDeleteWallet}
                            onOpenTopUp={(w) => {
                                setTopUpData({
                                    walletId: w.id,
                                    sourceWalletId: wallets.find((sw) => sw.isUtama)?.id || "",
                                    amount: "",
                                });
                                setShowTopUpModal(true);
                            }}
                            onOpenEditTransaction={handleOpenEdit}
                            onDeleteTransaction={handleDeleteTransaction}
                        />
                    )}

                    {/* TAB: PROFILE */}
                    {activeTab === "sampah" && (
                        <SampahTab
                            trashTransactions={trashTransactions}
                            trashCategories={trashCategories}
                            trashWallets={trashWallets}
                            onRestoreItem={handleRestoreItem}
                            onForceDeleteItem={handleForceDeleteItem}
                        />
                    )}

                    {activeTab === "profile" && (
                        <ProfileTab
                            currentUser={currentUser}
                            hasPermission={hasPermission}
                            activeSettingsTab={activeSettingsTab}
                            setActiveSettingsTab={setActiveSettingsTab}
                            wallets={wallets}
                            members={members}
                            profileData={profileData}
                            setProfileData={setProfileData}
                            profileErrors={profileErrors}
                            processingProfile={processingProfile}
                            submitProfileUpdate={submitProfileUpdate}
                            pinMessage={pinMessage}
                            currentPasswordForPin={currentPasswordForPin}
                            setCurrentPasswordForPin={setCurrentPasswordForPin}
                            newPinCode={newPinCode}
                            setNewPinCode={setNewPinCode}
                            confirmNewPinCode={confirmNewPinCode}
                            setConfirmNewPinCode={setConfirmNewPinCode}
                            isPinProcessing={isPinProcessing}
                            handleResetPin={handleResetPin}
                            trustedDevices={trustedDevices}
                            isLoadingDevices={isLoadingDevices}
                            handleRemoveAllDevices={handleRemoveAllDevices}
                            renameDeviceId={renameDeviceId}
                            setRenameDeviceId={setRenameDeviceId}
                            renameDeviceName={renameDeviceName}
                            setRenameDeviceName={setRenameDeviceName}
                            handleRenameDevice={handleRenameDevice}
                            handleRemoveDevice={handleRemoveDevice}
                            pwdData={pwdData}
                            setPwdData={setPwdData}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            pwdErrors={pwdErrors}
                            processingPwd={processingPwd}
                            submitPasswordUpdate={submitPasswordUpdate}
                            generatePassword={generatePassword}
                            activeSessions={activeSessions}
                            ROLE_PERMISSIONS={ROLE_PERMISSIONS}
                            setNewMember={setNewMember}
                            setShowAddMemberModal={setShowAddMemberModal}
                            setSelectedMemberForDetail={setSelectedMemberForDetail}
                            handleDeleteMember={handleDeleteMember}
                            selectedMemberForDetail={selectedMemberForDetail}
                            setIsResetModalOpen={setIsResetModalOpen}
                            setActiveTab={setActiveTab}
                            AVAILABLE_PERMISSIONS={AVAILABLE_PERMISSIONS}
                            handleNewMemberRoleChange={handleNewMemberRoleChange}
                            handleTogglePermission={handleTogglePermission}
                            newMember={newMember}
                            showAddMemberModal={showAddMemberModal}
                            handleAddMember={handleAddMember}
                            logsPerPage={logsPerPage}
                            setLogsPerPage={setLogsPerPage}
                            logsFrom={logsFrom}
                            logsTo={logsTo}
                            logsTotal={logsTotal}
                            logsPage={logsPage}
                            logsLastPage={logsLastPage}
                            fetchLogs={fetchLogs}
                            isLoadingLogs={isLoadingLogs}
                            activityLogs={activityLogs}
                            handleLogout={handleLogout}
                        />
                    )}
                    {/* TAB 7: IMPORT DATA */}
                    {activeTab === "import" && (
                        <ImportTab
                            categories={categories}
                            wallets={wallets}
                            members={members}
                            currentUser={currentUser}
                            downloadTemplate={downloadTemplate}
                            handleFileChange={handleFileChange}
                            importFileName={importFileName}
                            setImportFileName={setImportFileName}
                            setSelectedFile={setSelectedFile}
                            importedData={importedData}
                            setImportedData={setImportedData}
                            isImporting={isImporting}
                            handleImportSubmit={handleImportSubmit}
                        />
                    )}

                    {/* Modal Reset Data Transaksi */}
                    {isResetModalOpen &&
                        createPortal(
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto w-full h-full min-h-screen">
                                <div
                                    className="fixed inset-0 w-full h-full bg-slate-900/60 backdrop-blur-md transition-opacity"
                                    onClick={() => {
                                        setIsResetModalOpen(false);
                                        setSelectedResetMonths([]);
                                    }}
                                />
                                <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp z-10 border border-slate-100/50 max-h-[90vh] overflow-y-auto">
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
                                                    Bersihkan data transaksi
                                                    pada bulan tertentu
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
                                                Tindakan ini akan menghapus
                                                semua transaksi pengeluaran &
                                                pemasukan secara permanen pada
                                                bulan yang dipilih. Jika memilih
                                                Semua Role, seluruh data
                                                kategori & kantong juga akan
                                                dikembalikan ke data bawaan.
                                                Akun pengguna dan hak akses
                                                tetap aman.
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
                                                    if (
                                                        selectedResetMonths.length ===
                                                        availableTransactionMonths.length
                                                    ) {
                                                        setSelectedResetMonths(
                                                            [],
                                                        );
                                                    } else {
                                                        setSelectedResetMonths([
                                                            ...availableTransactionMonths,
                                                        ]);
                                                    }
                                                }}
                                                className="text-xs text-blue-600 hover:underline font-bold"
                                            >
                                                {selectedResetMonths.length ===
                                                availableTransactionMonths.length
                                                    ? "Batal Pilih Semua"
                                                    : "Pilih Semua"}
                                            </button>
                                        </div>

                                        <div className="border border-slate-150 rounded-2xl divide-y divide-slate-100 max-h-48 overflow-y-auto bg-slate-50/30">
                                            {availableTransactionMonths.length ===
                                            0 ? (
                                                <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                                    Tidak ada data transaksi
                                                    yang tersedia untuk direset.
                                                </div>
                                            ) : (
                                                availableTransactionMonths.map(
                                                    (monthStr) => {
                                                        const isChecked =
                                                            selectedResetMonths.includes(
                                                                monthStr,
                                                            );
                                                        return (
                                                            <label
                                                                key={monthStr}
                                                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                                                            >
                                                                <span className="text-xs font-bold text-slate-700">
                                                                    {formatMonthYear(
                                                                        monthStr,
                                                                    )}
                                                                </span>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        isChecked
                                                                    }
                                                                    onChange={() => {
                                                                        if (
                                                                            isChecked
                                                                        ) {
                                                                            setSelectedResetMonths(
                                                                                (
                                                                                    prev,
                                                                                ) =>
                                                                                    prev.filter(
                                                                                        (
                                                                                            m,
                                                                                        ) =>
                                                                                            m !==
                                                                                            monthStr,
                                                                                    ),
                                                                            );
                                                                        } else {
                                                                            setSelectedResetMonths(
                                                                                (
                                                                                    prev,
                                                                                ) => [
                                                                                    ...prev,
                                                                                    monthStr,
                                                                                ],
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                                                />
                                                            </label>
                                                        );
                                                    },
                                                )
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
                                            onChange={(e) =>
                                                setSelectedResetRole(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                        >
                                            <option value="all">
                                                Semua Role
                                            </option>
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
                                            disabled={
                                                selectedResetMonths.length ===
                                                    0 || isResetting
                                            }
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
                                                    Reset Data (
                                                    {selectedResetMonths.length}{" "}
                                                    Bulan)
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>,
                            document.body,
                        )}
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
                    {(hasPermission("kelola_dompet") ||
                        hasPermission("lihat_dompet")) && (
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
                            <img
                                src={`/storage/${currentUser.avatar}`}
                                alt="Avatar"
                                className={`w-7 h-7 rounded-full object-cover border-2 ${activeTab === "profile" ? "border-blue-500 shadow-md shadow-blue-200" : "border-transparent"}`}
                            />
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
            <WalletFormModal
                isOpen={showAddWalletModal}
                onClose={() => setShowAddWalletModal(false)}
                newWallet={newWallet}
                setNewWallet={setNewWallet}
                onSubmit={handleAddWallet}
            />

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
            <EditTransactionModal
                isOpen={!!editingTx}
                onClose={() => setEditingTx(null)}
                onSubmit={handleSaveEditTransaction}
                editingTx={editingTx}
                setEditingTx={setEditingTx}
                categories={categories}
                wallets={wallets}
            />
            {/* MODAL TOP UP KANTONG */}
            <TopUpModal
                isOpen={showTopUpModal}
                onClose={() => setShowTopUpModal(false)}
                topUpData={topUpData}
                setTopUpData={setTopUpData}
                onSubmit={handleTopUpSubmit}
                wallets={wallets}
                currentUser={currentUser}
                formatIDR={formatIDR}
            />

            {/* MODAL PEMINDAHAN UANG UNIVERSAL */}
            <TransferModal
                isOpen={showTransferModal}
                onClose={() => setShowTransferModal(false)}
                transferData={transferData}
                setTransferData={setTransferData}
                onSubmit={handleTransferSubmit}
                wallets={wallets}
                members={members}
                currentUser={currentUser}
                formatIDR={formatIDR}
            />
        </div>
    );
}

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Tag, 
  PlusCircle, 
  Wallet, 
  Download, 
  Users, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  User, 
  Check, 
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
  ChevronDown
} from 'lucide-react';
import ExecutiveDashboard from '../Components/ExecutiveDashboard';

const AVAILABLE_PERMISSIONS = [
  { key: 'catat_transaksi', label: 'Catat Transaksi', desc: 'Dapat mencatat pengeluaran & pemasukan harian' },
  { key: 'lihat_laporan', label: 'Lihat Laporan', desc: 'Melihat ringkasan & riwayat transaksi' },
  { key: 'kelola_dompet', label: 'Kelola Dompet', desc: 'Menambah & mengatur dompet/rekening' },
  { key: 'kelola_kategori', label: 'Kelola Kategori', desc: 'Menambah & mengedit kategori pengeluaran' },
  { key: 'atur_budget', label: 'Atur Budget', desc: 'Mengatur anggaran bulanan per kategori' },
  { key: 'kelola_anggota', label: 'Kelola Anggota', desc: 'Menambah & mengelola anggota keluarga' },
  { key: 'ekspor_data', label: 'Ekspor Data', desc: 'Mengunduh laporan dalam format CSV' },
];

const ROLE_PERMISSIONS = {
  'Administrator': ['catat_transaksi', 'lihat_laporan', 'kelola_dompet', 'kelola_kategori', 'atur_budget', 'kelola_anggota', 'ekspor_data'],
  'Bendahara': ['catat_transaksi', 'lihat_laporan', 'kelola_dompet', 'kelola_kategori', 'atur_budget', 'ekspor_data'],
  'Anggota': ['catat_transaksi', 'lihat_laporan'],
};

const INITIAL_MEMBERS = [
  { id: 'm1', name: 'Ayah (Budi)', role: 'Administrator', avatarColor: 'bg-blue-500', email: 'budi@finkeluarga.com', permissions: ROLE_PERMISSIONS['Administrator'] },
  { id: 'm2', name: 'Ibu (Siti)', role: 'Bendahara', avatarColor: 'bg-pink-500', email: 'siti@finkeluarga.com', permissions: ROLE_PERMISSIONS['Bendahara'] },
  { id: 'm3', name: 'Kakak (Rian)', role: 'Anggota', avatarColor: 'bg-emerald-500', email: 'rian@finkeluarga.com', permissions: ROLE_PERMISSIONS['Anggota'] }
];

const INITIAL_CATEGORIES = [
  { id: 'c1', name: 'Makanan & Minuman', icon: 'Utensils', color: 'bg-orange-500', budget: 3000000 },
  { id: 'c2', name: 'Transportasi', icon: 'Car', color: 'bg-blue-500', budget: 1500000 },
  { id: 'c3', name: 'Tagihan & Utilitas', icon: 'FileText', color: 'bg-red-500', budget: 2500000 },
  { id: 'c4', name: 'Hiburan', icon: 'Tv', color: 'bg-purple-500', budget: 1000000 },
  { id: 'c5', name: 'Kesehatan', icon: 'HeartPulse', color: 'bg-green-500', budget: 1000000 },
  { id: 'c6', name: 'Lain-lain', icon: 'Grid', color: 'bg-slate-500', budget: 500000 }
];

const INITIAL_WALLETS = [
  { id: 'w1', name: 'Rekening Utama (BCA)', balance: 8500000, type: 'Bank' },
  { id: 'w2', name: 'Dompet Tunai Ibu', balance: 1200000, type: 'Tunai' },
  { id: 'w3', name: 'Dana Darurat (Mandiri)', balance: 5000000, type: 'Investasi' }
];

const INITIAL_TRANSACTIONS = [
  { id: 't1', date: '2026-07-01', description: 'Belanja Bulanan Carrefour', amount: 1200000, type: 'expense', categoryId: 'c1', walletId: 'w1', memberId: 'm2' },
  { id: 't2', date: '2026-07-02', description: 'Isi Bensin Mobil', amount: 350000, type: 'expense', categoryId: 'c2', walletId: 'w1', memberId: 'm1' },
  { id: 't3', date: '2026-07-03', description: 'Pembayaran Listrik & Wifi', amount: 850000, type: 'expense', categoryId: 'c3', walletId: 'w1', memberId: 'm1' },
  { id: 't4', date: '2026-07-04', description: 'Tiket Bioskop & Snack', amount: 250000, type: 'expense', categoryId: 'c4', walletId: 'w2', memberId: 'm3' },
  { id: 't5', date: '2026-07-05', description: 'Pemasukan Gaji Bulanan', amount: 15000000, type: 'income', categoryId: 'c6', walletId: 'w1', memberId: 'm1' },
  { id: 't6', date: '2026-07-05', description: 'Beli Obat Apotek', amount: 150000, type: 'expense', categoryId: 'c5', walletId: 'w2', memberId: 'm2' }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSettingsTab, setActiveSettingsTab] = useState('kategori');
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [wallets, setWallets] = useState(INITIAL_WALLETS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [isAddingTx, setIsAddingTx] = useState(false);
  const [bulkTransactions, setBulkTransactions] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMember, setFilterMember] = useState('all');
  const [filterWallet, setFilterWallet] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const [editingTx, setEditingTx] = useState(null);

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    description: true,
    category: true,
    member: true,
    wallet: true,
    amount: true,
    action: true
  });

  const [newCat, setNewCat] = useState({ name: '', budget: '' });
  const [newWallet, setNewWallet] = useState({ name: '', balance: '', type: 'Bank' });
  const [newMember, setNewMember] = useState({ name: '', role: 'Anggota', permissions: [...ROLE_PERMISSIONS['Anggota']] });
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  
  const [budgetStartDate, setBudgetStartDate] = useState('');
  const [budgetEndDate, setBudgetEndDate] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStartDate, filterEndDate, filterCategory, filterMember, filterWallet, itemsPerPage]);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
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
    categories.forEach(c => { map[c.id] = 0; });
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (map[t.categoryId] !== undefined) {
          map[t.categoryId] += t.amount;
        }
      });
    return map;
  }, [transactions, categories]);

  const expenseByMember = useMemo(() => {
    const map = {};
    members.forEach(m => { map[m.id] = 0; });
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (map[t.memberId] !== undefined) {
          map[t.memberId] += t.amount;
        }
      });
    return map;
  }, [transactions, members]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesDate = true;
      if (filterStartDate) {
        matchesDate = matchesDate && tx.date >= filterStartDate;
      }
      if (filterEndDate) {
        matchesDate = matchesDate && tx.date <= filterEndDate;
      }

      const matchesCategory = filterCategory === 'all' || tx.categoryId === filterCategory;
      const matchesMember = filterMember === 'all' || tx.memberId === filterMember;
      const matchesWallet = filterWallet === 'all' || tx.walletId === filterWallet;
      
      return matchesSearch && matchesDate && matchesCategory && matchesMember && matchesWallet;
    });
  }, [transactions, searchQuery, filterStartDate, filterEndDate, filterCategory, filterMember, filterWallet]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  }, [filteredTransactions, itemsPerPage]);

  const handleCredentialLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Harap isi email dan kata sandi Anda.', 'error');
      return;
    }

    // Cari kecocokan di mock data email
    const foundMember = members.find(m => m.email.toLowerCase() === loginEmail.toLowerCase().trim());
    if (foundMember && loginPassword === '123456') { // Password default simulasi
      setCurrentUser(foundMember);
      setIsLoggedIn(true);
      showToast(`Selamat datang kembali, ${foundMember.name}!`);
    } else if (foundMember) {
      showToast('Kata sandi salah. Gunakan sandi simulasi "123456"', 'error');
    } else {
      // Jika login baru
      const newSimulatedUser = {
        id: 'm_' + Date.now(),
        name: loginEmail.split('@')[0],
        role: 'Anggota',
        avatarColor: 'bg-blue-600',
        email: loginEmail
      };
      setMembers([...members, newSimulatedUser]);
      setCurrentUser(newSimulatedUser);
      setIsLoggedIn(true);
      showToast(`Sesi baru dibuat untuk ${loginEmail}`);
    }
  };

  const handleQuickLogin = (member) => {
    setCurrentUser(member);
    setIsLoggedIn(true);
    showToast(`Berhasil masuk sebagai ${member.name}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    showToast('Anda telah keluar dari aplikasi', 'info');
  };

  const handleStartAddTransaction = () => {
    setBulkTransactions([
      {
        id: 'bulk_' + Date.now() + '_0',
        description: '',
        amount: '',
        type: 'expense',
        categoryId: categories[0]?.id || 'c1',
        walletId: wallets[0]?.id || 'w1',
        memberId: currentUser?.id || members[0]?.id || 'm1',
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    setIsAddingTx(true);
  };

  const handleAddBulkRow = () => {
    setBulkTransactions([
      ...bulkTransactions,
      {
        id: 'bulk_' + Date.now() + '_' + bulkTransactions.length,
        description: '',
        amount: '',
        type: 'expense',
        categoryId: categories[0]?.id || 'c1',
        walletId: wallets[0]?.id || 'w1',
        memberId: currentUser?.id || members[0]?.id || 'm1',
        date: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const handleRemoveBulkRow = (index) => {
    if (bulkTransactions.length === 1) {
      showToast('Minimal harus terdapat satu baris transaksi untuk dikirim.', 'error');
      return;
    }
    setBulkTransactions(bulkTransactions.filter((_, i) => i !== index));
  };

  const handleUpdateBulkField = (index, field, value) => {
    const updated = [...bulkTransactions];
    updated[index][field] = value;
    setBulkTransactions(updated);
  };

  const handleSaveBulkTransactions = (e) => {
    e.preventDefault();

    for (let i = 0; i < bulkTransactions.length; i++) {
      const tx = bulkTransactions[i];
      if (!tx.description.trim()) {
        showToast(`Deskripsi pada transaksi ke-${i + 1} tidak boleh kosong.`, 'error');
        return;
      }
      const amountNum = parseFloat(tx.amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        showToast(`Nominal pada transaksi ke-${i + 1} harus berupa angka valid di atas 0.`, 'error');
        return;
      }
    }

    const finalTransactions = bulkTransactions.map((tx, i) => ({
      id: 't_' + Date.now() + '_' + i,
      description: tx.description.trim(),
      amount: parseFloat(tx.amount),
      type: tx.type,
      categoryId: tx.categoryId,
      walletId: tx.walletId,
      memberId: tx.memberId,
      date: tx.date
    }));

    setWallets(prevWallets => {
      let updatedWallets = [...prevWallets];
      finalTransactions.forEach(tx => {
        updatedWallets = updatedWallets.map(w => {
          if (w.id === tx.walletId) {
            const balanceChange = tx.type === 'income' ? tx.amount : -tx.amount;
            return {
              ...w,
              balance: w.balance + balanceChange
            };
          }
          return w;
        });
      });
      return updatedWallets;
    });

    setTransactions(prev => [...finalTransactions, ...prev]);
    setIsAddingTx(false);
    setBulkTransactions([]);
    showToast(`${finalTransactions.length} Transaksi berhasil ditambahkan.`);
  };

  const handleOpenEdit = (tx) => {
    setEditingTx({ ...tx });
  };

  const handleSaveEditTransaction = (e) => {
    e.preventDefault();
    if (!editingTx.description.trim() || !editingTx.amount) {
      showToast('Semua kolom data transaksi wajib diisi.', 'error');
      return;
    }

    const amountNum = parseFloat(editingTx.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Nominal transaksi harus bernilai lebih dari 0.', 'error');
      return;
    }

    const originalTx = transactions.find(t => t.id === editingTx.id);
    if (!originalTx) return;

    setWallets(prevWallets => {
      let updated = [...prevWallets];

      updated = updated.map(w => {
        if (w.id === originalTx.walletId) {
          const reverseAmount = originalTx.type === 'income' ? -originalTx.amount : originalTx.amount;
          return { ...w, balance: w.balance + reverseAmount };
        }
        return w;
      });

      updated = updated.map(w => {
        if (w.id === editingTx.walletId) {
          const applyAmount = editingTx.type === 'income' ? amountNum : -amountNum;
          return { ...w, balance: w.balance + applyAmount };
        }
        return w;
      });

      return updated;
    });

    setTransactions(prev => prev.map(t => t.id === editingTx.id ? { ...editingTx, amount: amountNum } : t));
    setEditingTx(null);
    showToast('Transaksi berhasil diperbarui.');
  };

  const handleDeleteTransaction = (id, type, amount, walletId) => {
    setTransactions(transactions.filter(t => t.id !== id));
    
    setWallets(prevWallets => 
      prevWallets.map(w => {
        if (w.id === walletId) {
          return {
            ...w,
            balance: type === 'income' ? w.balance - amount : w.balance + amount
          };
        }
        return w;
      })
    );

    showToast('Transaksi berhasil dihapus', 'info');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCat.name || !newCat.budget) {
      showToast('Nama kategori dan anggaran wajib diisi', 'error');
      return;
    }

    const createdCat = {
      id: 'c_' + Date.now(),
      name: newCat.name,
      budget: parseFloat(newCat.budget),
      icon: 'Grid',
      color: 'bg-blue-500'
    };

    setCategories([...categories, createdCat]);
    setNewCat({ name: '', budget: '' });
    showToast('Kategori baru berhasil dibuat');
  };

  const handleAddWallet = (e) => {
    e.preventDefault();
    if (!newWallet.name || !newWallet.balance) {
      showToast('Nama dompet dan saldo awal wajib diisi', 'error');
      return;
    }

    const createdWallet = {
      id: 'w_' + Date.now(),
      name: newWallet.name,
      balance: parseFloat(newWallet.balance),
      type: newWallet.type
    };

    setWallets([...wallets, createdWallet]);
    setNewWallet({ name: '', balance: '', type: 'Bank' });
    showToast('Dompet/Rekening baru berhasil didaftarkan');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name) {
      showToast('Nama anggota keluarga wajib diisi', 'error');
      return;
    }

    const colors = ['bg-purple-500', 'bg-teal-500', 'bg-indigo-500', 'bg-amber-500', 'bg-sky-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const createdMember = {
      id: 'm_' + Date.now(),
      name: newMember.name,
      role: newMember.role,
      avatarColor: randomColor,
      email: `${newMember.name.toLowerCase().replace(/\s+/g, '')}@finkeluarga.com`,
      permissions: [...newMember.permissions]
    };

    setMembers([...members, createdMember]);
    setNewMember({ name: '', role: 'Anggota', permissions: [...ROLE_PERMISSIONS['Anggota']] });
    setShowAddMemberModal(false);
    showToast('Anggota keluarga baru berhasil didaftarkan');
  };

  const handleTogglePermission = (permKey) => {
    setNewMember(prev => {
      const has = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: has
          ? prev.permissions.filter(p => p !== permKey)
          : [...prev.permissions, permKey]
      };
    });
  };

  const handleToggleMemberPermission = (memberId, permKey) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      const perms = m.permissions || [];
      const has = perms.includes(permKey);
      return {
        ...m,
        permissions: has
          ? perms.filter(p => p !== permKey)
          : [...perms, permKey]
      };
    }));
    showToast('Hak akses berhasil diperbarui');
  };

  const handleNewMemberRoleChange = (role) => {
    setNewMember(prev => ({
      ...prev,
      role,
      permissions: [...(ROLE_PERMISSIONS[role] || [])]
    }));
  };

  const handleUpdateBudget = (catId, newBudget) => {
    setCategories(prev => prev.map(c => {
      if (c.id === catId) {
        return { ...c, budget: parseFloat(newBudget) || 0 };
      }
      return c;
    }));
    showToast('Anggaran bulanan diperbarui');
  };

  const handleExportCSV = () => {
    let csvContent = "Tanggal,Deskripsi,Tipe,Nominal,Kategori,Dompet,Anggota Keluarga\n";
    
    transactions.forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || 'N/A';
      const wal = wallets.find(w => w.id === t.walletId)?.name || 'N/A';
      const mem = members.find(m => m.id === t.memberId)?.name || 'N/A';
      const typeLabel = t.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
      
      csvContent += `"${t.date}","${t.description.replace(/"/g, '""')}","${typeLabel}",${t.amount},"${cat}","${wal}","${mem}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Keuangan_Keluarga_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Berkas CSV berhasil diekspor');
  };

  const toggleColumn = (colName) => {
    setVisibleColumns(prev => ({
      ...prev,
      [colName]: !prev[colName]
    }));
  };

  // JIKA BELUM LOGIN, TAMPILKAN HALAMAN LOGIN YANG ELEGAN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-blue-500 selection:text-white">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-fadeIn">
          
          {/* SISI KIRI: BRANDING & MOCKUP VISUAL */}
          <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
            
            <div className="flex items-center space-x-3 z-10">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">FinKeluarga</span>
            </div>

            <div className="space-y-4 z-10">
              <h2 className="text-3xl font-extrabold leading-tight">Wujudkan Impian Finansial Keluarga Sehat.</h2>
              <p className="text-sm text-blue-100 font-medium">Satu platform kolaboratif untuk mengelola anggaran harian, melacak tabungan, dan mengontrol pengeluaran bersama seluruh anggota keluarga.</p>
            </div>

            <div className="text-xs text-blue-200/80 z-10">
              © 2026 FinKeluarga System. All rights reserved.
            </div>
          </div>

          {/* SISI KANAN: FORM LOGIN & QUICK CHOOSE USER */}
          <div className="p-8 md:p-10 flex flex-col justify-center space-y-8">
            
            <div>
              <h3 className="text-2xl font-black text-slate-900">Selamat Datang</h3>
              <p className="text-xs text-slate-500 mt-1">Silakan masuk untuk mengelola keuangan keluarga Anda hari ini.</p>
            </div>

            {/* QUICK MEMBER ACCESS BAR */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Akses Cepat Anggota Keluarga</p>
              <div className="grid grid-cols-3 gap-2.5">
                {members.slice(0, 3).map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleQuickLogin(m)}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-center flex flex-col items-center space-y-1.5 group"
                  >
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${m.avatarColor}`}>
                      {m.name.charAt(0)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600 line-clamp-1">{m.name.split(' ')[0]}</span>
                    <span className="text-[8px] text-slate-400">{m.role}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center my-1.5">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-3 text-[10px] font-semibold text-slate-400 uppercase">Atau Gunakan Email</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* FORM CREDENTIALS LOGIN */}
            <form onSubmit={handleCredentialLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Kata Sandi</label>
                  <span className="text-[9px] text-slate-400 font-medium">Sandi simulasi: <strong>123456</strong></span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-100">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 tracking-tight leading-none">FinKeluarga</h1>
              <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Aplikasi Manajemen Keuangan</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Dynamic Sesi Aktif */}
            <div className="hidden sm:flex items-center space-x-2 text-xs bg-slate-100 py-1.5 px-3 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600 font-medium">Aktif: <strong>{currentUser?.name || 'User'}</strong> ({currentUser?.role || 'Anggota'})</span>
            </div>
            
            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Keluar Sesi"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* === NOTIFIKASI TOAST === */}
      {toast && (
        <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 animate-bounce">
          <div className={`p-4 rounded-xl shadow-lg border flex items-center space-x-3 ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {toast.type === 'success' && <Check className="w-5 h-5 text-emerald-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* === AREA KONTEN UTAMA === */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:py-8 pb-24 md:pb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* SIDEBAR NAVIGATION (DESKTOP) */}
        <aside className="hidden md:block col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Menu Utama</p>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'pencatatan', label: 'Catat Pengeluaran', icon: PlusCircle },
            { id: 'budgeting', label: 'Budgeting', icon: PieChart },
            { id: 'dompet', label: 'Dompet & Akun', icon: Wallet },
            { id: 'anggota', label: 'Anggota Keluarga', icon: Users },
            { id: 'export', label: 'Ekspor Data', icon: Download },
            { id: 'settings', label: 'Pengaturan', icon: Settings }
          ].map(item => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== 'pencatatan') {
                    setIsAddingTx(false);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  isSelected 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-2' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* CONTAINER DINAMIS SESUAI TAB AKTIF */}
        <section className="col-span-1 md:col-span-3 space-y-6">

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <ExecutiveDashboard />
          )}

          {/* TAB 2: CATAT PENGELUARAN HARIAN */}
          {activeTab === 'pencatatan' && (
            <div className="space-y-6 animate-fadeIn">
              
              {!isAddingTx ? (
                <div className="space-y-6">
                  
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Riwayat Catatan Transaksi</h3>
                      <p className="text-xs text-slate-500 mt-1">Gunakan tombol di samping untuk mencatat transaksi harian baru secara sekaligus.</p>
                    </div>
                    <button
                      onClick={handleStartAddTransaction}
                      className="px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-100 self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Transaksi Baru</span>
                    </button>
                  </div>

                  {/* KONTROL PENCARIAN, FILTER & CONFIGURATION */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-3">
                      
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Cari deskripsi transaksi..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                        />
                      </div>

                      <div className="flex gap-2 self-end w-full md:w-auto">
                        
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 flex-1 md:flex-none ${
                            showFilters 
                              ? 'bg-blue-50 border-blue-200 text-blue-600' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Filter className="w-3.5 h-3.5" />
                          <span>Penyaringan ({[filterStartDate, filterEndDate, filterCategory].filter(f => f && f !== 'all').length})</span>
                        </button>
                      </div>
                    </div>

                    {/* EXPANDABLE FILTER PANEL */}
                    {showFilters && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-150 space-y-4 animate-fadeIn">
                        
                        <div className="flex flex-col md:flex-row gap-4">
                          
                          {/* FIELD RANGE TANGGAL MODEL ELEGANT */}
                          <div className="flex-1 flex flex-col">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" />
                              <span>Periode Transaksi</span>
                            </label>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-600 shadow-sm transition-all">
                              <div className="flex-1 px-4 py-2.5 flex flex-col justify-center relative hover:bg-slate-50/50 transition-colors border-b sm:border-b-0 sm:border-r border-slate-100">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Mulai dari</span>
                                <input
                                  type="date"
                                  value={filterStartDate}
                                  onChange={(e) => setFilterStartDate(e.target.value)}
                                  className="w-full bg-transparent border-none p-0 text-sm font-semibold text-slate-700 focus:ring-0 focus:outline-none cursor-pointer"
                                />
                              </div>
                              
                              <div className="hidden sm:flex items-center justify-center px-2 bg-slate-50 self-stretch">
                                <ChevronRightIcon className="w-4 h-4 text-slate-300" />
                              </div>

                              <div className="flex-1 px-4 py-2.5 flex flex-col justify-center relative hover:bg-slate-50/50 transition-colors">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sampai dengan</span>
                                <input
                                  type="date"
                                  value={filterEndDate}
                                  onChange={(e) => setFilterEndDate(e.target.value)}
                                  className="w-full bg-transparent border-none p-0 text-sm font-semibold text-slate-700 focus:ring-0 focus:outline-none cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Filter Kategori */}
                          <div className="flex-1 flex flex-col sm:max-w-xs">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5 text-blue-600" />
                              <span>Kategori</span>
                            </label>
                            <div className="h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-600 transition-all">
                              <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full h-full px-4 py-3 sm:py-2.5 bg-transparent border-none text-sm font-semibold text-slate-700 focus:outline-none focus:ring-0 cursor-pointer"
                              >
                                <option value="all">Semua Kategori</option>
                                {categories.map(c => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setFilterStartDate('');
                              setFilterEndDate('');
                              setFilterCategory('all');
                              setSearchQuery('');
                              showToast('Semua filter berhasil disetel ulang.', 'info');
                            }}
                            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg hover:bg-rose-50 w-full sm:w-auto transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Reset Filter</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DAFTAR RIWAYAT TRANSAKSI - Card Style */}
                  <div className="space-y-4">
                    {paginatedTransactions.map(tx => {
                      const member = members.find(m => m.id === tx.memberId);
                      const cat = categories.find(c => c.id === tx.categoryId);
                      const wallet = wallets.find(w => w.id === tx.walletId);
                      
                      const iconMap = { Utensils, Car, FileText, Tv, HeartPulse, Grid };
                      const IconComponent = cat?.icon && iconMap[cat.icon] ? iconMap[cat.icon] : Grid;

                      const dateObj = new Date(tx.date);
                      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Juli', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
                      const formattedDate = `${days[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]}`;

                      return (
                        <div key={tx.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat?.color ? cat.color.replace('-500', '-100') : 'bg-slate-100'}`}>
                              <IconComponent className={`w-5 h-5 ${cat?.color ? cat.color.replace('bg-', 'text-').replace('-500', '-600') : 'text-slate-500'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-800 text-sm line-clamp-1">{tx.description}</p>
                              <div className="flex items-center flex-wrap gap-2 mt-1 text-[11px] text-slate-400 font-medium">
                                <span>{formattedDate}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md font-bold">{cat?.name || 'Lain-lain'}</span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {member?.name.split(' ')[0]}</span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1"><Wallet className="w-3 h-3" /> {wallet?.name || '-'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-1 sm:mt-0">
                            <span className={`font-black text-base whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
                            </span>
                            
                            <div className="flex items-center gap-1.5 transition-opacity">
                              <button onClick={() => handleOpenEdit(tx)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Ubah Transaksi">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteTransaction(tx.id, tx.type, tx.amount, tx.walletId)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors" title="Hapus Transaksi">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {filteredTransactions.length === 0 && (
                      <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-400 text-sm">
                        Belum ada riwayat transaksi yang cocok dengan filter atau pencarian Anda.
                      </div>
                    )}
                  </div>
                  
                  {/* PAGINATION CONTROLS (Dibawah list transaksi) */}
                  {filteredTransactions.length > 0 && (
                    <div className="flex items-center justify-center pt-2 gap-5">
                      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="flex gap-1.5">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* HALAMAN INPUT TRANSAKSI BARU (BULK INPUT) */
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingTx(false)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                        title="Kembali"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                      </button>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">Formulir Input Massal</h3>
                        <p className="text-xs text-slate-500">Tambahkan beberapa catatan keuangan sekaligus.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBulkRow}
                      className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center space-x-1 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Baris</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveBulkTransactions} className="space-y-6">
                    <div className="space-y-4">
                      {bulkTransactions.map((tx, idx) => (
                        <div key={tx.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 relative">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaksi #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveBulkRow(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Hapus baris ini"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            
                            <div className="md:col-span-3">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipe</label>
                              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/55 rounded-lg">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateBulkField(idx, 'type', 'expense')}
                                  className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                                    tx.type === 'expense' 
                                      ? 'bg-blue-600 text-white shadow-sm' 
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  Keluar (-)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateBulkField(idx, 'type', 'income')}
                                  className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                                    tx.type === 'income' 
                                      ? 'bg-emerald-600 text-white shadow-sm' 
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  Masuk (+)
                                </button>
                              </div>
                            </div>

                            <div className="md:col-span-6">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deskripsi</label>
                              <input
                                type="text"
                                placeholder="Contoh: Belanja atau Gaji"
                                value={tx.description}
                                onChange={(e) => handleUpdateBulkField(idx, 'description', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>

                            <div className="md:col-span-3">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nominal (Rp)</label>
                              <input
                                type="number"
                                placeholder="Nominal"
                                value={tx.amount}
                                onChange={(e) => handleUpdateBulkField(idx, 'amount', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>

                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori</label>
                              <select
                                value={tx.categoryId}
                                onChange={(e) => handleUpdateBulkField(idx, 'categoryId', e.target.value)}
                                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                {categories.map(c => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dompet/Sumber Dana</label>
                              <select
                                value={tx.walletId}
                                onChange={(e) => handleUpdateBulkField(idx, 'walletId', e.target.value)}
                                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                {wallets.map(w => (
                                  <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Oleh Anggota</label>
                              <select
                                value={tx.memberId}
                                onChange={(e) => handleUpdateBulkField(idx, 'memberId', e.target.value)}
                                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                {members.map(m => (
                                  <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal</label>
                              <input
                                type="date"
                                value={tx.date}
                                onChange={(e) => handleUpdateBulkField(idx, 'date', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-150">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTx(false);
                          setBulkTransactions([]);
                        }}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all"
                      >
                        Simpan Semua Transaksi
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* MODAL EDIT DATA TRANSAKSI (Sleek Overlay) */}
              {editingTx && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-slate-150 max-w-lg w-full p-6 shadow-xl space-y-4 animate-scaleUp">
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-900 text-base">Ubah Transaksi</h3>
                      <button
                        onClick={() => setEditingTx(null)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditTransaction} className="space-y-4">
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Tipe</label>
                        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setEditingTx({ ...editingTx, type: 'expense' })}
                            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                              editingTx.type === 'expense' 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Keluar (-)
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingTx({ ...editingTx, type: 'income' })}
                            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                              editingTx.type === 'income' 
                                ? 'bg-emerald-600 text-white shadow-sm' 
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Masuk (+)
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Deskripsi</label>
                        <input
                          type="text"
                          value={editingTx.description}
                          onChange={(e) => setEditingTx({ ...editingTx, description: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nominal (Rp)</label>
                        <input
                          type="number"
                          value={editingTx.amount}
                          onChange={(e) => setEditingTx({ ...editingTx, amount: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Kategori</label>
                          <select
                            value={editingTx.categoryId}
                            onChange={(e) => setEditingTx({ ...editingTx, categoryId: e.target.value })}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:ring-1 focus:ring-blue-500"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Dompet</label>
                          <select
                            value={editingTx.walletId}
                            onChange={(e) => setEditingTx({ ...editingTx, walletId: e.target.value })}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:ring-1 focus:ring-blue-500"
                          >
                            {wallets.map(w => (
                              <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                          </select>
                        </div>

                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Anggota</label>
                          <select
                            value={editingTx.memberId}
                            onChange={(e) => setEditingTx({ ...editingTx, memberId: e.target.value })}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:ring-1 focus:ring-blue-500"
                          >
                            {members.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Tanggal</label>
                          <input
                            type="date"
                            value={editingTx.date}
                            onChange={(e) => setEditingTx({ ...editingTx, date: e.target.value })}
                            className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                      </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingTx(null)}
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

            </div>
          )}

          {/* TAB: BUDGETING */}
          {activeTab === 'budgeting' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Monitoring Budget Kategori</h3>
                    <p className="text-xs text-slate-500 mt-1">Pantau penggunaan dana pengeluaran berdasarkan kategori.</p>
                  </div>
                  
                  {/* Range Tanggal */}
                  <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                    <div className="flex items-center px-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="date"
                      value={budgetStartDate}
                      onChange={(e) => setBudgetStartDate(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-slate-700 border-none focus:ring-0 p-0 cursor-pointer"
                    />
                    <span className="text-slate-400 text-xs">-</span>
                    <input
                      type="date"
                      value={budgetEndDate}
                      onChange={(e) => setBudgetEndDate(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-slate-700 border-none focus:ring-0 p-0 cursor-pointer"
                    />
                    {(budgetStartDate || budgetEndDate) && (
                      <button 
                        onClick={() => { setBudgetStartDate(''); setBudgetEndDate(''); }}
                        className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 ml-1"
                        title="Reset Filter"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(() => {
                    let txs = transactions.filter(t => t.type === 'expense');
                    if (budgetStartDate) txs = txs.filter(t => t.date >= budgetStartDate);
                    if (budgetEndDate) txs = txs.filter(t => t.date <= budgetEndDate);
                    
                    const stats = categories.map(cat => {
                      const spent = txs.filter(t => t.categoryId === cat.id).reduce((sum, t) => sum + t.amount, 0);
                      const percentage = cat.budget > 0 ? Math.min((spent / cat.budget) * 100, 100) : 0;
                      return { ...cat, spent, percentage };
                    }).sort((a, b) => b.spent - a.spent);

                    return stats.map(cat => {
                      const iconMap = { Utensils, Car, FileText, Tv, HeartPulse, Grid };
                      const IconComponent = cat.icon && iconMap[cat.icon] ? iconMap[cat.icon] : Grid;
                      
                      const isOverBudget = cat.spent > cat.budget;
                      const isWarning = !isOverBudget && cat.percentage > 80;
                      
                      let barColor = 'bg-blue-500';
                      if (isOverBudget) barColor = 'bg-rose-500';
                      else if (isWarning) barColor = 'bg-amber-500';
                      else if (cat.color) barColor = cat.color;
                      
                      return (
                        <div key={cat.id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors bg-slate-50/50">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.color ? cat.color.replace('-500', '-100') : 'bg-slate-100'}`}>
                                <IconComponent className={`w-4 h-4 ${cat.color ? cat.color.replace('bg-', 'text-').replace('-500', '-600') : 'text-slate-500'}`} />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-800">{cat.name}</h4>
                                <p className="text-[10px] font-semibold text-slate-400">Plafon: {formatIDR(cat.budget)}</p>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              <span className={`text-sm font-black ${isOverBudget ? 'text-rose-600' : 'text-slate-800'}`}>
                                {formatIDR(cat.spent)}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 mt-0.5">Terpakai</span>
                            </div>
                          </div>
                          
                          <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${barColor} transition-all duration-700`} 
                              style={{ width: `${Math.max(cat.percentage, 2)}%` }} 
                            />
                          </div>
                          
                          <div className="flex justify-between items-center mt-2.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isOverBudget ? 'bg-rose-100 text-rose-600' : isWarning ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'}`}>
                              {isOverBudget ? 'Over budget!' : isWarning ? 'Hampir habis' : 'Aman'}
                            </span>
                            <span className={`text-xs font-bold ${isOverBudget ? 'text-rose-600' : 'text-slate-600'}`}>
                              {cat.percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}


          {/* TAB 4: DOMPET & AKUN */}
          {activeTab === 'dompet' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {wallets.map(w => (
                  <div key={w.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{w.type}</span>
                        <Wallet className="w-4 h-4 text-slate-400" />
                      </div>
                      <h4 className="font-bold text-base text-slate-900">{w.name}</h4>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-slate-400 font-medium">Saldo Saat Ini</p>
                      <p className="text-lg font-extrabold text-blue-600">{formatIDR(w.balance)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-base text-slate-900 mb-4">Tambahkan Dompet / Rekening Baru</h3>
                <form onSubmit={handleAddWallet} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nama Rekening/Dompet</label>
                    <input
                      type="text"
                      placeholder="Contoh: Dompet Utama, GoPay"
                      value={newWallet.name}
                      onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Saldo Awal</label>
                    <input
                      type="number"
                      placeholder="Contoh: 150000"
                      value={newWallet.balance}
                      onChange={(e) => setNewWallet({ ...newWallet, balance: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Tipe</label>
                    <div className="flex space-x-2">
                      <select
                        value={newWallet.type}
                        onChange={(e) => setNewWallet({ ...newWallet, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900"
                      >
                        <option value="Bank">Bank</option>
                        <option value="E-Wallet">E-Wallet</option>
                        <option value="Tunai">Tunai</option>
                        <option value="Investasi">Investasi</option>
                      </select>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all whitespace-nowrap"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* TAB: PENGATURAN */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* DESKTOP: Tab Bar horizontal */}
              <div className="hidden md:flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto space-x-1 custom-scrollbar">
                <button onClick={() => setActiveSettingsTab('kategori')} className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${activeSettingsTab === 'kategori' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>Manajemen Kategori</button>
                <button onClick={() => setActiveSettingsTab('budget')} className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${activeSettingsTab === 'budget' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>Budgeting Bulanan</button>
                <button onClick={() => setActiveSettingsTab('history_budget')} className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${activeSettingsTab === 'history_budget' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>History Budgeting</button>
                <button onClick={() => setActiveSettingsTab('profile')} className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-all ${activeSettingsTab === 'profile' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>Profil & Preferensi</button>
              </div>

              {/* MOBILE: List Menu vertikal yang nyaman di sentuh */}
              <div className="md:hidden space-y-2 mb-6">
                {[
                  { id: 'kategori', label: 'Manajemen Kategori', icon: Tag, desc: 'Kelola kategori pengeluaran' },
                  { id: 'budget', label: 'Budgeting Bulanan', icon: PieChart, desc: 'Atur anggaran per kategori' },
                  { id: 'history_budget', label: 'History Budgeting', icon: Calendar, desc: 'Riwayat anggaran sebelumnya' },
                  { id: 'profile', label: 'Profil & Preferensi', icon: User, desc: 'Kelola data diri & keamanan' },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeSettingsTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsTab(item.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-colors border ${
                        isActive
                          ? 'bg-blue-50 border-blue-200 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className={`text-sm font-bold ${isActive ? 'text-blue-600' : 'text-slate-700'}`}>{item.label}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>

              {activeSettingsTab === 'kategori' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
                  <h3 className="font-bold text-base text-slate-900 mb-4">Kategori Pengeluaran Saat Ini</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {categories.map(c => (
                      <div key={c.id} className="p-4 rounded-xl border border-slate-100 flex items-center space-x-3 bg-slate-50/50">
                        <span className={`w-4 h-4 rounded-full ${c.color}`} />
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">{c.name}</h4>
                          <span className="text-[10px] text-slate-400 font-bold">Limit: {formatIDR(c.budget)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="font-bold text-slate-900 text-sm mb-3">Buat Kategori Baru</h4>
                    <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nama Kategori</label>
                        <input
                          type="text"
                          placeholder="Contoh: Pendidikan Anak"
                          value={newCat.name}
                          onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Anggaran Bulanan awal</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newCat.budget}
                          onChange={(e) => setNewCat({ ...newCat, budget: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                      >
                        Tambahkan Kategori
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'budget' && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Alokasi Anggaran Bulanan</h3>
                      <p className="text-xs text-slate-500">Batasi pengeluaran per kategori agar kondisi keuangan keluarga tetap sehat.</p>
                    </div>
                    <div className="bg-slate-100 py-2 px-4 rounded-xl text-sm font-bold text-slate-700 flex flex-col items-end">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Anggaran</span>
                      <span className="text-blue-600">{formatIDR(totalBudget)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(cat => {
                      const spent = expenseByCategory[cat.id] || 0;
                      const isOver = spent > cat.budget;
                      const percent = cat.budget > 0 ? Math.min(Math.round((spent / cat.budget) * 100), 100) : 0;

                      return (
                        <div key={cat.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-2.5">
                              <span className={`w-4 h-4 rounded-full ${cat.color}`} />
                              <h4 className="font-bold text-sm text-slate-900 leading-tight">{cat.name}</h4>
                            </div>
                            {isOver && (
                              <span className="bg-rose-50 text-rose-600 text-[9px] px-2 py-0.5 rounded font-bold border border-rose-100 whitespace-nowrap">
                                Over Budget
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                              <span className="font-medium">Sisa Anggaran:</span>
                              <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-700 font-bold'}>
                                {formatIDR(Math.max(0, cat.budget - spent))}
                              </span>
                            </div>
                            
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Atur Budget (Rp)</label>
                            <input
                              type="number"
                              defaultValue={cat.budget}
                              placeholder="Set Budget"
                              onBlur={(e) => handleUpdateBudget(cat.id, e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-bold text-slate-800 transition-all"
                            />
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeSettingsTab === 'history_budget' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">History Budgeting</h3>
                      <p className="text-xs text-slate-500">Evaluasi performa pengeluaran vs anggaran Anda di bulan-bulan sebelumnya.</p>
                    </div>
                    <select className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Tahun 2026</option>
                      <option>Tahun 2025</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {['Juni 2026', 'Mei 2026', 'April 2026'].map((month, idx) => (
                      <div key={idx} className="p-5 border border-slate-100 rounded-xl bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center text-blue-600">
                            <Calendar className="w-5 h-5 mb-0.5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">{month}</h4>
                            <p className="text-xs text-slate-500 font-medium">10 Kategori • 45 Transaksi</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                          <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Budget</p>
                            <p className="text-sm font-bold text-slate-800">Rp 10.000.000</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pengeluaran</p>
                            <p className={`text-sm font-bold ${idx === 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {idx === 0 ? 'Rp 10.500.000' : 'Rp 8.200.000'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSettingsTab === 'profile' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Profil Pengguna</h3>
                    <p className="text-xs text-slate-500">Kelola informasi data diri dan preferensi keamanan akun Anda.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-lg flex items-center justify-center text-blue-600 text-2xl font-black">
                        B
                      </div>
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                        Ubah Foto
                      </button>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nama Lengkap</label>
                          <input type="text" defaultValue="Ayah (Budi)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Alamat Email</label>
                          <input type="email" defaultValue="budi@finkeluarga.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Peran</label>
                          <input type="text" defaultValue="Administrator" disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500 cursor-not-allowed" />
                        </div>
                      </div>
                      <div className="pt-2">
                        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all">
                          Simpan Profil
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />
                  
                  <div>
                    <h4 className="font-bold text-slate-800 mb-4">Ganti Kata Sandi</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                      <input type="password" placeholder="Kata Sandi Saat Ini" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                      <input type="password" placeholder="Kata Sandi Baru" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                      <div>
                        <button className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all">
                          Perbarui Kata Sandi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* TAB 6: ANGGOTA KELUARGA */}
          {activeTab === 'anggota' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header + Tombol Tambah */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Manajemen Anggota Keluarga</h3>
                    <p className="text-xs text-slate-500 mt-1">Kelola anggota keluarga beserta hak akses masing-masing pengguna.</p>
                  </div>
                  <button
                    onClick={() => {
                      setNewMember({ name: '', role: 'Anggota', permissions: [...ROLE_PERMISSIONS['Anggota']] });
                      setShowAddMemberModal(true);
                    }}
                    className="px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-100 self-start sm:self-center"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Tambah Anggota</span>
                  </button>
                </div>

                {/* Daftar Anggota */}
                <div className="space-y-4">
                  {members.map(m => (
                    <div key={m.id} className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${m.avatarColor}`}>
                            {m.name.charAt(0)}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{m.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-500">{m.role}</span>
                              <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded-full font-bold">Aktif</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{(m.permissions || []).length} Hak Akses</span>
                        </div>
                      </div>

                      {/* Permission Checklist */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" /> Hak Akses & Permission
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {AVAILABLE_PERMISSIONS.map(perm => {
                            const hasPermission = (m.permissions || []).includes(perm.key);
                            return (
                              <label
                                key={perm.key}
                                className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                                  hasPermission ? 'bg-blue-50/50' : 'hover:bg-white'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={hasPermission}
                                  onChange={() => handleToggleMemberPermission(m.id, perm.key)}
                                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-bold ${hasPermission ? 'text-blue-700' : 'text-slate-600'}`}>{perm.label}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{perm.desc}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Tambah Anggota Baru */}
              {showAddMemberModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-slate-150 max-w-lg w-full p-6 shadow-xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl">
                          <UserPlus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">Tambah Anggota Baru</h3>
                          <p className="text-[11px] text-slate-400">Daftarkan anggota keluarga baru beserta hak aksesnya</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAddMemberModal(false)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddMember} className="space-y-5">
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nama Lengkap</label>
                        <input
                          type="text"
                          placeholder="Contoh: Adik (Doni)"
                          value={newMember.name}
                          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Peran</label>
                        <select
                          value={newMember.role}
                          onChange={(e) => handleNewMemberRoleChange(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        >
                          <option value="Anggota">Anggota Keluarga</option>
                          <option value="Bendahara">Bendahara</option>
                          <option value="Administrator">Administrator</option>
                        </select>
                      </div>

                      {/* Permission Checklist */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-3 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-blue-600" /> Hak Akses & Permission
                        </label>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1">
                          {AVAILABLE_PERMISSIONS.map(perm => {
                            const isChecked = newMember.permissions.includes(perm.key);
                            return (
                              <label
                                key={perm.key}
                                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                  isChecked ? 'bg-blue-50/70' : 'hover:bg-white'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleTogglePermission(perm.key)}
                                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-bold ${isChecked ? 'text-blue-700' : 'text-slate-600'}`}>{perm.label}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{perm.desc}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setShowAddMemberModal(false)}
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
              )}
            </div>
          )}

          {/* TAB 7: EKSPOR DATA */}
          {activeTab === 'export' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center max-w-xl mx-auto py-10">
                <div className="p-4 bg-blue-50 rounded-full w-fit mx-auto mb-4 text-blue-600">
                  <Download className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Unduh Laporan Keuangan</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Ekspor seluruh data transaksi harian keluarga Anda ke dalam format CSV yang dapat dibuka di Microsoft Excel, Google Sheets, atau aplikasi sejenis untuk analisis lebih lanjut.
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 mb-6 text-left">
                  <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Ringkasan Data yang Diekspor:</h4>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• Total Transaksi: <strong>{transactions.length} baris</strong></li>
                    <li>• Jumlah Kategori Terlibat: <strong>{categories.length} kategori</strong></li>
                    <li>• Rekening/Dompet: <strong>{wallets.length} Akun</strong></li>
                  </ul>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm inline-flex items-center space-x-2 shadow-md shadow-blue-100"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File .CSV</span>
                </button>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* === BOTTOM NAVIGATION BAR (MOBILE ONLY) === */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 px-2 py-1 shadow-2xl flex justify-around">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'pencatatan', label: 'Catat', icon: PlusCircle },
          { id: 'budgeting', label: 'Budget', icon: PieChart },
          { id: 'dompet', label: 'Dompet', icon: Wallet },
          { id: 'anggota', label: 'Keluarga', icon: Users },
          { id: 'settings', label: 'Pengaturan', icon: Settings }
        ].map(item => {
          const IconComponent = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id !== 'pencatatan') {
                  setIsAddingTx(false);
                }
              }}
              className="flex flex-col items-center justify-center py-1 px-3"
            >
              <IconComponent className={`w-5 h-5 mb-0.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
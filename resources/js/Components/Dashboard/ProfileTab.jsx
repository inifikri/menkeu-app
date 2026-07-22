import React from "react";
import { createPortal } from "react-dom";
import {
    BadgeCheck,
    Wallet,
    ChevronRight,
    Shield,
    Laptop,
    Users,
    Activity,
    RotateCcw,
    LogOut,
    ArrowLeft,
    User,
    Upload,
    Mail,
    RefreshCw,
    Check,
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    CheckCircle,
    CheckCircle2,
    UserPlus,
    UserMinus,
    Trash2,
    PlusCircle,
    Tag,
    Monitor,
    Smartphone,
    X,
    Edit,
} from "lucide-react";

export default function ProfileTab({
    currentUser,
    hasPermission,
    activeSettingsTab,
    setActiveSettingsTab,
    wallets,
    members,
    profileData,
    setProfileData,
    profileErrors,
    processingProfile,
    submitProfileUpdate,
    pinMessage,
    currentPasswordForPin,
    setCurrentPasswordForPin,
    newPinCode,
    setNewPinCode,
    confirmNewPinCode,
    setConfirmNewPinCode,
    isPinProcessing,
    handleResetPin,
    trustedDevices,
    isLoadingDevices,
    handleRemoveAllDevices,
    renameDeviceId,
    setRenameDeviceId,
    renameDeviceName,
    setRenameDeviceName,
    handleRenameDevice,
    handleRemoveDevice,
    pwdData,
    setPwdData,
    showPassword,
    setShowPassword,
    pwdErrors,
    processingPwd,
    submitPasswordUpdate,
    generatePassword,
    activeSessions,
    ROLE_PERMISSIONS,
    setNewMember,
    setShowAddMemberModal,
    setSelectedMemberForDetail,
    handleDeleteMember,
    selectedMemberForDetail,
    AVAILABLE_PERMISSIONS,
    showAddMemberModal,
    handleAddMember,
    handleNewMemberRoleChange,
    handleTogglePermission,
    newMember,
    logsPerPage,
    setLogsPerPage,
    logsFrom,
    logsTo,
    logsTotal,
    logsPage,
    logsLastPage,
    fetchLogs,
    isLoadingLogs,
    activityLogs,
    handleLogout,
    setIsResetModalOpen,
    setActiveTab,
}) {
    const formatIDR = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    const evaluatePasswordStrength = (pwd) => {
        let score = 0;
        if (pwd.length > 8) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[a-z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        if (score === 0) return { label: "Kosong", color: "bg-slate-200" };
        if (score <= 2) return { label: "Lemah", color: "bg-rose-500", width: "25%" };
        if (score <= 3) return { label: "Sedang", color: "bg-yellow-500", width: "50%" };
        if (score === 4) return { label: "Kuat", color: "bg-blue-500", width: "75%" };
        return { label: "Sangat Kuat", color: "bg-emerald-500", width: "100%" };
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {activeSettingsTab === "profile" && (
                <>
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                        <div className="p-5 sm:p-6 flex items-center space-x-4 border-b border-slate-100">
                            <div className="relative">
                                {currentUser?.avatar ? (
                                    <img
                                        src={`/storage/${currentUser.avatar}`}
                                        alt="Avatar"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm shrink-0">
                                        {currentUser?.name
                                            ? currentUser.name.charAt(0).toUpperCase()
                                            : "U"}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-slate-900 truncate flex items-center gap-1.5 font-sans">
                                    {currentUser?.name || "User"}
                                    <BadgeCheck className="w-5 h-5 text-white fill-blue-500 flex-shrink-0" />
                                </h2>
                                <p className="text-sm text-slate-500 truncate">
                                    {currentUser?.email || "user@example.com"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveSettingsTab("edit_profile")}
                                className="text-blue-600 hover:text-blue-700 bg-blue-50 p-2 rounded-xl transition-colors"
                            >
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
                                    <p className="text-base font-black text-slate-900 font-sans">
                                        {formatIDR(
                                            wallets.reduce(
                                                (sum, w) => sum + parseFloat(w.balance || 0),
                                                0
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveTab("dompet")}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center"
                            >
                                Kelola <ChevronRight className="w-4 h-4 ml-0.5" />
                            </button>
                        </div>
                    </div>

                    {/* Menu List */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* NOTE: Manajemen Kategori has been removed from profile menu as requested by user */}

                        <button
                            type="button"
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

                        <button
                            type="button"
                            onClick={() => setActiveSettingsTab("trusted_devices")}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-100 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <Laptop className="w-5 h-5 text-slate-400" />
                                <span className="text-sm font-bold text-slate-700">
                                    Perangkat Terpercaya
                                </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </button>

                        {hasPermission("kelola_anggota") && (
                            <button
                                type="button"
                                onClick={() => setActiveSettingsTab("anggota")}
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
                            type="button"
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
                                type="button"
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
                            type="button"
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

            {activeSettingsTab === "edit_profile" && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <button
                            type="button"
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
                                            <img
                                                src={URL.createObjectURL(profileData.avatar)}
                                                alt="Avatar"
                                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-md border-4 border-white"
                                            />
                                        ) : currentUser?.avatar ? (
                                            <img
                                                src={`/storage/${currentUser.avatar}`}
                                                alt="Avatar"
                                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-md border-4 border-white"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl shadow-md border-4 border-white">
                                                {currentUser?.name
                                                    ? currentUser.name.charAt(0).toUpperCase()
                                                    : "U"}
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
                                        onChange={(e) => setProfileData("avatar", e.target.files[0])}
                                    />
                                </div>
                                <div className="text-center sm:text-left flex-1 pt-2">
                                    <h3 className="font-bold text-slate-800 text-lg mb-1">Foto Profil</h3>
                                    <p className="text-sm text-slate-500 max-w-md">
                                        Gunakan foto dengan rasio 1:1. Ukuran maksimal 2MB. (Format: JPG, PNG).
                                    </p>
                                    {profileErrors.avatar && (
                                        <p className="text-xs text-rose-500 mt-1.5">
                                            {profileErrors.avatar}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Form Fields */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Nama Lengkap
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData("name", e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                            placeholder="Masukkan nama lengkap Anda"
                                        />
                                    </div>
                                    {profileErrors.name && (
                                        <p className="text-xs text-rose-500 mt-1.5">
                                            {profileErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Alamat Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData("email", e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                            placeholder="contoh@email.com"
                                        />
                                    </div>
                                    {profileErrors.email && (
                                        <p className="text-xs text-rose-500 mt-1.5">
                                            {profileErrors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    disabled={processingProfile}
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {processingProfile ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Check className="w-5 h-5" />
                                    )}
                                    <span>Simpan Perubahan</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeSettingsTab === "trusted_devices" && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => setActiveSettingsTab("profile")}
                            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Kembali</span>
                        </button>
                        <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-3 font-sans">
                            <Laptop className="w-7 h-7 text-blue-600" />
                            <span>Perangkat Terpercaya</span>
                        </h2>
                    </div>

                    {/* PIN Management */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center space-x-3">
                            <KeyRound className="w-6 h-6 text-slate-400" />
                            <h3 className="font-bold text-slate-800">PIN Keamanan (6 Digit)</h3>
                        </div>
                        <form onSubmit={handleResetPin} className="p-5 sm:p-6 space-y-4">
                            {pinMessage.text && (
                                <div
                                    className={`p-4 rounded-xl text-xs font-semibold ${
                                        pinMessage.type === "success"
                                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                            : "bg-rose-50 text-rose-800 border border-rose-100"
                                    }`}
                                >
                                    {pinMessage.text}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                                    Password Akun (Konfirmasi)
                                </label>
                                <input
                                    type="password"
                                    value={currentPasswordForPin}
                                    onChange={(e) => setCurrentPasswordForPin(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Masukkan password email Anda untuk mengubah PIN"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                                        PIN Baru
                                    </label>
                                    <input
                                        type="password"
                                        value={newPinCode}
                                        maxLength={6}
                                        onChange={(e) =>
                                            setNewPinCode(e.target.value.replace(/\D/g, ""))
                                        }
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="••••••"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                                        Konfirmasi PIN Baru
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmNewPinCode}
                                        maxLength={6}
                                        onChange={(e) =>
                                            setConfirmNewPinCode(e.target.value.replace(/\D/g, ""))
                                        }
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    disabled={isPinProcessing}
                                    type="submit"
                                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {isPinProcessing ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Lock className="w-4 h-4" />
                                    )}
                                    <span>Update PIN Akses</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Trusted Devices List */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Laptop className="w-6 h-6 text-slate-400" />
                                <h3 className="font-bold text-slate-800">Daftar Perangkat Terdaftar</h3>
                            </div>
                            {trustedDevices.length > 1 && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAllDevices}
                                    className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all"
                                >
                                    Hapus Perangkat Lainnya
                                </button>
                            )}
                        </div>

                        <div className="p-5 sm:p-6 divide-y divide-slate-100">
                            {isLoadingDevices ? (
                                <div className="text-center py-6 text-xs text-slate-500 flex items-center justify-center space-x-2">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Memuat daftar perangkat...</span>
                                </div>
                            ) : trustedDevices.length > 0 ? (
                                trustedDevices.map((device) => (
                                    <div
                                        key={device.id}
                                        className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                                    >
                                        <div className="flex space-x-4 flex-1 min-w-0">
                                            <div className="mt-1 shrink-0">
                                                <Laptop className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {renameDeviceId === device.id ? (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={renameDeviceName}
                                                                onChange={(e) =>
                                                                    setRenameDeviceName(e.target.value)
                                                                }
                                                                className="px-2 py-1 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                                                                placeholder="Nama perangkat"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRenameDevice(device.id)
                                                                }
                                                                className="text-xs font-bold text-emerald-600 hover:underline"
                                                            >
                                                                Simpan
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setRenameDeviceId(null)}
                                                                className="text-xs font-bold text-slate-500 hover:underline"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <h4 className="text-sm font-bold text-slate-800 truncate font-sans">
                                                                {device.device_name}
                                                            </h4>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setRenameDeviceId(device.id);
                                                                    setRenameDeviceName(device.device_name);
                                                                }}
                                                                className="text-[10px] text-blue-600 hover:underline font-semibold"
                                                            >
                                                                Edit Nama
                                                            </button>
                                                        </>
                                                    )}

                                                    {device.is_current && (
                                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-md">
                                                            Saat Ini
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-2 gap-y-1">
                                                    <span>OS: {device.platform}</span>
                                                    <span>•</span>
                                                    <span>Browser: {device.browser}</span>
                                                    <span>•</span>
                                                    <span>IP: {device.ip_address}</span>
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    Terdaftar:{" "}
                                                    {new Date(device.created_at).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                    {device.last_login &&
                                                        ` • Login Terakhir: ${new Date(
                                                            device.last_login
                                                        ).toLocaleDateString("id-ID", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}`}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDevice(device.id)}
                                            className="px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic py-4">
                                    Belum ada perangkat terdaftar.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeSettingsTab === "security" && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => setActiveSettingsTab("profile")}
                            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Kembali</span>
                        </button>
                        <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-3 font-sans">
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
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                                    Password Saat Ini
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={pwdData.current_password}
                                        onChange={(e) => setPwdData("current_password", e.target.value)}
                                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Masukkan password lama"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {pwdErrors.current_password && (
                                    <p className="text-xs text-rose-500 mt-1">
                                        {pwdErrors.current_password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-slate-600 uppercase">
                                        Password Baru
                                    </label>
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-lg"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Generate</span>
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={pwdData.password}
                                        onChange={(e) => setPwdData("password", e.target.value)}
                                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Masukkan password baru"
                                    />
                                </div>
                                {pwdErrors.password && (
                                    <p className="text-xs text-rose-500 mt-1">{pwdErrors.password}</p>
                                )}

                                {/* Password Strength Indicator */}
                                {pwdData.password &&
                                    (() => {
                                        const strength = evaluatePasswordStrength(pwdData.password);
                                        return (
                                            <div className="mt-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-slate-500">
                                                        Kekuatan Password
                                                    </span>
                                                    <span
                                                        className={`text-xs font-bold ${strength.color.replace(
                                                            "bg-",
                                                            "text-"
                                                        )}`}
                                                    >
                                                        {strength.label}
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                                    <div
                                                        className={`h-full ${strength.color} transition-all duration-300`}
                                                        style={{ width: strength.width }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                {/* Password Rules */}
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div
                                        className={`flex items-center space-x-1.5 text-xs font-bold ${
                                            /[A-Z]/.test(pwdData.password)
                                                ? "text-emerald-500"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span>Huruf Besar</span>
                                    </div>
                                    <div
                                        className={`flex items-center space-x-1.5 text-xs font-bold ${
                                            /[0-9]/.test(pwdData.password)
                                                ? "text-emerald-500"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span>Angka</span>
                                    </div>
                                    <div
                                        className={`flex items-center space-x-1.5 text-xs font-bold ${
                                            /[^A-Za-z0-9]/.test(pwdData.password)
                                                ? "text-emerald-500"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span>Simbol (!@#)</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={pwdData.password_confirmation}
                                        onChange={(e) =>
                                            setPwdData("password_confirmation", e.target.value)
                                        }
                                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Ulangi password baru"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    disabled={processingPwd}
                                    type="submit"
                                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {processingPwd ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Lock className="w-4 h-4" />
                                    )}
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
                            {activeSessions && activeSessions.length > 0 ? (
                                activeSessions.map((session, i) => (
                                    <div
                                        key={i}
                                        className="py-4 first:pt-0 last:pb-0 flex items-start justify-between"
                                    >
                                        <div className="flex space-x-4">
                                            <div className="mt-1">
                                                {session.user_agent?.toLowerCase().includes("mobile") ? (
                                                    <Smartphone className="w-6 h-6 text-slate-400" />
                                                ) : (
                                                    <Monitor className="w-6 h-6 text-slate-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="text-sm font-bold text-slate-800 font-sans">
                                                        {(() => {
                                                            const agent = session.user_agent || "";
                                                            let browser = "Browser";
                                                            let os = "OS";
                                                            if (agent.includes("Chrome"))
                                                                browser = "Google Chrome";
                                                            else if (agent.includes("Firefox"))
                                                                browser = "Firefox";
                                                            else if (agent.includes("Safari"))
                                                                browser = "Safari";

                                                            if (agent.includes("Mac")) os = "Mac";
                                                            else if (agent.includes("Windows"))
                                                                os = "Windows";
                                                            else if (agent.includes("Linux"))
                                                                os = "Linux";
                                                            else if (agent.includes("Android"))
                                                                os = "Android";
                                                            else if (agent.includes("iPhone"))
                                                                os = "iPhone";

                                                            return `${os} - ${browser}`;
                                                        })()}
                                                    </h4>
                                                    {session.is_current && (
                                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-md">
                                                            Saat Ini
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {session.ip_address} • Aktif {session.last_activity}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic">
                                    Informasi sesi tidak tersedia (driver session bukan database).
                                </p>
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
                            type="button"
                            onClick={() => setActiveSettingsTab("profile")}
                            className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Kembali ke Profile</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setNewMember({
                                    id: null,
                                    name: "",
                                    role: "Anggota",
                                    permissions: [...ROLE_PERMISSIONS["Anggota"]],
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
                                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1 font-sans">
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
                                            type="button"
                                            onClick={() => setSelectedMemberForDetail(m)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                            title="Detail"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewMember({
                                                    id: m.id,
                                                    name: m.name,
                                                    role: m.role,
                                                    permissions: [...m.permissions],
                                                });
                                                setShowAddMemberModal(true);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
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
                    {selectedMemberForDetail &&
                        createPortal(
                            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
                                <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 animate-scaleUp">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm ${selectedMemberForDetail.avatarColor}`}
                                            >
                                                {selectedMemberForDetail.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 font-sans">
                                                    {selectedMemberForDetail.name}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {selectedMemberForDetail.role}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {selectedMemberForDetail.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedMemberForDetail(null)}
                                            className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-xl transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-blue-500" />
                                        Hak Akses Aktif:
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1">
                                        {selectedMemberForDetail.permissions.length === 0 ? (
                                            <p className="text-sm text-slate-500 italic col-span-1 sm:col-span-2">
                                                Tidak ada hak akses.
                                            </p>
                                        ) : (
                                            selectedMemberForDetail.permissions.map((permKey) => {
                                                const permObj = AVAILABLE_PERMISSIONS.find(
                                                    (p) => p.key === permKey
                                                );
                                                return (
                                                    <div
                                                        key={permKey}
                                                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">
                                                                {permObj?.label || permKey}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                                                                {permObj?.desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}

                    {/* Modal Tambah/Edit Anggota Baru */}
                    {showAddMemberModal &&
                        createPortal(
                            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl border border-slate-150 max-w-3xl w-full p-6 shadow-xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-xl">
                                                <UserPlus className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-base">
                                                    {newMember.id
                                                        ? "Edit Data Anggota"
                                                        : "Tambah Anggota Baru"}
                                                </h3>
                                                <p className="text-[11px] text-slate-400">
                                                    {newMember.id
                                                        ? "Perbarui informasi dan hak akses anggota"
                                                        : "Daftarkan anggota keluarga baru beserta hak aksesnya"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddMemberModal(false)}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleAddMember} className="space-y-5">
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
                                                        name: e.target.value,
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
                                                    handleNewMemberRoleChange(e.target.value)
                                                }
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
                                                <Shield className="w-3.5 h-3.5 text-blue-600" />{" "}
                                                Hak Akses & Permission
                                            </label>
                                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto">
                                                {AVAILABLE_PERMISSIONS.map((perm) => {
                                                    const isChecked = newMember.permissions.includes(
                                                        perm.key
                                                    );
                                                    return (
                                                        <label
                                                            key={perm.key}
                                                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                                isChecked ? "bg-blue-50/70" : "hover:bg-white"
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() =>
                                                                    handleTogglePermission(perm.key)
                                                                }
                                                                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p
                                                                    className={`text-xs font-bold ${
                                                                        isChecked
                                                                            ? "text-blue-700"
                                                                            : "text-slate-600"
                                                                    }`}
                                                                >
                                                                    {perm.label}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                                    {perm.desc}
                                                                </p>
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
                            </div>,
                            document.body
                        )}
                </div>
            )}

            {/* TAB LOG AKTIVITAS (SETTINGS) */}
            {activeSettingsTab === "logs" && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <button
                            type="button"
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
                                    <p className="text-slate-500 text-sm font-bold">
                                        Belum ada aktivitas terekam.
                                    </p>
                                </div>
                            ) : (
                                activityLogs.map((log) => {
                                    const logDate = new Date(log.date || log.created_at);
                                    const isToday = logDate.toDateString() === new Date().toDateString();
                                    const timeString = logDate.toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });
                                    const dateString = logDate.toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    });

                                    return (
                                        <div
                                            key={log.id}
                                            className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${log.color}`}
                                                >
                                                    {log.icon === "User" && <User className="w-4 h-4" />}
                                                    {log.icon === "LogOut" && (
                                                        <LogOut className="w-4 h-4" />
                                                    )}
                                                    {log.icon === "PlusCircle" && (
                                                        <PlusCircle className="w-4 h-4" />
                                                    )}
                                                    {log.icon === "Edit" && <Edit className="w-4 h-4" />}
                                                    {log.icon === "Trash2" && (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                    {log.icon === "Tag" && <Tag className="w-4 h-4" />}
                                                    {log.icon === "UserPlus" && (
                                                        <UserPlus className="w-4 h-4" />
                                                    )}
                                                    {log.icon === "UserMinus" && (
                                                        <UserMinus className="w-4 h-4" />
                                                    )}
                                                    {log.icon === "Activity" && (
                                                        <Activity className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1 font-sans">
                                                        {log.action}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                                        {log.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-xs font-bold text-slate-700">
                                                    {log.user?.name || "Sistem"}
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-1">
                                                    {isToday ? `Hari ini, ${timeString}` : `${dateString}`}
                                                </div>
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
                                        type="button"
                                        disabled={logsPage === 1 || isLoadingLogs}
                                        onClick={() => fetchLogs(logsPage - 1)}
                                        className="px-3 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-xl disabled:opacity-40 disabled:hover:bg-transparent transition-all font-bold text-slate-600 shadow-sm bg-white"
                                    >
                                        Sebelumnya
                                    </button>
                                    <span className="font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm font-sans">
                                        {logsPage} / {logsLastPage}
                                    </span>
                                    <button
                                        type="button"
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
    );
}

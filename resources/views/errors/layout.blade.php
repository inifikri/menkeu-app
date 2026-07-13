<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') - Menkeu App</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.08), transparent 40%),
                        radial-gradient(circle at bottom left, rgba(244, 63, 94, 0.05), transparent 40%),
                        #0f172a;
        }
        .glass {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(3deg); }
        }
        .float-animation {
            animation: float 6s ease-in-out infinite;
        }
    </style>
</head>
<body class="text-slate-200 antialiased min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center space-y-8 float-animation">
        <!-- Error Illustration / Icon -->
        <div class="relative flex justify-center">
            <div class="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full w-32 h-32 mx-auto"></div>
            <div class="relative z-10 w-24 h-24 rounded-3xl bg-slate-800 border border-slate-700/50 flex items-center justify-center shadow-2xl glass">
                @yield('icon')
            </div>
        </div>

        <!-- Error Card -->
        <div class="glass rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r @yield('gradient')"></div>
            
            <div class="space-y-2">
                <span class="text-xs font-bold tracking-widest text-indigo-400 uppercase">Error @yield('code')</span>
                <h1 class="text-3xl font-black text-white tracking-tight">@yield('headline')</h1>
                <p class="text-sm text-slate-400 leading-relaxed pt-2">@yield('message')</p>
            </div>

            <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 border border-indigo-500/50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    Kembali ke Beranda
                </a>
                <button onclick="window.history.back()" class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-sm font-semibold transition-all duration-200 border border-slate-700 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Sebelumnya
                </button>
            </div>
        </div>

        <!-- Footer -->
        <p class="text-xs text-slate-600 font-mono">Menkeu App &copy; 2026 • Asisten Keuangan Keluarga</p>
    </div>
</body>
</html>

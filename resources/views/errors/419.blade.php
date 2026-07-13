@extends('errors.layout')

@section('title', 'Sesi Berakhir')
@section('code', '419')
@section('gradient', 'from-indigo-500 to-purple-600')
@section('headline', 'Sesi Anda Telah Berakhir')

@section('icon')
<svg class="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
@endsection

@section('message')
Halaman ini sudah terlalu lama didiamkan sehingga kunci keamanannya kedaluwarsa. Silakan muat ulang halaman ini untuk memperbarui sesi Anda.
@endsection

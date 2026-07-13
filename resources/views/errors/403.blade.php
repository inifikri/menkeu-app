@extends('errors.layout')

@section('title', 'Akses Ditolak')
@section('code', '403')
@section('gradient', 'from-red-500 to-rose-600')
@section('headline', 'Akses Terbatas')

@section('icon')
<svg class="w-12 h-12 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
</svg>
@endsection

@section('message')
Anda tidak memiliki izin akses untuk membuka modul ini. Hak akses dibatasi demi menjaga keamanan data keuangan keluarga.
@endsection

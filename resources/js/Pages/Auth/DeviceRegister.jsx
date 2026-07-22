import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { ShieldAlert, Laptop } from 'lucide-react';

export default function DeviceRegister({ hasPin, defaultDeviceName }) {
    const { data, setData, post, processing, errors } = useForm({
        device_name: defaultDeviceName || '',
        pin: '',
        pin_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('device.register.store'));
    };

    return (
        <GuestLayout>
            <Head title="Register Trusted Device" />

            <div className="mb-6 text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                    <Laptop className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                    Daftarkan Perangkat Terpercaya
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    Amankan akun Anda dengan mendaftarkan perangkat ini dan membuat PIN akses cepat.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="device_name" value="Nama Perangkat" />
                    <TextInput
                        id="device_name"
                        type="text"
                        name="device_name"
                        value={data.device_name}
                        className="mt-1 block w-full text-xs"
                        isFocused={true}
                        onChange={(e) => setData('device_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.device_name} className="mt-2" />
                </div>

                {!hasPin && (
                    <div className="space-y-4 border-t border-slate-100 pt-4">
                        <div>
                            <InputLabel htmlFor="pin" value="Buat PIN Baru (6 Digit)" />
                            <TextInput
                                id="pin"
                                type="password"
                                name="pin"
                                value={data.pin}
                                className="mt-1 block w-full text-xs font-mono text-center tracking-widest"
                                maxLength="6"
                                placeholder="••••••"
                                onChange={(e) => setData('pin', e.target.value.replace(/\D/g, ''))}
                                required
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                                PIN wajib berupa 6 digit angka numerik.
                            </p>
                            <InputError message={errors.pin} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pin_confirmation" value="Konfirmasi PIN" />
                            <TextInput
                                id="pin_confirmation"
                                type="password"
                                name="pin_confirmation"
                                value={data.pin_confirmation}
                                className="mt-1 block w-full text-xs font-mono text-center tracking-widest"
                                maxLength="6"
                                placeholder="••••••"
                                onChange={(e) => setData('pin_confirmation', e.target.value.replace(/\D/g, ''))}
                                required
                            />
                            {data.pin && data.pin_confirmation && data.pin !== data.pin_confirmation && (
                                <p className="text-xs text-rose-600 mt-1">PIN tidak cocok.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <PrimaryButton className="w-full justify-center" disabled={processing}>
                        Daftarkan Perangkat & Lanjutkan
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

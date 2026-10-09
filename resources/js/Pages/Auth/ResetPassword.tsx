import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="w-full max-w-md bg-card text-card-foreground border border-border shadow-2xl rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative transition-all duration-200">
                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <img
                        src="/infinitedevelopers-logo.svg"
                        alt="Infinite Developers"
                        className="h-11 sm:h-12 w-auto max-w-[200px] object-contain mb-4"
                    />
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                        Set New Password
                    </h1>
                    <p className="text-sm text-foreground/60 mt-1">
                        Please choose a strong, secure new password for your account.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />
                        <div className="relative mt-1.5">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                                <Mail className="h-4 w-4" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors shadow-sm"
                                autoComplete="username"
                                required
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1.5" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="New Password" />
                        <div className="relative mt-1.5">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="w-full pl-9 pr-10 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors shadow-sm"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                autoFocus
                                required
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/40 hover:text-foreground focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1.5" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm New Password" />
                        <div className="relative mt-1.5">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                id="password_confirmation"
                                type={showPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors shadow-sm"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1.5" />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Resetting Password...</span>
                                </>
                            ) : (
                                <>
                                    <KeyRound className="h-4 w-4" />
                                    <span>Reset Password</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}

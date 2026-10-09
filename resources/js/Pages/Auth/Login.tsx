import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            <div className="w-full max-w-md bg-card text-card-foreground border border-border shadow-2xl rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative transition-all duration-200">
                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <img
                        src="/infinitedevelopers-logo.svg"
                        alt="Infinite Developers"
                        className="h-12 sm:h-14 w-auto max-w-[220px] object-contain mb-4"
                    />
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        Admin Portal
                    </h1>
                    <p className="text-sm text-foreground/60 mt-1">
                        Sign in to manage your company operations
                    </p>
                </div>

                {/* Status message */}
                {status && (
                    <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm font-medium text-green-600 dark:text-green-400 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {/* Email Input */}
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
                                placeholder="admin@example.com"
                                autoComplete="username"
                                autoFocus
                                required
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1.5" />
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="password" value="Password" />
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
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
                                autoComplete="current-password"
                                required
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/40 hover:text-foreground focus:outline-none"
                                title={showPassword ? 'Hide password' : 'Show password'}
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

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData(
                                        'remember',
                                        (e.target.checked || false) as false,
                                    )
                                }
                            />
                            <span className="text-sm text-foreground/70">
                                Remember me for 30 days
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="w-full max-w-md bg-card text-card-foreground border border-border shadow-2xl rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative transition-all duration-200">
                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <img
                        src="/infinitedevelopers-logo.svg"
                        alt="Infinite Developers"
                        className="h-11 sm:h-12 w-auto max-w-[200px] object-contain mb-4"
                    />
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                        Reset Password
                    </h1>
                    <p className="text-sm text-foreground/60 mt-1">
                        Enter your email address and we'll send you a password reset link.
                    </p>
                </div>

                {status && (
                    <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm font-medium text-green-600 dark:text-green-400 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
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
                                autoFocus
                                required
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1.5" />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Sending Link...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    <span>Send Password Reset Link</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center pt-2">
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Sign In</span>
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}

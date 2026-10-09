import { PropsWithChildren, useEffect, useState } from 'react';
import { Sun, Moon, Check, Palette } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';

export default function Guest({ children }: PropsWithChildren) {
    const [theme, setTheme] = useState('ocean-orange');
    const [isDark, setIsDark] = useState(false);

    const themes = [
        { id: 'ocean-orange', name: 'Ocean Orange', color: '#004E72' },
        { id: 'natural-green', name: 'Natural Green', color: '#2A5945' },
        { id: 'riviera-terracotta', name: 'Riviera Terracotta', color: '#183451' },
        { id: 'original-green', name: 'Original Green', color: '#2C5745' },
    ];

    useEffect(() => {
        const storedTheme = localStorage.getItem('admin-theme');
        const storedDark = localStorage.getItem('admin-is-dark');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const activeTheme = storedTheme || 'ocean-orange';
        if (storedTheme) setTheme(storedTheme);

        let darkActive: boolean;
        if (storedDark === null) {
            darkActive = systemPrefersDark;
        } else {
            darkActive = storedDark === 'true';
        }

        setIsDark(darkActive);
        document.documentElement.setAttribute('data-theme', darkActive ? 'dark' : activeTheme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = (e: MediaQueryListEvent) => {
            if (localStorage.getItem('admin-is-dark') === null) {
                const sysDark = e.matches;
                setIsDark(sysDark);
                const currentTheme = localStorage.getItem('admin-theme') || 'ocean-orange';
                document.documentElement.setAttribute('data-theme', sysDark ? 'dark' : currentTheme);
            }
        };

        mediaQuery.addEventListener('change', handleSystemChange);
        return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }, []);

    const changeTheme = (newTheme: string) => {
        setTheme(newTheme);
        setIsDark(false);
        localStorage.setItem('admin-theme', newTheme);
        localStorage.setItem('admin-is-dark', 'false');
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const toggleDark = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        localStorage.setItem('admin-is-dark', String(newDark));
        if (newDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            const currentTheme = localStorage.getItem('admin-theme') || 'ocean-orange';
            document.documentElement.setAttribute('data-theme', currentTheme);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-between items-center relative transition-colors duration-300 px-4 py-6 sm:py-10 selection:bg-primary selection:text-primary-foreground">
            {/* Background Ambient Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
                <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
            </div>

            {/* Top Bar: Theme Controls */}
            <header className="w-full max-w-6xl flex justify-end items-center mb-4">
                <div className="flex items-center gap-2 bg-card/60 backdrop-blur-md border border-border px-3 py-1.5 rounded-full shadow-sm">
                    {/* Theme Selector Dropdown */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 text-xs font-medium text-foreground/80 hover:text-foreground px-2 py-1 rounded-md transition-colors"
                                title="Change Theme"
                            >
                                <Palette className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Theme</span>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-card text-card-foreground border border-border shadow-lg">
                            <div className="px-3 py-1.5 text-[11px] font-semibold text-foreground/60 uppercase tracking-wider border-b border-border/50">
                                Light Themes
                            </div>
                            <div className="p-1 space-y-0.5">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            changeTheme(t.id);
                                        }}
                                        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md hover:bg-muted/60 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full border border-border shrink-0"
                                                style={{ backgroundColor: t.color }}
                                            />
                                            <span className={theme === t.id ? 'font-semibold text-foreground' : 'text-foreground/80'}>
                                                {t.name}
                                            </span>
                                        </div>
                                        {theme === t.id && <Check className="w-3.5 h-3.5 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </Dropdown.Content>
                    </Dropdown>

                    <div className="w-px h-4 bg-border" />

                    {/* Dark Mode Toggle */}
                    <button
                        type="button"
                        onClick={toggleDark}
                        className="flex items-center gap-1.5 text-xs font-medium text-foreground/80 hover:text-foreground px-2 py-1 rounded-md transition-colors"
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDark ? (
                            <>
                                <Sun className="w-3.5 h-3.5 text-warning" />
                                <span className="hidden sm:inline">Light</span>
                            </>
                        ) : (
                            <>
                                <Moon className="w-3.5 h-3.5 text-primary" />
                                <span className="hidden sm:inline">Dark</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content Card Container */}
            <main className="w-full flex-1 flex flex-col justify-center items-center z-10 my-auto">
                {children}
            </main>

            {/* Footer */}
            <footer className="w-full max-w-6xl mt-8 pt-4 text-center text-xs text-foreground/60">
                <p>© {new Date().getFullYear()} Infinite Developers. All rights reserved.</p>
                <p className="mt-1 text-[11px] text-foreground/40">Secure Company Administration Portal</p>
            </footer>
        </div>
    );
}

import { useState, useEffect, PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users, 
    FolderKanban, 
    Globe, 
    Server, 
    FileText, 
    Bell, 
    Activity,
    Menu,
    X,
    User,
    Check,
    Sun,
    Moon,
    ShieldCheck,
    Monitor
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import GlobalSearch from '@/Components/GlobalSearch';
import { usePermissions } from '@/Hooks/usePermissions';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const { can, isAdmin } = usePermissions();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Theme System
    const [theme, setTheme] = useState('ocean-orange');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedTheme  = localStorage.getItem('admin-theme');
        const storedDark   = localStorage.getItem('admin-is-dark');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const activeTheme = storedTheme || 'ocean-orange';
        if (storedTheme) setTheme(storedTheme);

        // If user has never manually set dark mode, follow the OS
        let darkActive: boolean;
        if (storedDark === null) {
            // No manual preference stored → follow OS
            darkActive = systemPrefersDark;
        } else {
            darkActive = storedDark === 'true';
        }

        setIsDark(darkActive);
        document.documentElement.setAttribute('data-theme', darkActive ? 'dark' : activeTheme);

        // Listen for OS dark mode changes (only when user hasn't manually overridden)
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = (e: MediaQueryListEvent) => {
            // Only follow the OS if the user hasn't manually set a preference
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
        // Store the manual override so OS auto-detection is suspended
        localStorage.setItem('admin-is-dark', String(newDark));
        document.documentElement.setAttribute('data-theme', newDark ? 'dark' : theme);
    };

    const themes = [
        { id: 'ocean-orange', name: 'Ocean Orange', color: '#004E72' },
        { id: 'natural-green', name: 'Natural Green', color: '#2A5945' },
        { id: 'riviera-terracotta', name: 'Riviera Terracotta', color: '#183451' },
        { id: 'original-green', name: 'Original Green', color: '#2C5745' },
    ];

    // Build navigation based on permissions
    const allNavItems = [
        { name: 'Dashboard',     href: route('dashboard'),           current: route().current('dashboard'),        icon: LayoutDashboard, permission: 'dashboard.view' },
        { name: 'Clients',       href: route('clients.index'),       current: route().current('clients.*'),        icon: Users,           permission: 'clients.view' },
        { name: 'Projects',      href: route('projects.index'),      current: route().current('projects.*'),       icon: FolderKanban,    permission: 'projects.view' },
        { name: 'Domains',       href: route('domains.index'),       current: route().current('domains.*'),        icon: Globe,           permission: 'domains.view' },
        { name: 'Servers',       href: route('servers.index'),       current: route().current('servers.*'),        icon: Server,          permission: 'servers.view' },
        { name: 'AMC',           href: route('amc.index'),           current: route().current('amc.*'),            icon: FileText,        permission: 'amc.view' },
        { name: 'Reminders',     href: route('reminders.index'),     current: route().current('reminders.*'),      icon: Bell,            permission: 'reminders.view' },
        { name: 'Activity Logs', href: route('activity-logs.index'), current: route().current('activity-logs.*'), icon: Activity,        permission: 'activity_logs.view' },
    ];

    const navigation = allNavItems.filter(item => can(item.permission));

    // Admin-only nav
    const adminNavItems = isAdmin() ? [
        { name: 'User Management', href: route('users.index'), current: route().current('users.*'), icon: ShieldCheck },
    ] : [];

    return (
        <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground 
                transition-transform duration-200 ease-in-out lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="relative flex h-16 shrink-0 items-center justify-center px-4 bg-sidebar border-b border-sidebar-foreground/10">
                    <img
                        src="/infinitedevelopers-logo.svg"
                        alt="Infinite Developers"
                        className="h-10 w-auto max-w-[180px] object-contain"
                    />
                    <button 
                        className="absolute right-4 lg:hidden text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <nav className="flex flex-1 flex-col px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                                ${item.current 
                                    ? 'bg-black/25 text-sidebar-foreground shadow-sm' 
                                    : 'text-sidebar-foreground/80 hover:bg-black/10 hover:text-sidebar-foreground'
                                }
                            `}
                        >
                            <item.icon
                                className={`
                                    mr-3 h-5 w-5 shrink-0 transition-colors
                                    ${item.current ? 'text-sidebar-foreground' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground/80'}
                                `}
                            />
                            {item.name}
                        </Link>
                    ))}

                    {adminNavItems.length > 0 && (
                        <>
                            <div className="mt-4 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                                Administration
                            </div>
                            {adminNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                                        ${item.current 
                                            ? 'bg-black/25 text-sidebar-foreground shadow-sm' 
                                            : 'text-sidebar-foreground/80 hover:bg-black/10 hover:text-sidebar-foreground'
                                        }
                                    `}
                                >
                                    <item.icon
                                        className={`
                                            mr-3 h-5 w-5 shrink-0 transition-colors
                                            ${item.current ? 'text-sidebar-foreground' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground/80'}
                                        `}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </>
                    )}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:pl-64 min-h-screen">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8 transition-colors">
                    <div className="flex items-center gap-x-3">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-foreground/70 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        {/* Global Search Component */}
                        <GlobalSearch />

                        <button type="button" className="-m-2.5 p-2.5 text-foreground/50 hover:text-foreground">
                            <span className="sr-only">View notifications</span>
                            <Bell className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {/* Separator */}
                        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

                        {/* User dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-x-2 text-sm font-medium leading-6 text-foreground hover:text-foreground/80 outline-none">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors">
                                        <User className="h-4 w-4" />
                                    </span>
                                    <span className="hidden lg:block">{user.name}</span>
                                    <svg className="hidden lg:block h-4 w-4 text-foreground/50" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-card text-card-foreground border border-border shadow-md">
                                <div className="block px-4 py-2 text-xs text-foreground/50 border-b border-border/50">
                                    {user.email}
                                </div>
                                
                                <div className="px-4 py-2 text-xs font-semibold text-foreground/60 uppercase tracking-wider mt-1">
                                    Appearance
                                </div>
                                <div className="px-2 pb-2 border-b border-border/50">
                                    {themes.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                changeTheme(t.id);
                                            }}
                                            className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-4 h-4 rounded-full border border-border" 
                                                    style={{ backgroundColor: t.color }}
                                                />
                                                <span className={theme === t.id ? 'font-medium text-foreground' : 'text-foreground/80'}>
                                                    {t.name}
                                                </span>
                                            </div>
                                            {theme === t.id && <Check className="h-4 w-4 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="px-2 py-2 border-b border-border/50">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleDark();
                                        }}
                                        className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-muted/50 transition-colors text-foreground"
                                    >
                                        <div className="flex items-center gap-2">
                                            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                            <span>Dark Mode</span>
                                        </div>
                                        <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${isDark ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                                            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                    </button>

                                    {/* Reset to OS auto-detection */}
                                    {typeof window !== 'undefined' && localStorage.getItem('admin-is-dark') !== null && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                localStorage.removeItem('admin-is-dark');
                                                const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                                setIsDark(sysDark);
                                                const currentTheme = localStorage.getItem('admin-theme') || 'ocean-orange';
                                                document.documentElement.setAttribute('data-theme', sysDark ? 'dark' : currentTheme);
                                            }}
                                            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground mt-0.5"
                                        >
                                            <Monitor className="h-3.5 w-3.5" />
                                            <span>Use system setting</span>
                                        </button>
                                    )}
                                </div>

                                <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {header && (
                        <div className="mb-6">
                            {header}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}

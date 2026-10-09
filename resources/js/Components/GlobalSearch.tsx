import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Search, Loader2, Users, FolderKanban, Globe, Server, FileText, Command } from 'lucide-react';
import axios from 'axios';

interface SearchResult {
    id: number;
    title: string;
    subtitle: string;
    url: string;
}

interface SearchResults {
    clients: SearchResult[];
    projects: SearchResult[];
    domains: SearchResult[];
    servers: SearchResult[];
    amcs: SearchResult[];
}

export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);
    
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Toggle with Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setQuery('');
            setResults(null);
        }
    }, [isOpen]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Perform search
    useEffect(() => {
        if (!query.trim()) {
            setResults(null);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/search?q=${encodeURIComponent(query)}`);
                setResults(response.data);
            } catch (error) {
                console.error("Search failed:", error);
                setResults(null);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const navigateTo = (url: string) => {
        setIsOpen(false);
        router.visit(url);
    };

    const hasResults = results && (
        results.clients.length > 0 ||
        results.projects.length > 0 ||
        results.domains.length > 0 ||
        results.servers.length > 0 ||
        results.amcs.length > 0
    );

    return (
        <div className="relative z-50">
            {/* Trigger Button (Desktop/Mobile) */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/30 border border-transparent hover:border-border hover:bg-muted/50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
            >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline-block flex-1 text-left">Search clients, projects...</span>
                <span className="hidden sm:flex items-center gap-1 text-[10px] font-medium opacity-60">
                    <Command className="w-3 h-3" /> K
                </span>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity" />
            )}

            {/* Search Popover */}
            {isOpen && (
                <div 
                    ref={searchContainerRef}
                    className="fixed top-16 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl bg-card border border-border shadow-2xl rounded-xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
                >
                    {/* Search Input */}
                    <div className="flex items-center px-4 py-3 border-b border-border bg-card">
                        <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground focus:ring-0 px-0 h-10"
                            placeholder="Search clients, projects, domains, servers or AMC..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {loading && <Loader2 className="w-5 h-5 text-muted-foreground animate-spin ml-3 shrink-0" />}
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="ml-3 p-1 rounded-md text-muted-foreground hover:bg-muted/50 transition-colors"
                        >
                            <span className="text-xs font-semibold px-1">ESC</span>
                        </button>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1 overflow-y-auto">
                        {!query.trim() && (
                            <div className="p-12 text-center text-muted-foreground">
                                <Search className="w-10 h-10 mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium text-foreground">Type to start searching</p>
                                <p className="text-xs mt-1">Search across clients, projects, domains, servers, and AMC.</p>
                            </div>
                        )}

                        {query.trim() && !loading && !hasResults && results && (
                            <div className="p-12 text-center text-muted-foreground">
                                <p className="text-sm font-medium text-foreground">No results found</p>
                                <p className="text-xs mt-1">Try a different search term.</p>
                            </div>
                        )}

                        {hasResults && (
                            <div className="p-2">
                                {/* Clients */}
                                {results.clients.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clients</div>
                                        {results.clients.map(client => (
                                            <button
                                                key={`client-${client.id}`}
                                                onClick={() => navigateTo(client.url)}
                                                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group focus:bg-muted focus:outline-none"
                                            >
                                                <div className="p-2 rounded-md bg-background border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors text-muted-foreground">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="text-sm font-medium text-foreground truncate">{client.title}</span>
                                                    {client.subtitle && <span className="text-xs text-muted-foreground truncate">{client.subtitle}</span>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Projects */}
                                {results.projects.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects</div>
                                        {results.projects.map(project => (
                                            <button
                                                key={`project-${project.id}`}
                                                onClick={() => navigateTo(project.url)}
                                                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group focus:bg-muted focus:outline-none"
                                            >
                                                <div className="p-2 rounded-md bg-background border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors text-muted-foreground">
                                                    <FolderKanban className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="text-sm font-medium text-foreground truncate">{project.title}</span>
                                                    {project.subtitle && <span className="text-xs text-muted-foreground truncate">{project.subtitle}</span>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Domains */}
                                {results.domains.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Domains</div>
                                        {results.domains.map(domain => (
                                            <button
                                                key={`domain-${domain.id}`}
                                                onClick={() => navigateTo(domain.url)}
                                                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group focus:bg-muted focus:outline-none"
                                            >
                                                <div className="p-2 rounded-md bg-background border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors text-muted-foreground">
                                                    <Globe className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="text-sm font-medium text-foreground truncate">{domain.title}</span>
                                                    {domain.subtitle && <span className="text-xs text-muted-foreground truncate">{domain.subtitle}</span>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Servers */}
                                {results.servers.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Servers</div>
                                        {results.servers.map(server => (
                                            <button
                                                key={`server-${server.id}`}
                                                onClick={() => navigateTo(server.url)}
                                                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group focus:bg-muted focus:outline-none"
                                            >
                                                <div className="p-2 rounded-md bg-background border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors text-muted-foreground">
                                                    <Server className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="text-sm font-medium text-foreground truncate">{server.title}</span>
                                                    {server.subtitle && <span className="text-xs text-muted-foreground truncate">{server.subtitle}</span>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* AMCs */}
                                {results.amcs.length > 0 && (
                                    <div className="mb-1">
                                        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">AMC</div>
                                        {results.amcs.map(amc => (
                                            <button
                                                key={`amc-${amc.id}`}
                                                onClick={() => navigateTo(amc.url)}
                                                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group focus:bg-muted focus:outline-none"
                                            >
                                                <div className="p-2 rounded-md bg-background border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors text-muted-foreground">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="text-sm font-medium text-foreground truncate">{amc.title}</span>
                                                    {amc.subtitle && <span className="text-xs text-muted-foreground truncate">{amc.subtitle}</span>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

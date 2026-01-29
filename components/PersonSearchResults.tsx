import React, { useState } from 'react';
import { User, Building2, ArrowUpDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { PersonCompanyResult } from '../types';
import { CompanyRoleCard } from './CompanyRoleCard';

interface PersonSearchResultsProps {
    personName: string;
    results: PersonCompanyResult[];
    onCompanyClick: (result: PersonCompanyResult) => void;
    onBack: () => void;
}

type SortMode = 'default' | 'shareholding' | 'alphabetical';
type FilterMode = 'all' | 'directors' | 'shareholders' | 'active-only';

const RESULTS_PER_PAGE = 50;

export const PersonSearchResults: React.FC<PersonSearchResultsProps> = ({
    personName,
    results,
    onCompanyClick,
    onBack
}) => {
    const [sortMode, setSortMode] = useState<SortMode>('default');
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter results
    const filteredResults = results.filter(r => {
        if (filterMode === 'directors') return r.isDirector;
        if (filterMode === 'shareholders') return r.shareholding > 0;
        if (filterMode === 'active-only') {
            // Only active companies AND where person has active role (not resigned)
            const isCompanyActive = (r.entityStatusCode || 0) < 80;
            const isRoleActive = !r.isInactive;
            return isCompanyActive && isRoleActive;
        }
        return true;
    });

    // Sort results
    const sortedResults = [...filteredResults].sort((a, b) => {
        if (sortMode === 'shareholding') {
            return b.shareholding - a.shareholding;
        }
        if (sortMode === 'alphabetical') {
            return a.companyName.localeCompare(b.companyName);
        }
        // Default: Directors first, then shareholding
        if (a.isDirector && !b.isDirector) return -1;
        if (!a.isDirector && b.isDirector) return 1;
        return b.shareholding - a.shareholding;
    });

    // Pagination
    const totalPages = Math.ceil(sortedResults.length / RESULTS_PER_PAGE);
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + RESULTS_PER_PAGE;
    const paginatedResults = sortedResults.slice(startIndex, endIndex);

    const directorCount = results.filter(r => r.isDirector).length;
    const shareholderCount = results.filter(r => r.shareholding > 0).length;
    const activeCount = results.filter(r => {
        const isCompanyActive = (r.entityStatusCode || 0) < 80;
        const isRoleActive = !r.isInactive;
        return isCompanyActive && isRoleActive;
    }).length;

    console.log('PersonSearchResults - activeCount:', activeCount, 'total:', results.length);

    return (
        <div id="person-search-results" className="absolute inset-0 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={onBack}
                    className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                    <ChevronLeft size={16} />
                    Back to search
                </button>

                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-purple-500 rounded-full">
                        <User className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {personName}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {results.length} {results.length === 1 ? 'company' : 'companies'} found
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mt-4">
                    <div className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Directorships</p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{directorCount}</p>
                    </div>
                    <div className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Shareholdings</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{shareholderCount}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 items-center">
                {/* Sort */}
                <div className="flex items-center gap-2">
                    <ArrowUpDown size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Sort:</span>
                    <select
                        value={sortMode}
                        onChange={(e) => {
                            setSortMode(e.target.value as SortMode);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="default">Directors First</option>
                        <option value="shareholding">Shareholding %</option>
                        <option value="alphabetical">Alphabetical</option>
                    </select>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Filter:</span>
                    <select
                        value={filterMode}
                        onChange={(e) => {
                            setFilterMode(e.target.value as FilterMode);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">🔄 All ({results.length})</option>
                        <option value="active-only">✅ Active Only ({activeCount})</option>
                        <option value="directors">👔 Directors Only ({directorCount})</option>
                        <option value="shareholders">📊 Shareholders Only ({shareholderCount})</option>
                    </select>
                </div>

                <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                    Showing {startIndex + 1}-{Math.min(endIndex, sortedResults.length)} of {sortedResults.length}
                </div>
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                {paginatedResults.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
                        <p className="text-gray-500 dark:text-gray-400">No companies found with selected filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {paginatedResults.map((result) => (
                            <CompanyRoleCard
                                key={result.nzbn}
                                result={result}
                                onClick={() => onCompanyClick(result)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 7) {
                                pageNum = i + 1;
                            } else if (currentPage <= 4) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 3) {
                                pageNum = totalPages - 6 + i;
                            } else {
                                pageNum = currentPage - 3 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === pageNum
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            )}
        </div>
    );
};

import React, { useState, useMemo, useEffect } from 'react';
import { UserItem, UserAccountStatus, JobItem, NavigationSourceContext } from '../types';
import { MOCK_USERS, MOCK_JOBS } from '../data/mockData';
import { UserTable } from '../components/UserTable';
import { UserCard } from '../components/UserCard';
import { Pagination } from '../components/Pagination';
import { UserDetailsModal } from '../components/UserDetailsModal';
import { NavigationContextBar } from '../components/NavigationContextBar';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react';

type FilterTab = 'all' | 'active' | 'blocked';

const PAGE_SIZE = 8;

interface UserManagementPageProps {
  jobs?: JobItem[];
  initialUserId?: string | null;
  navContext?: NavigationSourceContext | null;
  navStack?: NavigationSourceContext[];
  onReturnToSource?: () => void;
  onNavigateToStackIndex?: (index: number) => void;
  onNavigateToJob?: (jobId: string, userId: string) => void;
  onNavigateToJobsWithUserFilter?: (userId: string, status?: string) => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({
  jobs = MOCK_JOBS,
  initialUserId,
  navContext,
  navStack = [],
  onReturnToSource,
  onNavigateToStackIndex,
  onNavigateToJob,
  onNavigateToJobsWithUserFilter,
}) => {
  const [users, setUsers] = useState<UserItem[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<UserItem | null>(null);

  // If initialUserId passed from another module, open modal
  useEffect(() => {
    if (initialUserId) {
      const found = users.find((u) => u.id.toLowerCase() === initialUserId.toLowerCase());
      if (found) {
        setSelectedUserForDetails(found);
      }
    }
  }, [initialUserId, users]);

  // Statistics
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === 'Active').length;
  const blockedCount = users.filter((u) => u.status === 'Blocked').length;

  // Filter and Search Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Tab filter
      if (activeTab === 'active' && user.status !== 'Active') return false;
      if (activeTab === 'blocked' && user.status !== 'Blocked') return false;

      // Search filter (name, phone, user ID)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = user.name.toLowerCase().includes(query);
        const matchesPhone = user.phone.toLowerCase().includes(query);
        const matchesId = user.id.toLowerCase().includes(query);
        return matchesName || matchesPhone || matchesId;
      }

      return true;
    });
  }, [users, activeTab, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  const getFormattedNow = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { dateStr, timeStr };
  };

  // Status Change Handler (Block / Unblock with mandatory block reason and Activity log)
  const handleUpdateStatus = (userId: string, newStatus: UserAccountStatus, reason?: string) => {
    const { dateStr, timeStr } = getFormattedNow();

    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const newActivity = {
      id: `uact-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      activity: 'Account Status Changed' as const,
      details:
        newStatus === 'Blocked'
          ? `Account placed on Administrative Block. Official reason: ${reason}`
          : 'Account access restored to Active status by Administrative Officer.',
    };

    const updatedUser: UserItem = {
      ...target,
      status: newStatus,
      blockReason: newStatus === 'Blocked' ? reason : undefined,
      activity: [newActivity, ...(target.activity || [])],
    };

    const updatedList = users.map((u) => (u.id === userId ? updatedUser : u));
    setUsers(updatedList);
    if (selectedUserForDetails && selectedUserForDetails.id === userId) {
      setSelectedUserForDetails(updatedUser);
    }
  };

  // Admin Note Handler (appends note and logs to user activity)
  const handleUpdateAdminNote = (userId: string, newNote: string) => {
    const { dateStr, timeStr } = getFormattedNow();

    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const newActivity = {
      id: `uact-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      activity: 'Admin Note Updated' as const,
      details: `Internal officer remark updated: "${newNote}"`,
    };

    const updatedUser: UserItem = {
      ...target,
      adminNote: newNote,
      activity: [newActivity, ...(target.activity || [])],
    };

    const updatedList = users.map((u) => (u.id === userId ? updatedUser : u));
    setUsers(updatedList);
    if (selectedUserForDetails && selectedUserForDetails.id === userId) {
      setSelectedUserForDetails(updatedUser);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
    setCurrentPage(1);
  };

  const isFiltered = searchQuery !== '' || activeTab !== 'all';

  return (
    <div className="space-y-5">
      {/* Top Cross-Module Navigation Context Bar */}
      {navContext && onReturnToSource && (
        <NavigationContextBar
          navContext={navContext}
          navStack={navStack}
          onReturnToSource={onReturnToSource}
          onNavigateToStackIndex={onNavigateToStackIndex}
          currentDestinationName="User Management"
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D5DCE3]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#12355B] tracking-tight">User Management</h1>
          <p className="text-xs text-[#5B6573] mt-0.5">
            Manage and review customer accounts and profiles • Citizen Registry & Account Access Control
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting Citizen Registry (CSV)...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F2933] bg-white border border-[#BAC7D5] hover:bg-[#F4F6F8] rounded-sm shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Blocks (Clicking Active/Blocked filters the user table) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Users */}
        <div
          onClick={() => {
            setActiveTab('all');
            setCurrentPage(1);
          }}
          className={`cursor-pointer p-3.5 rounded-sm border transition-all ${
            activeTab === 'all'
              ? 'bg-white border-[#12355B] ring-1 ring-[#12355B] shadow-xs'
              : 'bg-white border-[#D5DCE3] hover:border-[#BAC7D5]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xs bg-[#EAF2F8] text-[#12355B]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6573]">Total Users</span>
                <div className="text-xl font-bold font-mono text-[#1F2933]">{totalCount}</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-xs bg-[#F4F6F8] text-[#5B6573] border border-[#D5DCE3]">
              100%
            </span>
          </div>
        </div>

        {/* Active */}
        <div
          onClick={() => {
            setActiveTab('active');
            setCurrentPage(1);
          }}
          className={`cursor-pointer p-3.5 rounded-sm border transition-all ${
            activeTab === 'active'
              ? 'bg-white border-[#2E7D32] ring-1 ring-[#2E7D32] shadow-xs'
              : 'bg-white border-[#D5DCE3] hover:border-[#BAC7D5]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xs bg-[#E8F5E9] text-[#2E7D32]">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6573]">Active</span>
                <div className="text-xl font-bold font-mono text-[#2E7D32]">{activeCount}</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-xs bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              {Math.round((activeCount / totalCount) * 100)}%
            </span>
          </div>
        </div>

        {/* Blocked */}
        <div
          onClick={() => {
            setActiveTab('blocked');
            setCurrentPage(1);
          }}
          className={`cursor-pointer p-3.5 rounded-sm border transition-all ${
            activeTab === 'blocked'
              ? 'bg-white border-[#B42318] ring-1 ring-[#B42318] shadow-xs'
              : 'bg-white border-[#D5DCE3] hover:border-[#BAC7D5]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xs bg-[#FFEBEE] text-[#B42318]">
                <UserX className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6573]">Blocked</span>
                <div className="text-xl font-bold font-mono text-[#B42318]">{blockedCount}</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-xs bg-[#FFEBEE] text-[#B42318] border border-[#FFCDD2]">
              {Math.round((blockedCount / totalCount) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Table & Filters Container */}
      <div className="bg-white rounded-sm border border-[#D5DCE3] shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-3 border-b border-[#D5DCE3] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#F4F6F8]">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-[#E2E8F0] rounded-xs self-start">
            <button
              onClick={() => {
                setActiveTab('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-xs text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-[#12355B] shadow-xs'
                  : 'text-[#5B6573] hover:text-[#12355B]'
              }`}
            >
              All Users ({totalCount})
            </button>
            <button
              onClick={() => {
                setActiveTab('active');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-xs text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-white text-[#2E7D32] shadow-xs'
                  : 'text-[#5B6573] hover:text-[#2E7D32]'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => {
                setActiveTab('blocked');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-xs text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'blocked'
                  ? 'bg-white text-[#B42318] shadow-xs'
                  : 'text-[#5B6573] hover:text-[#B42318]'
              }`}
            >
              Blocked ({blockedCount})
            </button>
          </div>

          {/* Search Box & Reset */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6573]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by Name, Mobile, or User ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#BAC7D5] rounded-xs text-[#1F2933] placeholder-[#8795A5] focus:outline-none focus:border-[#12355B] focus:ring-1 focus:ring-[#12355B]"
              />
            </div>

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-[#B42318] hover:text-[#911810] px-2 py-1.5 bg-white border border-[#FFCDD2] rounded-xs font-semibold cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Content View */}
        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-[#5B6573]">
            <Users className="w-8 h-8 mx-auto text-[#BAC7D5] mb-2" />
            <p className="text-xs font-bold text-[#1F2933] uppercase">No users found</p>
            <p className="text-[11px] text-[#5B6573] mt-0.5">
              No users match your selected filters.
            </p>
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="mt-3 px-3 py-1 text-xs font-semibold text-[#12355B] bg-[#EAF2F8] border border-[#BAC7D5] rounded-xs hover:bg-[#12355B] hover:text-white transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <UserTable
                users={paginatedUsers}
                jobs={jobs}
                onViewDetails={(user) => setSelectedUserForDetails(user)}
                onNavigateToJobs={(userId) => {
                  if (onNavigateToJobsWithUserFilter) {
                    onNavigateToJobsWithUserFilter(userId);
                  }
                }}
              />
            </div>

            {/* Mobile Card Grid View */}
            <div className="md:hidden p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paginatedUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  jobs={jobs}
                  onViewDetails={(u) => setSelectedUserForDetails(u)}
                  onNavigateToJobs={(userId) => {
                    if (onNavigateToJobsWithUserFilter) {
                      onNavigateToJobsWithUserFilter(userId);
                    }
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              pageSize={PAGE_SIZE}
              onPageChange={(page) => setCurrentPage(page)}
              itemLabel="users"
            />
          </>
        )}
      </div>

      {/* User Details Modal (Tabs: Profile & Activity) */}
      <UserDetailsModal
        isOpen={!!selectedUserForDetails}
        user={selectedUserForDetails}
        jobs={jobs}
        onClose={() => setSelectedUserForDetails(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateAdminNote={handleUpdateAdminNote}
        onNavigateToJob={onNavigateToJob}
        onNavigateToJobsWithUserFilter={onNavigateToJobsWithUserFilter}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { OrdersPage } from './pages/OrdersPage';
import { VoicePage } from './pages/VoicePage';
import { AccountPage } from './pages/AccountPage';
import { JobItem, NavTab } from './types';
import { MOCK_JOBS } from './data/mockJobs';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [jobsList, setJobsList] = useState<JobItem[]>(MOCK_JOBS);

  const handleUpdateJob = (updatedJob: JobItem) => {
    setJobsList((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            jobsList={jobsList}
            onUpdateJob={handleUpdateJob}
          />
        );
      case 'orders':
        return <OrdersPage />;
      case 'voice':
        return <VoicePage />;
      case 'account':
        return <AccountPage />;
      default:
        return (
          <HomePage
            jobsList={jobsList}
            onUpdateJob={handleUpdateJob}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col font-sans selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* Top Header */}
      <Header
        isAvailable={isAvailable}
        onToggleAvailability={() => setIsAvailable((prev) => !prev)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex w-full">
        {/* Desktop Left Icon-Only Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 min-w-0 md:pl-20 pb-24 md:pb-12 pt-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full transition-all">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
};

export default App;

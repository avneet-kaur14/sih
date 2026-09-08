import React, { useState } from 'react';
import { MOCK_JOBS } from '../data/mockJobs';
import { WorkCard } from '../components/WorkCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { Calendar, Briefcase, CheckCircle2 } from 'lucide-react';
import { JobItem } from '../types';

interface HomePageProps {
  jobsList?: JobItem[];
  onUpdateJob?: (updatedJob: JobItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  jobsList = MOCK_JOBS,
  onUpdateJob,
}) => {
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [localJobs, setLocalJobs] = useState<JobItem[]>(jobsList);
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdate = (updatedJob: JobItem) => {
    setLocalJobs((prev) =>
      prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    );
    if (selectedJob && selectedJob.id === updatedJob.id) {
      setSelectedJob(updatedJob);
    }
    if (onUpdateJob) {
      onUpdateJob(updatedJob);
    }
  };

  const handleToggleReached = (e: React.MouseEvent, job: JobItem) => {
    e.stopPropagation();
    const nextReached = !job.isLocationReached;
    const updated = { ...job, isLocationReached: nextReached };
    handleUpdate(updated);

    if (nextReached) {
      setNotification(`✓ Location marked as reached for "${job.serviceName}"`);
    } else {
      setNotification(`Location unreached for "${job.serviceName}"`);
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleCompleted = (e: React.MouseEvent, job: JobItem) => {
    e.stopPropagation();
    const nextStatus = job.status === 'completed' ? 'accepted' : 'completed';
    const updated = { ...job, status: nextStatus as 'accepted' | 'completed' };
    handleUpdate(updated);

    if (nextStatus === 'completed') {
      setNotification(`✓ Marked "${job.serviceName}" as Completed!`);
    } else {
      setNotification(`Marked "${job.serviceName}" as Incomplete`);
    }
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter accepted & completed jobs scheduled for today
  const todayJobs = localJobs.filter(
    (job: JobItem) => (job.status === 'accepted' || job.status === 'completed') && (job.date === 'today' || !job.date)
  );

  const completedCount = todayJobs.filter((job) => job.status === 'completed').length;

  // Dynamic formatted date
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-brand-primary/10 via-brand-light to-transparent p-5 sm:p-6 rounded-3xl border border-brand-primary/15 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-xs font-semibold text-brand-primary mb-3 shadow-xs border border-brand-primary/20">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateFormatted}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Welcome, <span className="text-brand-primary">Rajesh!</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-muted mt-1 max-w-lg">
            Here are your accepted services for today. Use the Reached and Completed buttons for quick status updates or tap Details to view full customer info.
          </p>

          {/* Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-2">
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-neutral-100 shadow-xs">
              <div className="text-xs text-neutral-muted font-medium">Today's Jobs</div>
              <div className="text-xl font-bold text-neutral-dark mt-0.5">{todayJobs.length} Assigned</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-neutral-100 shadow-xs">
              <div className="text-xs text-neutral-muted font-medium">Completed</div>
              <div className="text-xl font-bold text-[#01471f] mt-0.5">{completedCount} of {todayJobs.length}</div>
            </div>
            <div className="hidden sm:block bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-neutral-100 shadow-xs">
              <div className="text-xs text-neutral-muted font-medium">Schedule Status</div>
              <div className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Active Day
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-neutral-900 text-white text-xs sm:text-sm font-medium rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-neutral-400 hover:text-white ml-2 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Today's Work Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-dark">
                Today's Work
              </h2>
              <p className="text-xs text-neutral-muted">Your accepted services for today.</p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600">
            {completedCount}/{todayJobs.length} Done
          </span>
        </div>

        {/* Work Cards List with Reached, Completed, and Details Buttons */}
        <div className="grid grid-cols-1 gap-3.5">
          {todayJobs.map((job: JobItem) => (
            <WorkCard
              key={job.id}
              job={job}
              showActions={false}
              showCompleteCheckbox={true}
              onToggleReached={handleToggleReached}
              onToggleCompleted={handleToggleCompleted}
              onClick={() => setSelectedJob(job)}
            />
          ))}
        </div>
      </section>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdateJob={handleUpdate}
        />
      )}
    </div>
  );
};

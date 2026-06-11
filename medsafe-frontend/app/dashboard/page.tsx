'use client';

import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { InteractionChecker } from '@/components/interaction-checker';
import { ResultsCard } from '@/components/results-card';
import { useMedSafeStore } from '@/lib/store';

export default function DashboardPage() {
  const { latestResult } = useMedSafeStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Check drug-food interactions with AI</p>
        </header>

        <InteractionChecker />
        <ResultsCard prediction={latestResult} />
      </div>
    </div>
  );
}

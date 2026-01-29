'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MedicationList from '@/components/MedicationList';
import ScheduleView from '@/components/ScheduleView';
import AddMedicationModal from '@/components/AddMedicationModal';

export default function Dashboard() {
  const [user, setUser] = useState<{ userId: string; userName: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState<'medications' | 'schedule' | 'upcoming'>('upcoming');
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (!userId) {
      router.push('/');
      return;
    }
    
    setUser({ userId, userName: userName || 'User' });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Medication Tracker
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user.userName}</span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeView === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveView('schedule')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeView === 'schedule'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveView('medications')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeView === 'medications'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Medications
            </button>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition"
          >
            + Add Medication
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
          {activeView === 'medications' && <MedicationList userId={user.userId} />}
          {activeView === 'schedule' && <ScheduleView userId={user.userId} filter="today" />}
          {activeView === 'upcoming' && <ScheduleView userId={user.userId} filter="upcoming" />}
        </div>
      </div>

      {showAddModal && (
        <AddMedicationModal
          userId={user.userId}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
